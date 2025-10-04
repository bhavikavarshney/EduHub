const router = require('express').Router();

const { getAllEnrollments, getEnrollmentById, getEnrollmentsByCourseId, getEnrollmentsByUserId, addEnrollment, updateEnrollment, deleteEnrollment, updateStatus } = require('../controllers/enrollmentController')
const { validateToken } = require('../authUtils');

router.get('/getAllEnrollments', validateToken, getAllEnrollments)
router.get('/getEnrollmentById/:id', validateToken, getEnrollmentById)
router.get('/getEnrollmentsByCourseId/:courseId', validateToken, getEnrollmentsByCourseId)
router.get('/getEnrollmentsByUserId/:userId', validateToken, getEnrollmentsByUserId)
router.post('/addEnrollment', validateToken, addEnrollment)
router.put('/updateEnrollment/:id', validateToken, updateEnrollment)
router.patch('/updateStatus/:id', validateToken, updateStatus)
router.delete('/deleteEnrollment/:id', validateToken, deleteEnrollment)


module.exports = router;