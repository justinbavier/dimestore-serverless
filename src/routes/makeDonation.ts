import { DimeUser, DimeCharity, DimeDonation } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { userUpdate } from '../util/userUpdate';
import { path, prop } from 'ramda';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../constants';

const uuidv1 = require('uuid/v1')
const plaid = require('plaid');
// This is the test secret until we go live
const stripe = require('stripe')('sk_test_WiBXa2wYdXWnv8oQpaSzoeBn');

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

const createDonation = options => DimeDonation.create(options);

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!prop('userId', body)) {
        return callback(null, badRequest(404, { message: 'Bad Request -> Missing User ID!' }) )
    }

    return DimeCharity.get(id)
        .then(charity => path(['attrs'], charity))
        .then(charity => DimeUser.get(prop('userId', body))
            .then(user => path(['attrs'], user))
            .then(user => {
                if (!prop('plaidAccessToken', user) || !prop('plaidAccountId', user)) {
                    return callback(null, badRequest(400, { message: 'Bad Request -> Plaid Access Token does not exist!' }))
                }
                return client.createStripeToken(prop('plaidAccessToken', user), prop('plaidAccountId', user))
                    .then(res => stripe.charges.create({
                        amount: prop('amount', body),
                        currency: 'usd',
                        description: `Donation to ${prop('name', charity)}`,
                        source: prop('stripe_bank_account_token', res)
                    }))
                        .then(() => createDonation({
                            id: uuidv1(),
                            donorId: prop('userId', body),
                            charityId: id,
                            charityName: prop('name', charity),
                            amount: prop('amount', body)
                        }))
                            .then(donation => 
                                userUpdate({ 
                                    id: prop('userId', body), 
                                    totalDonated: prop('totalDonated', user) + prop('amount', body )
                                })
                                .then(user => callback(null, ok({
                                    success: true,
                                    user: path(['attrs'], user),
                                    donation: path(['attrs'], donation)
                                }))))
            })
    .catch(error => callback(null, badRequest({ message: `Bad Request -> ${error}` }))))
})