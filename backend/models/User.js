const { Schema, model } = require('mongoose');
const AuthMethod = ['Classic', 'GitHub', 'Yandex', 'Google'];
const User = new Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String },
  password: { type: String },
  roles: [{ type: String, ref: 'Role' }],
  createdAt: { type: Date, required: true },
  authMethod: [{ type: String, enum: AuthMethod, required: true }],
  GHId: { type: String, unique: true, sparse: true },
  GH_username: { type: String, unique: true, sparse: true },
});
module.exports = model('User', User);
