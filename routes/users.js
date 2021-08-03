const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  signOut,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/celebrate');

router.get('/', asyncHandler(getAllUsers));

router.get('/me', asyncHandler(getCurrentUser));

router.patch('/me', validateUserInfo, asyncHandler(updateUser));

router.post('/me/signout', signOut);

module.exports = router;
