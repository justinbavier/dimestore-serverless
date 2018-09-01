import respond from './respond';

const badRequest = (statusCode, response?) => respond(statusCode, response);

export default badRequest;