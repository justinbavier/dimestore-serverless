import { DimeUserByItemId } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { userUpdate } from '../util/userUpdate';
import { path, prop, map, defaultTo, add, reduce, filter, gt } from 'ramda';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../constants';
import makeDonationOnThreshold from './makeDonationOnThreshold';

const moment = require('moment');
const plaid = require('plaid');

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

export default cors((event, _context, callback) => {
    const body = JSON.parse(event.body);

    return DimeUserByItemId.query(prop('item_id', body))
        .usingIndex('plaidItemId-index')
        .execAsync()
        .then(user => map(prop('attrs'), defaultTo([], path(['Items'], user)))[0])
        .then(user => client.getTransactions(
            prop('plaidAccessToken', user),
            moment().subtract(1, 'days').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
            {
                count: prop('new_transactions', body),
                offset: 0
            })
            .then(res => filter(t => gt(prop('amount', t), 0), map(transformTransaction, defaultTo([], prop('transactions', res)))))
            .then(transactions => {
                const updatedDonationProgress = reduce(add, prop('progress', user), map(t => prop('roundUp', t), transactions));
                const queuedCharities = prop('queuedCharities', user);
                if (updatedDonationProgress >= prop('donationThreshold', user) && queuedCharities.length) {
                    return makeDonationOnThreshold(
                        queuedCharities[0].id,
                        prop('id', user),
                        prop('plaidAccessToken', user),
                        prop('plaidAccountId', user),
                        prop('donationThreshold', user))
                        .then(() => userUpdate({
                            id: prop('id', user),
                            progress: updatedDonationProgress - prop('donationThreshold', user),
                            queuedCharities: queuedCharities.slice(1),
                            transactions: prop('transactions', user) ? [...transactions, ...prop('transactions', user)] : transactions,
                            totalDonated: prop('totalDonated', user) + prop('donationThreshold', user),
                        })
                            .then(() => ok({ success: true }))
                    )
                } else if (queuedCharities && queuedCharities.length) {
                    return userUpdate({
                        id: prop('id', user),
                        transactions: prop('transactions', user) ? [...transactions, ...prop('transactions', user)] : transactions,
                        progress: updatedDonationProgress
                    })
                    .then(() => ok({ success: true }))
                } else {
                    return userUpdate({
                        id: prop('id', user),
                        transactions: prop('transactions', user) ? [...transactions, ...prop('transactions', user)] : transactions
                    })
                    .then(() => ok({ success: true }))
                }
            })
        )
    .catch(error => badRequest({ message: `Bad Request -> ${error}` }))
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

