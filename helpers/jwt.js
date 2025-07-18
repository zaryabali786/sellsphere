const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/comments(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/theme(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/pages(.*)/, methods: ['GET', 'OPTIONS'] },


            `${api}/users/login`,
            `${api}/users/register`
            // { url: /(.*)/ },
        ]
    });
}

async function isRevoked(req, payload, done) {
    // console.log(payload,"asdasdasd")
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authJwt;
