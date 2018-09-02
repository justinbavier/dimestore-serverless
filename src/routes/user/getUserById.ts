import { DimeUser } from '../../models';
import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { path } from 'ramda';

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;

    return DimeUser.get(id)
        .then(user => path(['attrs'], user))
        .then(user => callback(null, ok({ success: true, user })))
    .catch(error => callback(null, badRequest({ message: `Bad Request -> ${error}` })))
});