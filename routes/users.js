const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  signOut,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/celebrate');

router.get('/users', asyncHandler(getAllUsers));

router.get('/users/me', asyncHandler(getCurrentUser));

router.patch('/users/me', validateUserInfo, asyncHandler(updateUser));

router.post('/users/me/signout', signOut);

module.exports = router;
