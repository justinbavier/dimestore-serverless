const corsWrapper = handler => (event, context, callback) => {
    const wrappedCallback = (err, res) => {
        if (res) {
            res.headers = {
                ...(res.headers || {}),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            };
        }

        callback(err, res);
    };

    return (
        handler(event, context, wrappedCallback)
    );
}

export default corsWrapper;