const mongoose = require('mongoose');
 
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    description: 'Represents the username of the user.'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    description: 'Represents the email address of the user.'
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    description: 'Represents the mobile number of the user.'
  },
  password: {
    type: String,
    required: true,
    description: 'Represents the password of the user.'
  },
  role: {
    type: String,
    required: true,
    description: 'Represents role of user such as educator, student etc.'
  },
  deleteFlag: {
    type: Boolean,
    default: false,
    description: 'Indicates if the user is marked as deleted (soft delete).'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});
 
module.exports = mongoose.model('User', UserSchema);
 