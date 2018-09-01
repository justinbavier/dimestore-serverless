import { DimeUser } from '../../models';
import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { path } from 'ramda';

export default cors((event, _context, callback) => {
    const body = JSON.parse(event.body);

    const user = {
        id: body.cognitoId,
        email: body.email
    };

    return DimeUser.create(user)
        .then(user => callback(null, ok({
            success: true,
            user: path(['attrs'], user)
        })))
    .catch(error => 
        callback(null, badRequest(400, { message: `Bad Request -> ${error}` })))
})