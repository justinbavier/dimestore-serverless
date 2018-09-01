import respond from './respond';

const ok = (response?) =>
    respond(200, response);

export default ok;