const Friend = require('../models/Friend');
const User = require('../models/User');

const friendController = {
  // Get all friends
  getFriends: async (req, res) => {
    try {
      const userId = req.user.userId;
      const friends = await Friend.getFriends(userId);
      
      // Add online status (you can enhance this with socket.io)
      const friendsWithStatus = friends.map(friend => ({
        ...friend,
        online: false // TODO: Implement real online status
      }));

      res.json(friendsWithStatus);
    } catch (error) {
      console.error('Get friends error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add friend
  addFriend: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      // Find user by username
      const friend = await User.findByUsername(username);
      if (!friend) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (friend.id === userId) {
        return res.status(400).json({ message: 'Cannot add yourself as friend' });
      }

      // Check if already friends
      const alreadyFriends = await Friend.isFriend(userId, friend.id);
      if (alreadyFriends) {
        return res.status(400).json({ message: 'Already friends' });
      }

      // Add friend
      await Friend.addFriend(userId, friend.id);

      res.json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Add friend error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Accept friend request
  acceptFriend: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { friendId } = req.params;

      const success = await Friend.acceptFriend(userId, parseInt(friendId));
      
      if (success) {
        res.json({ message: 'Friend request accepted' });
      } else {
        res.status(404).json({ message: 'Friend request not found' });
      }
    } catch (error) {
      console.error('Accept friend error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Remove friend
  removeFriend: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { friendId } = req.params;

      const success = await Friend.removeFriend(userId, parseInt(friendId));
      
      if (success) {
        res.json({ message: 'Friend removed successfully' });
      } else {
        res.status(404).json({ message: 'Friend not found' });
      }
    } catch (error) {
      console.error('Remove friend error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get pending requests
  getPendingRequests: async (req, res) => {
    try {
      const userId = req.user.userId;
      const requests = await Friend.getPendingRequests(userId);
      
      res.json(requests);
    } catch (error) {
      console.error('Get pending requests error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = friendController;
