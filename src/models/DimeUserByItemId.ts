import defineModel from '../util/defineModel';
import { schema } from './DimeUser';

const DimeUserByItemId = defineModel('dime-user', {
    hashKey: 'plaidItemId',
    timestamps: true,
    schema,
    indexes: [{
        hashKey: 'plaidItemId',
        rangeKey: 'id',
        name: 'plaidItemId-index',
        type: 'global'
    }]
});

export default DimeUserByItemId;