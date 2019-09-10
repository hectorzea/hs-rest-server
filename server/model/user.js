const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')


let Schema = moongose.Schema;
let oValidRoles = {
    values: ["GOD_MODE", "USER_BASIC_ROLE"],
    message: "{VALUE} is not a valid role for creation"
}
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        unique: true,
        type: String,
        required: [true, "Mail is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "GOD_MODE",
        required: true,
        enum: oValidRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
UserSchema.plugin(uniqueValidator, {message: "The mail is required to do the registration"});
UserSchema.methods.toJSON = function () {
    let oUser = this;
    let oUserData = oUser.toObject();
    delete oUserData.password;
    return oUserData;
}

module.exports = moongose.model('User', UserSchema);