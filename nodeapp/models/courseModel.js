const mongoose = require('mongoose');
 
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    description: 'Represents the title of the course.'
  },
  description: {
    type: String,
    required: true,
    description: 'Represents the description of the course.'
  },
  courseStartDate: {
    type: Date,
    required: true,
    description: 'Represents the start date of the course.'
  },
  courseEndDate: {
    type: Date,
    required: true,
    description: 'Represents the end date of the course.'
  },
  category: {
    type: String,
    required: true,
    description: 'Represents the category of the course.' 
  },
  level: {
    type: String,
    required: true,
    description: 'Represents difficulty level of course.'
  },
  deleteFlag: {
    type: Boolean,
    default: false,
    description: 'Indicates if the course is marked as deleted (soft delete).'
  }
}, {
  timestamps: true 
});
 
module.exports = mongoose.model('Course', CourseSchema);
 