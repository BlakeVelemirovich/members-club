const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 20 },
    last_name: { type: String, required: true, maxLength: 20},
    username: { type: String, required: true, maxLength: 20},
    password: { type: String, required: true, maxLength: 100},
    membership: { type: Boolean, required: true},
    admin: { type: Boolean, required: true}
});

module.exports = mongoose.model("User", UserSchema);