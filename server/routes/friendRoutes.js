const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth');

// All friend routes require authentication
router.use(authMiddleware);

router.get('/', friendController.getFriends);
router.post('/add', friendController.addFriend);
router.put('/accept/:friendId', friendController.acceptFriend);
router.delete('/:friendId', friendController.removeFriend);
router.get('/requests', friendController.getPendingRequests);

module.exports = router;
