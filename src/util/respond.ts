const respond = (statusCode, response?) =>
    ({ statusCode, body: JSON.stringify(response) });

export default respond;