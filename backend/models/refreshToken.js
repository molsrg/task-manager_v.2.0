const { Schema, model } = require('mongoose');
const refreshToken = new Schema({
  userId: { type: String, required: true }, //unique убрал но надо возвращать
  token: { type: String, unique: true, required: true },
  createdAt: { type: Date, unique: true, required: true },
  expiresAt: { type: Date, unique: true, required: true },
});
module.exports = model('refreshToken', refreshToken);
