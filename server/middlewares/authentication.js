const jwt = require('jsonwebtoken');
const _ = require('lodash');

const aRESTRoles = [{
    role_type: "GOD_MODE",
    access: ["GET", "POST", "PUT", "DELETE"],
    messageFromUnauthorizedRequest: ""
}, {
    role_type: "USER_BASIC_ROLE",
    access: ["GET"],
    messageFromUnauthorizedRequest: "Solo puedes consultar los datos de usuario."
}];


let verifyToken = (request, response, next) => {
    let token = request.get("tokenHeader");
    console.log(token);
    jwt.verify(token, process.env.AUTH_TOKEN_SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                error: error
            })
        }
        request.user = decoded.user;
        next();
    });

};

let checkAdminRoles = (request, response, next) => {
    let role = request.user.role;
    let oRole = _.find(aRESTRoles, {role_type: role})
    if (!oRole) {
        return response.status(403).json({
            ok: false,
            error: "Role not found"
        })
    }
    if (_.indexOf(oRole.access, request.method) === -1) {
        return response.status(403).json({
            ok: false,
            error: oRole.messageFromUnauthorizedRequest
        })
    }
    next();
};

module.exports = {
    verifyToken,
    checkAdminRoles
}
