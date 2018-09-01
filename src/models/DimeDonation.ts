import * as Joi from 'joi';
import defineModel from '../util/defineModel';

const DimeDonation = defineModel('dime-donation', {
    hashKey: 'id',
    timestamps: true,
    schema: {
       id: Joi.string().required(),
       donorId: Joi.string(),
       charityId: Joi.string(),
       charityName: Joi.string(),
       amount: Joi.number()
    }
});

export default DimeDonation;