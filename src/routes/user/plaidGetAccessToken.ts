import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { userUpdate } from '../../util/userUpdate';
import { path, prop } from 'ramda';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../../constants';

const plaid = require('plaid');

// Make this actual URL!!!!!!!!!!!!
const PLAID_WEBHOOK = '';

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    'sandbox'
);

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!id) {
        return callback(null, badRequest(400, { message: `Bad Request -> Missing User ID!` }))
    };

    if (!prop('publicToken', body)) {
        return callback(null, badRequest(400, { message: `Bad Request -> Missing Plaid Public Token!` }))
    };

    if (!prop('accountId', body)) {
        return callback(null, badRequest(400, { message: `Bad Request -> Missing Bank Account ID!` }))
    };

    return client.exchangePublicToken(prop('public_token', body))
        .then(token => client.updateItemWebhook(prop('access_token', token), PLAID_WEBHOOK)
                .then(() => 
                    userUpdate({
                        id,
                        plaidItemId: prop('item_id', token),
                        plaidAccessToken: prop('access_token', token),
                        plaidAccountId: prop('accountId', body)
                     }))
                        .then(user => callback(null, ok({ 
                            success: true,
                            user: path(['attrs'], user)
                        })))
        )
        .catch(error => callback(null, badRequest({ message: `Bad Request -> ${error}` })))
});