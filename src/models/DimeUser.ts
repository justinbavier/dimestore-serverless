import * as Joi from 'joi';
import defineModel from '../util/defineModel';

const DimeUser = defineModel('dime-user', {
    hashKey: 'id',
    timestamps: true,
    schema: {
        id: Joi.string().required(),
        email: Joi.string().required(),
        profilePicture: Joi.string(),
        progress: Joi.number(),
        totalDonated: Joi.number(),
        queuedCharities: Joi.array().items(Joi.object()),
        favoriteCharities: Joi.array().items(Joi.object()),
        transactions: Joi.array().items(Joi.object()),
        plaidAccessToken: Joi.string(),
        plaidAccountId: Joi.string(),
        stripeBankToken: Joi.string(),
    }
});

export default DimeUser;