import { DimeUserByItemId } from '../../models';
import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { userUpdate } from '../../util/userUpdate';
import { path, prop, map, defaultTo, add, reduce } from 'ramda';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../../constants';
import makeDonationOnThreshold from './makeDonationOnThreshold';

const moment = require('moment');
const plaid = require('plaid');

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    'sandbox'
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
            moment().format('YYYY_MM_DD'),
            {
                count: prop('new_transactions', body),
                offset: 0
            })
            .then(res => map(transformTransaction, defaultTo([], prop('transactions', res))))
            .then(transactions => {
                const updatedDonationProgress = reduce(add, prop('progress', user), transactions);
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
                            transactions,
                            totalDonated: prop('totalDonated', user) + prop('donationThreshold', user),
                        })
                            .then(() => callback(null, ok({ success: true })))
                    )
                } else {
                    return userUpdate({
                        id: prop('id', user),
                        transactions,
                        progress: prop('progress', user) +  updatedDonationProgress
                    })
                        .then(() => callback(null, ok({ success: true })))
                }
            })
        )
    .catch(error => callback(null, badRequest({ message: `Bad Request -> ${error}` })))
});

const transformTransaction = t => ({
    accountId: prop('account_id', t),
    transactionId: prop('transaction_id', t),
    name: prop('name', t),
    amount: prop('amount', t),
    roundUp: (Math.ceil(prop('amount', t)) - prop('amount', t)).toFixed(2),
    date: prop('date', t)
});

