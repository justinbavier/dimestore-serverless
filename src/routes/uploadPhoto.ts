import cors from '../util/cors';
import ok from '../util/ok';
import badRequest from '../util/badRequest';
import { path } from 'ramda';
import { writeToS3 } from '../util/s3upload';
import { userUpdate } from '../util/userUpdate';

export default cors((event, _context, callback) => {
    const { id } = event.pathParameters;;
    const profilePicture = event.files.profilePicture
    return writeToS3({
        data_uri: profilePicture.data_uri,
        filename: profilePicture.filename,
        filetype: profilePicture.filetype
    })
        .then(uri => userUpdate({ id, profilePicture: uri })
            .then(user => ok({ success: true, user: path(['attrs'], user) })))
    .catch(error => badRequest(400, { message: `Bad Request -> ${error}` }))
})