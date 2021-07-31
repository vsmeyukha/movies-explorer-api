const router = require('express').Router();

const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  signOut,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/celebrate');

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUserInfo, updateUser);

router.post('/users/me/signout', signOut);

module.exports = router;
