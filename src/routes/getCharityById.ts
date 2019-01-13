import { DimeCharity } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path } from 'ramda';

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;
    return DimeCharity.get(id)
        .then(charity => ok({ success: true, charity: path(['attrs'], charity) }))
    .catch(error => badRequest({ message: `Bad Request -> ${error}` }))
});