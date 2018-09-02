import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { path } from 'ramda';
import { userUpdate } from '../../util/userUpdate';

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    
    return userUpdate({
        id,
        ...body
    })
        .then(user => callback(null, ok({
            success: true,
            user: path(['attrs'], user) //user.attrs
        })))
    .catch(error => callback(null, badRequest(400, { message: `Bad Request -> ${error}` })))
});