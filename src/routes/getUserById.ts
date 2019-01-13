import { DimeUser } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path } from 'ramda';

export default cors((event, _context, _callback) => {
    const { id } = event.pathParameters;

    return DimeUser.get(id)
        .then(user => {
            if (!user) {
                throw Error('User does not exist!')
            } else {
                return path(['attrs'], user)
            }
        })
        .then(user => ok({ success: true, user }))
    .catch(error => badRequest(404, { message: `Bad Request -> ${error}` }))
});