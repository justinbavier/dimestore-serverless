import defineModel from '../util/defineModel';
import { schema } from './DimeCharity';

const DimeCharityByCity = defineModel('dime-charitie', {
    hashKey: 'city',
    timestamps: true,
    schema,
    indexes: [{
        hashKey: 'city',
        rangeKey: 'id',
        name: 'city-index',
        type: 'global'
    }]
});

export default DimeCharityByCity;