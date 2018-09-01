import '../config';

import * as vogels from 'vogels-promisified';

const defineModel = (name, definition) => {
    const Model = vogels.define(name, definition);

    return Object.assign({}, Model, {

        get: body =>
            new Promise((resolve, reject) => {
                Model.get(body, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            }),

        update: body =>
            new Promise((resolve, reject) => {
                Model.update(body, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            }),

        destroy: body =>
            new Promise((resolve, reject) => {
                Model.destroy(body, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            }),

        create: body =>
            new Promise((resolve, reject) => {
                Model.create(body, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            })
    });
};

export default defineModel;