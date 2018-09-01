import * as knox from 'knox';
import * as Q from 'q';

const { env } = process;

export const writeToS3 = options => {
    const deferred = Q.defer();

    // if (!options.data_uri) {
    //     deferred.reject({ error: 'No data!' });
    //     return deferred.promise
    // }

    const buff = new Buffer(options.data_uri.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    const client = knox.createClient({
        key: env.DIME_AWS_ACCESS_KEY,
        secret: env.DIME_AWS_SECRET_KEY,
        bucket: env.DIME_S3_BUCKET || 'dime-charity'
    });

    const req = client.put(`/pictures/${options.filename}`, {
        'Content-Length': buff.length,
        'Content-Type': options.filetype,
        'x-amx-acl': 'public-read'
    });

    req.on('response', res => {
        if (res.statusCode === 200) {
            deferred.resolve(req.url);
        } else {
            deferred.reject({ error: true })
        }
    });
    
    req.end(buff);
    return deferred.promise;
};