const router = require('express').Router();

const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
  softDeleteCourse
} = require('../controllers/courseController');
const { validateToken } = require('../authUtils');

router.get('/getAllCourses', validateToken, getAllCourses);
router.get('/getCourseById/:id', validateToken, getCourseById);
router.post('/addCourse', validateToken, addCourse);
router.put('/updateCourse/:id', validateToken, updateCourse);
router.delete('/deleteCourse/:id', validateToken, deleteCourse);
router.put('/softDeleteCourse/:id', validateToken, softDeleteCourse);

module.exports = router;