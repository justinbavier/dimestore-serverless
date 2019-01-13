import { DimeCharity } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path } from 'ramda';

const uuidv1 = require('uuid/v1')

export default cors((event, _context, _callback) => {
    const body = JSON.parse(event.body);

    return DimeCharity.create({
        id: uuidv1(),
        ...body
    })
        .then(charity => ok({ success: true, charity: path(['attrs'], charity) }))
    .catch(error => badRequest({ message: `Bad Request -> ${error}` }))
});