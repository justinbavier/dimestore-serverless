import { DimeEmail } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path } from 'ramda';

export default cors((event, _context, callback) => {
    const body = JSON.parse(event.body);

    const email = {
        email: body.data.email,
        firstName: body.data.firstName,
        lastName: body.data.lastName,
        beta: false,
        location: "Entrepreneurship Village"
    };

    return DimeEmail.create(email)
        .then(email => ok({
            success: true,
            email: path(['attrs'], email)
        }))
    .catch(error =>
        badRequest(400, { message: `Bad Request -> ${error}` }))
});
