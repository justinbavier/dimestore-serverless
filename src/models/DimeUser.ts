import * as Joi from 'joi';
import defineModel from '../util/defineModel';

export const schema = {
    id: Joi.string().required(),
    email: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    profilePicture: Joi.string(),
    progress: Joi.number(),
    totalDonated: Joi.number(),
    donationThreshold: Joi.number(),
    queuedCharities: Joi.array().items(Joi.object()),
    favoriteCharities: Joi.array().items(Joi.object()),
    transactions: Joi.array().items(Joi.object()),
    plaidAccessToken: Joi.string(),
    plaidAccountId: Joi.string(),
    plaidItemId: Joi.string(),
    stripeBankToken: Joi.string(),
}

const DimeUser = defineModel('dime-user', {
    hashKey: 'id',
    timestamps: true,
    schema
});

export default DimeUser;