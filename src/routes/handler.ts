import cors from '../util/cors';
import ok from '../util/ok';

const { name, version } = require('../../package.json');

export default cors((_event, _context, callback) => {
    callback(null, ok({
        name,
        version,
        hello: 'Hello!'
    }));
});