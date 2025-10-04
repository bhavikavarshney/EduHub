const express = require('express');
const {
  getAllMaterial,
  getMaterialById,
  getMaterialsByCourseId,
  addMaterial,
  updateMaterial,
  addMaterialFile
  , softDeleteMaterial,
  getMaterialsByCourseIdEducator
} = require('../controllers/materialController');

const router = express.Router();
const upload = require('../middlewares/upload');
const { validateToken } = require('../authUtils');

router.get('/', validateToken, getAllMaterial);
router.get('/course', validateToken, getMaterialsByCourseIdEducator);
router.get('/course/:courseId', validateToken, getMaterialsByCourseId)
router.get('/:id', validateToken, getMaterialById);
router.post('/add', validateToken, addMaterial);
router.post('/addFile', upload.single('file'), validateToken, addMaterialFile);
router.put('/update/:id', upload.single('file'), validateToken, updateMaterial);
router.put('/softDeleteMaterial/:id', validateToken, softDeleteMaterial);


module.exports = router;