module.exports = function() {
    return function allowCors(req, res, next) {
        let oneof = false;
        if (req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            oneof = true;
        }
        if (req.headers['access-control-request-method']) {
            res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
            oneof = true;
        }
        if (req.headers['access-control-request-headers']) {
            res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
            oneof = true;
        }

        // intercept OPTIONS method
        if (oneof && req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    };
};