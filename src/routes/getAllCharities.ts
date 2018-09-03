import { DimeCharity } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path, map, defaultTo, prop } from 'ramda';

export default cors((_event, _context, callback) => {
    return DimeCharity.scan()
        .loadAll()
        .execAsync()
        .then(charities => map(prop('attrs'), defaultTo([], path(['Items'], charities))))
        .then(charities => callback(null, ok({ success: true, charities })))
    .catch(error => callback(null, badRequest({ message: `Bad Request -> ${error}` })))
})