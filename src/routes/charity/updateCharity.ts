import cors from '../../util/cors';
import ok from '../../util/ok';
import badRequest from '../../util/badRequest';
import { path } from 'ramda';
import { charityUpdate } from '../../util/charityUpdate';

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    return charityUpdate({
        id,
        ...body
    })
    .then(charity => callback(null, ok({
        success: true,
        charity: path(['attrs'], charity)
    })))
    .catch(error => callback(null, badRequest(400, { message: `Bad Request -> ${error}` })))
});