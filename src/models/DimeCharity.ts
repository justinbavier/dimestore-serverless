import * as Joi from 'joi';
import defineModel from '../util/defineModel';

export const schema = {
    id: Joi.string().required(),
    name: Joi.string(),
    picture: Joi.string(),
    category: Joi.string(),
    description: Joi.string(),
    contact: Joi.object(),
    city: Joi.string()
}

const DimeCharity = defineModel('dime-charitie', {
    hashKey: 'id',
    timestamps: true,
    schema
});

export default DimeCharity;