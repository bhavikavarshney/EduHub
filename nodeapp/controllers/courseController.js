const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const logger = require('../utils/Logger');

// 1. Get all Courses
const getAllCourses = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, 'i');

    const query = {
      deleteFlag: false,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { level: searchRegex }
      ]
    };

    logger.info(`Fetching courses with search: "${search}", page: ${page}, limit: ${limit}`);

    const totalCourses = await Course.countDocuments(query);
    const courses = await Course.find(query).skip(skip).limit(parseInt(limit));

    logger.info(`Found ${courses.length} courses out of ${totalCourses} total`);

    res.status(200).json({
      courses,
      totalCourses,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCourses / limit)
    });
  } catch (error) {
    logger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching course by ID: ${id}`);
    const course = await Course.findById(id);
    if (!course) {
      logger.warn(`Course not found: ${id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    logger.error(`Error fetching course by ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// 3. Add a New Course
const addCourse = async (req, res) => {
  try {
    logger.info(`Adding new course: ${JSON.stringify(req.body)}`);
    const newCourse = await Course.create(req.body);
    logger.info(`Course added successfully: ${newCourse._id}`);
    res.status(200).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    logger.error(`Error adding course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// 4. Update an Existing Course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Updating course ID: ${id} with data: ${JSON.stringify(req.body)}`);
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedCourse) {
      logger.info(`Course updated successfully: ${id}`);
      res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } else {
      logger.warn(`Course not found for update: ${id}`);
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    logger.error(`Error updating course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// 5. Delete a Course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting course ID: ${id}`);
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      logger.warn(`Course not found for deletion: ${id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    logger.info(`Course deleted successfully: ${id}`);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// 6. Soft Delete a Course
const softDeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Attempting soft delete for course ID: ${id}`);

    const enrolledStudents = await Enrollment.find({ courseId: id });
    if (enrolledStudents.length > 0) {
      logger.warn(`Cannot delete course ${id}: Students are currently enrolled`);
      return res.status(400).json({
        message: "Cannot delete course. Student(s) are currently enrolled."
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { deleteFlag: true },
      { new: true }
    );

    if (!updatedCourse) {
      logger.warn(`Course not found for soft deletion: ${id}`);
      return res.status(404).json({ message: 'Course not found' });
    }

    logger.info(`Course marked as deleted: ${id}`);
    res.status(200).json({ message: 'Course marked as deleted', course: updatedCourse });
  } catch (error) {
    logger.error(`Error soft deleting course: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
  softDeleteCourse
};