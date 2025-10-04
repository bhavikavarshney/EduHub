const mongoose = require('mongoose');
 
const MaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
    description: 'Represents the ID of the course to which the material belongs.'
  },
  title: {
    type: String,
    required: true,
    description: 'Represents the title of the material.'
  },
  description: {
    type: String,
    required: true,
    description: 'Represents the description of the material.'
  },
  url: {
    type: String,
    required: true,
    description: 'Represents the URL where the material can be accessed.'
  },
  uploadDate: {
    type: Date,
    required: true,
    description: 'Represents the date when the material was uploaded.'
  },
  contentType: {
    type: String,
    required: true,
    description: 'Represents type content (e.g., video, document).'
  },
  file: {
    type: String,
    required: true,
    description: 'Represents file associated with material.'
  },
  deleteFlag: {
    type: Boolean,
    default: false,
    description: 'Indicates if the material is marked as deleted (soft delete).'
  }
}, {
  timestamps: true 
});
 
module.exports = mongoose.model('Material', MaterialSchema);
 