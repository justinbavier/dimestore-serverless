import { DimeCharity, DimeDonation } from '../models';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } from '../constants';
import { path, prop } from 'ramda';

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

export default (charityId, userId, userPlaidAccessToken, userPlaidAccountId, userThreshold) => 
    DimeCharity.get(charityId)
        .then(charity => path(['attrs'], charity))
        .then(charity => client.createStripeToken(userPlaidAccessToken, userPlaidAccountId)
            .then(res => stripe.charges.create({
                amount: userThreshold,
                currency: 'usd',
                description: `Donation to ${prop('name', charity)}`,
                source: prop('stripe_bank_account_token', res)
            }))
                .then(() => createDonation({
                    id: uuidv1(),
                    donorId: userId,
                    charityId,
                    amount: userThreshold,
                    charityName: prop('name', charity)
                }))
                .then(donation => ({ donation: path(['attrs'], donation) }))
        )
   