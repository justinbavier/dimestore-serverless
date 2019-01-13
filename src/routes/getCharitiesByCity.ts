import { DimeCharityByCity } from '../models';
import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path, map, prop, defaultTo } from 'ramda';

export default cors((event, _context, callback) => {
    const { city } = event.pathParameters;

    return DimeCharityByCity.query(city.charAt(0).toUpperCase() + city.slice(1))
        .usingIndex('city-index')
        .execAsync()
        .then(charities => map(prop('attrs'), defaultTo([], path(['Items'], charities))))
        .then(charities => ok({ success: true, charities }))
    .catch(error => badRequest({ message: `Bad Request -> ${error}` }))
});