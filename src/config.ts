import * as vogels from 'vogels-promisified';

import { AWS_REGION, DYNAMO_ACCESS_KEY_ID, DYNAMO_SECRET_ACCESS_KEY } from './constants';

const config = {
    DYNAMO_ACCESS_KEY_ID,
    DYNAMO_SECRET_ACCESS_KEY,
    region: AWS_REGION
};

vogels.AWS.config.update(config);