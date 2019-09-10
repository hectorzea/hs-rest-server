const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../model/user");
const _ = require("lodash");
const app = express();

async function verifyGoogleToken(google_token) {
  const ticket = await client.verifyIdToken({
    idToken: google_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const google_data = ticket.getPayload();
  return google_data;
}

app.post("/login", (request, response) => {
  let body = request.body;
  let oFindCriteria = {
    email: body.email
  };
  User.findOne(oFindCriteria, (err, user) => {
    if (err) return response.status(400).json({ ok: false, err });
    if (!user || !bcrypt.compareSync(body.password, user.password))
      return response.status(400).json({
        ok: false,
        err: "User or password incorrect."
      });

    let authToken = jwt.sign({ user: user }, process.env.AUTH_TOKEN_SEED, {
      expiresIn: process.env.EXPIRY_TOKEN
    });

    response.json({
      ok: true,
      user,
      token: authToken
    });
  });
});

function _userIsGoogleAuthenticated(oUser) {
  return oUser.google;
}

app.post("/googleSign", async (request, response) => {
  let id_token = request.body.google_token;
  let googleData = await verifyGoogleToken(id_token).catch(error => {
    return response.status(403).json({
      error: error,
      ok: false
    });
  });
  console.log("jajaj");
  User.findOne({ email: googleData.email }, (error, oUser) => {
    if (error) {
      return response.status(500).json({
        error: error
      });
    }
    if (oUser) {
      if (oUser.google) {
        let authToken = jwt.sign({ user: oUser }, process.env.AUTH_TOKEN_SEED, {
          expiresIn: process.env.EXPIRY_TOKEN
        });
        response.json({
          ok: true,
          oUser,
          token: authToken
        });
      } else {
        return response.status(400).json({
          ok: false,
          error: "Debe autenticarse normalmente."
        });
      }
    } else {
      let oUser = new User({
        name: googleData.name,
        email: googleData.email,
        img: googleData.picture,
        google: true,
        password: "xD!"
      });

      oUser.save((err, oUser) => {
        if (err) {
          return response.status(500).json({
            err: err,
            message: "Se ha producido un error al crear el usuario"
          });
        }

        let authToken = jwt.sign({ user: oUser }, process.env.AUTH_TOKEN_SEED, {
          expiresIn: process.env.EXPIRY_TOKEN
        });

        response.json({
          ok: true,
          oUser,
          token: authToken
        });
      });
    }
  });
});

module.exports = app;
