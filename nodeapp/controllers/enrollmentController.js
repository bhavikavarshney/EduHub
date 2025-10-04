const Enrollment = require('../models/enrollmentModel');
const logger = require('../utils/Logger');

// Get all Enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const searchTerm = search.toLowerCase();

    logger.info(`Fetching all enrollments with search: "${searchTerm}"`);

    let enrollments = await Enrollment.find({ deleteFlag: false }).populate('courseId');

    if (searchTerm) {
      enrollments = enrollments.filter((enroll) => {
        const title = enroll.courseId?.title?.toLowerCase() || '';
        const description = enroll.courseId?.description?.toLowerCase() || '';
        return title.includes(searchTerm) || description.includes(searchTerm);
      });
    }

    logger.info(`Found ${enrollments.length} enrollments`);
    res.status(200).json(enrollments);
  } catch (error) {
    logger.error(`Error fetching enrollments: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Enrollments by Course ID
const getEnrollmentsByCourseId = async (req, res) => {
  try {
    logger.info(`Fetching enrollments for course ID: ${req.params.courseId}`);
    const enrollments = await Enrollment.find({ courseId: req.params.courseId });
    if (!enrollments || enrollments.length === 0) {
      logger.warn(`No enrollments found for course ID: ${req.params.courseId}`);
      return res.status(404).json({ message: 'No enrollments found for this course' });
    }
    res.status(200).json(enrollments);
  } catch (error) {
    logger.error(`Error fetching enrollments by course ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Enrollment by ID
const getEnrollmentById = async (req, res) => {
  try {
    logger.info(`Fetching enrollment by ID: ${req.params.id}`);
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      logger.warn(`Enrollment not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(200).json(enrollment);
  } catch (error) {
    logger.error(`Error fetching enrollment by ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Enrollments by User ID
const getEnrollmentsByUserId = async (req, res) => {
  try {
    logger.info(`Fetching enrollments for user ID: ${req.params.userId} with query: ${JSON.stringify(req.query)}`);
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.toLowerCase() || '';
    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort({ createdAt: -1 })
      .exec();

    const filtered = enrollments.filter(enrollment => {
      const course = enrollment.courseId;
      const term = search.toLowerCase();

      return (
        course.title?.toLowerCase().includes(term) ||
        course.category?.toLowerCase().includes(term) ||
        course.level?.toLowerCase().includes(term) ||
        enrollment.status?.toLowerCase().includes(term) ||
        new Date(course.courseStartDate).toLocaleDateString().toLowerCase().includes(term) ||
        new Date(course.courseEndDate).toLocaleDateString().toLowerCase().includes(term) ||
        new Date(enrollment.enrollmentDate).toLocaleDateString().toLowerCase().includes(term)
      );
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginated = filtered.slice(skip, skip + limit);

    logger.info(`Found ${totalItems} enrollments for user ID: ${userId}`);
    res.status(200).json({
      data: paginated,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    logger.error(`Error fetching enrollments by user ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Add New Enrollment
const addEnrollment = async (req, res) => {
  try {
    logger.info(`Adding new enrollment: ${JSON.stringify(req.body)}`);
    const newEnrollment = await Enrollment.create(req.body);
    logger.info(`Enrollment created successfully for user ID: ${req.body.userId}`);
    res.status(200).json({ message: 'Enrollment added successfully', enrollment: newEnrollment });
  } catch (error) {
    logger.error(`Error adding enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update an Existing Enrollment
const updateEnrollment = async (req, res) => {
  try {
    logger.info(`Updating enrollment ID: ${req.params.id}`);
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEnrollment) {
      logger.warn(`Enrollment not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    logger.info(`Enrollment updated successfully: ${req.params.id}`);
    res.status(200).json({ message: 'Enrollment updated successfully', enrollment: updatedEnrollment });
  } catch (error) {
    logger.error(`Error updating enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update Status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body || {};

    logger.info(`Updating status for enrollment ID: ${id} to status: ${status}`);

    if (!status || !(status = String(status).trim())) {
      logger.warn('Status is missing or empty');
      return res.status(400).json({ message: 'status is required' });
    }

    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const allowed = new Set(['Approved', 'Rejected', 'Pending']);
    if (!allowed.has(normalized)) {
      logger.warn(`Invalid status value: ${status}`);
      return res.status(400).json({
        message: 'Invalid status. Allowed values: Approved, Rejected, Pending',
      });
    }

    const updated = await Enrollment.findByIdAndUpdate(
      id,
      { $set: { status: normalized } },
      { new: true, runValidators: true }
    ).populate('courseId');

    if (!updated) {
      logger.warn(`Enrollment not found during status update: ${id}`);
      return res.status(404).json({ message: 'Enrollment not found during status update' });
    }

    logger.info(`Status updated successfully for enrollment ID: ${id}`);
    return res.status(200).json({
      message: 'Status updated successfully',
      enrollment: updated,
    });

  } catch (error) {
    if (error.name === 'CastError') {
      logger.warn(`Invalid enrollment ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid enrollment id' });
    }
    logger.error(`Error updating status: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// Hard Delete Enrollment
const deleteEnrollment = async (req, res) => {
  try {
    logger.info(`Deleting enrollment ID: ${req.params.id}`);
    const deletedEnrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!deletedEnrollment) {
      logger.warn(`Enrollment not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    logger.info(`Enrollment deleted successfully: ${req.params.id}`);
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete Enrollment
const softDeleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Soft deleting enrollment ID: ${id}`);
    const deletedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { deleteFlag: true },
      { new: true }
    );

    if (!deletedEnrollment) {
      logger.warn(`Enrollment not found for soft deletion: ${id}`);
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    logger.info(`Enrollment soft deleted successfully: ${id}`);
    res.status(200).json({ message: 'Enrollment soft deleted successfully', enrollment: deletedEnrollment });
  } catch (error) {
    logger.error(`Error soft deleting enrollment: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEnrollments,
  getEnrollmentsByCourseId,
  getEnrollmentById,
  getEnrollmentsByUserId,
  addEnrollment,
  updateEnrollment,
  updateStatus,
  deleteEnrollment,
  softDeleteEnrollment
};