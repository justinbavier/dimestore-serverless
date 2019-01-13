import { DimeUser } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { userUpdate } from '../util/userUpdate';
import { prop, map, defaultTo, gt, filter } from 'ramda';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../constants';
const plaid = require('plaid');
const moment = require('moment');

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

export default cors((event, _context, _callback) => {
    const { id } = event.pathParameters;

    return DimeUser.get(id)
        .then(res => {
            if (!res) {
                return badRequest(404, { message: 'User not found!'})
            } else {
                const user = prop('attrs', res);
                const plaidAccessToken = prop('plaidAccessToken', user);
                const currentTransactions = defaultTo([], prop('transactions', user));
                if (!plaidAccessToken) return badRequest(403, { message: 'User has not initialized Plaid!' })
                return client.getTransactions(
                    plaidAccessToken,
                    moment().subtract(1, 'years').format('YYYY-MM-DD'),
                    moment().format('YYYY-MM-DD'),
                )
                    .then(plaidRes => 
                        filter(t => gt(prop('amount', t), 0), map(transformTransaction, defaultTo([], prop('transactions', plaidRes))))
                    )
                    .then(transactions => 
                        userUpdate({
                            id: prop('id', user),
                            transactions: [...transactions, ...currentTransactions]
                        })
                            .then(() => 
                                ok({ success: true, transactions }))
                            .catch(err => 
                                badRequest(403, { message: err.message || err }))
                    )
                    .catch(err => badRequest(402, { message: err.message || err }))
            }
        })
        .catch(err => badRequest(402, { message: err.message || err }))
});

const transformTransaction = t => ({
    accountId: prop('account_id', t),
    transactionId: prop('transaction_id', t),
    name: prop('name', t),
    amount: prop('amount', t),
    // MAKE THIS BETTER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    roundUp: Number(Number(Math.ceil(prop('amount', t)) - prop('amount', t)).toFixed(2)),
    date: prop('date', t)
});
