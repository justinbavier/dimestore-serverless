import * as Joi from 'joi';
import defineModel from '../util/defineModel';

export const schema = {
    email: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    beta: Joi.boolean(),
    location: Joi.string()
}

const DimeEmail = defineModel('dime-email', {
    hashKey: 'email',
    timestamps: true,
    schema
});

export default DimeEmail;