const express = require('express');
const router = express.Router();
const { getUserByEmailAndPassword, addUser, userLogin } = require('../controllers/userController');


router.post('/addUser', addUser);
router.post('/getUser', getUserByEmailAndPassword);
router.post('/getUserByEmailAndPassword', userLogin);

module.exports = router;   