const User = require('../models/userModel');
const { generateToken } = require('../authUtils');
const bcrypt = require('bcrypt');
const logger = require('../utils/Logger');

const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info(`Attempting login for email: ${email}`);

    const user = await User.findOne({ email });

    let isValid = false;

    if (user) {
      isValid = true;
    }

    if (isValid) {
      const token = generateToken(user._id);
      const response = {
        userName: user.userName,
        role: user.role,
        token: token,
        id: user._id
      };
      logger.info(`Login successful for user: ${user.userName} (${email})`);
      return res.status(200).json(response);
    } else {
      logger.warn(`Login failed: User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error during login for email ${req.body.email}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

// Authenticate User by Email + Password
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Attempting login for email: ${email}`);

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = generateToken(user._id);

    // 4. Build response
    const response = {
      userName: user.userName,
      role: user.role,
      token: token,
      id: user._id
    };

    logger.info(`Login successful for user: ${user.userName} (${email})`);
    return res.status(200).json(response);

  } catch (error) {
    logger.error(`Error during login for email ${req.body.email}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Add New User
const addUser = async (req, res) => {
  try {
    const { userName, email, mobile, password, role } = req.body;
    logger.info(`Creating new user: ${userName}, email: ${email}`);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    await User.create({
      userName,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    logger.info(`User created successfully: ${userName} (${email})`);
    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    logger.error(`Error adding user (${req.body.email}): ${error.message}`);
    res.status(500).json({ message: 'Error adding user' });
  }
};

module.exports = {
  getUserByEmailAndPassword,
  userLogin,
  addUser
};


// const User = require('../models/userModel');
// const { generateToken } = require('../authUtils');
// const bcrypt = require('bcrypt');
// const logger = require('../utils/Logger');

// // Authenticate User by Email
// const getUserByEmailAndPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     logger.info(`Attempting login for email: ${email}`);

//     const user = await User.findOne({ email });

//     let isValid = false;

//     if (user) {
//       isValid = true;
//     }

//     if (isValid) {
//       const token = generateToken(user._id);
//       const response = {
//         userName: user.userName,
//         role: user.role,
//         token: token,
//         id: user._id
//       };
//       logger.info(`Login successful for user: ${user.userName} (${email})`);
//       return res.status(200).json(response);
//     } else {
//       logger.warn(`Login failed: User not found for email: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     logger.error(`Error during login for email ${req.body.email}: ${error.message}`);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Add New User
// const addUser = async (req, res) => {
//   try {
//     const { userName, email, mobile, password, role } = req.body;
//     logger.info(`Creating new user: ${userName}, email: ${email}`);

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user with hashed password
//     await User.create({
//       userName,
//       email,
//       mobile,
//       password: hashedPassword,
//       role
//     });

//     logger.info(`User created successfully: ${userName} (${email})`);
//     res.status(200).json({ message: 'User added successfully' });
//   } catch (error) {
//     logger.error(`Error adding user (${req.body.email}): ${error.message}`);
//     res.status(500).json({ message: 'Error adding user' });
//   }
// };

// module.exports = {
//   getUserByEmailAndPassword,
//   addUser
// };