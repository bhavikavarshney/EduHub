const mongoose = require('mongoose');
 
const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    description: 'Represents the ID of the user who enrolled.'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    description: 'Represents the ID of the course in which the user is enrolled.'
  },
  enrollmentDate: {
    type: Date,
    required: true,
    description: 'Represents the date when the enrollment was made.'
  },
  status: {
    type: String,
    required: true,
    description: 'Represents the status of the enrollment, such as active, completed, etc.'
  },
  deleteFlag: {
    type: Boolean,
    default: false,
    description: 'Indicates if the enrollment is marked as deleted (soft delete).'
  }
}, {
  timestamps: true
});
 
module.exports = mongoose.model('Enrollment', EnrollmentSchema);
 