const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const _ = require('lodash');
const app = express();


app.post('/login', (request, response) => {
    let body = request.body;
    let oFindCriteria = {
        email: body.email
    };
    User.findOne(oFindCriteria, (err, user) => {
        if (err) return response.status(400).json({ok: false, err});
        if (!user || !bcrypt.compareSync(body.password, user.password)) return response.status(400).json({
            ok: false,
            err: "User or password incorrect."
        });

        let authToken = jwt.sign({user:user}, process.env.AUTH_TOKEN_SEED, { expiresIn: process.env.EXPIRY_TOKEN });

        response.json({
            ok: true,
            user,
            token: authToken
        });
    });
});


module.exports = app;
