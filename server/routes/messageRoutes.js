const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

// All message routes require authentication
router.use(authMiddleware);

router.get('/:friendId', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.put('/:messageId/read', messageController.markAsRead);
router.get('/unread/count', messageController.getUnreadCount);
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
