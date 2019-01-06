import { DimeUser } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path, prop } from 'ramda';

export default cors((event, _context, callback) => {
    const body = JSON.parse(event.body);

    const user = {
        id: prop('cognitoId', body),
        email: prop('email', body),
        firstName: prop('firstName', body),
        lastName: prop('lastName', body),
        progress: 0,
        totalDonated: 0,
        donationThreshold: 1000,
        queuedCharities: [],
        favoriteCharities: [],
    };

    return DimeUser.create(user)
        .then(user => callback(null, ok({
            success: true,
            user: path(['attrs'], user)
        })))
    .catch(error => 
        callback(null, badRequest(400, { message: `Bad Request -> ${error}` })))
});