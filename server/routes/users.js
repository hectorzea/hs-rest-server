const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const _ = require('lodash');
const app = express();

app.get('/users', (request, response) => {
    let iFrom = Number(request.query.from) || 0;
    let iLimit = Number(request.query.limit) || 5;
    //el limite especifica cuantos usuarios van a verse,
    //el from especifica desde donde  se van a ver los usuarios
    //en el find, se puede mandar un segundo parametro, que es la proyeccion, este va a excluir todos los campos excepto el que metamos como segundo
    //parametro
    User.find({}).limit(iLimit).skip(iFrom).exec((err, users) => {
        if (err) return response.status(400).json({ok: false, err});
        User.countDocuments({state: false}, (err, count) => {
            response.json({
                ok: true,
                users,
                count
            })
        })

    });

});


app.put('/users/:user_id', (request, response) => {
    let user_id = request.params.user_id;
    let body = _.pick(request.body, ["name", "email", "role", "img", "state"]);
    User.findByIdAndUpdate(user_id, body, {runValidators: true, new: true}, (err, oUserDB) => {
        if (err) return response.status(400).json({ok: false, err});
        response.json({
            ok: true,
            oUserDB
        })
    });
});

app.post('/users', (request, response) => {
    let body = request.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) return response.status(400).json({ok: false, err});
        response.json({
            ok: true,
            userDB
        });
    });
});

//ELIMINACION FISICA
// app.delete('/users/:user_id', (request, response) => {
//     let id = request.params.user_id;
//     User.findByIdAndRemove(id, (err, deletedUser) => {
//         if (err) return response.status(400).json({ok: false, err});
//         if (!deletedUser) return response.status(400).json({ok: false, err: "User not found"});
//         response.json({
//             ok: true,
//             deletedUser
//         })
//     });
// });

//ELIMINACION CAMBIANDO DE ESTADO
app.delete('/users/:user_id', (request, response) => {
    let user_id = request.params.user_id;
    let oStateChanger = {
        state: false
    }
    User.findByIdAndUpdate(user_id, oStateChanger, {new: true}, (err, oUserDB) => {
        if (err) return response.status(400).json({ok: false, err});
        response.json({
            ok: true,
            oUserDB
        })
    });
});

module.exports = app;
