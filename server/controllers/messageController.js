const Message = require('../models/Message');
const Friend = require('../models/Friend');

const messageController = {
  // Get conversation with a friend
  getMessages: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { friendId } = req.params;

      // Verify they are friends
      const areFriends = await Friend.isFriend(userId, parseInt(friendId));
      if (!areFriends) {
        return res.status(403).json({ message: 'You can only message friends' });
      }

      const messages = await Message.getConversation(userId, parseInt(friendId));
      
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Send message
  sendMessage: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { recipientId, content } = req.body;

      if (!content || !recipientId) {
        return res.status(400).json({ message: 'Content and recipient are required' });
      }

      // Verify they are friends
      const areFriends = await Friend.isFriend(userId, parseInt(recipientId));
      if (!areFriends) {
        return res.status(403).json({ message: 'You can only message friends' });
      }

      const messageId = await Message.create(userId, parseInt(recipientId), content);
      
      res.status(201).json({
        message: 'Message sent',
        messageId
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Mark message as read
  markAsRead: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;

      const success = await Message.markAsRead(parseInt(messageId), userId);
      
      if (success) {
        res.json({ message: 'Message marked as read' });
      } else {
        res.status(404).json({ message: 'Message not found' });
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get unread count
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.userId;
      const count = await Message.getUnreadCount(userId);
      
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete message
  deleteMessage: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;

      const success = await Message.deleteMessage(parseInt(messageId), userId);
      
      if (success) {
        res.json({ message: 'Message deleted' });
      } else {
        res.status(404).json({ message: 'Message not found or unauthorized' });
      }
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = messageController;
