const db = require('../config/db');

class Friend {
  static async getFriends(userId) {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email 
       FROM users u
       INNER JOIN friends f ON (f.friend_id = u.id OR f.user_id = u.id)
       WHERE (f.user_id = ? OR f.friend_id = ?) 
       AND u.id != ?
       AND f.status = 'accepted'`,
      [userId, userId, userId]
    );
    return rows;
  }

  static async addFriend(userId, friendId) {
    const [result] = await db.query(
      'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
      [userId, friendId, 'pending']
    );
    return result.insertId;
  }

  static async acceptFriend(userId, friendId) {
    const [result] = await db.query(
      'UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?',
      ['accepted', friendId, userId]
    );
    return result.affectedRows > 0;
  }

  static async removeFriend(userId, friendId) {
    const [result] = await db.query(
      'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [userId, friendId, friendId, userId]
    );
    return result.affectedRows > 0;
  }

  static async isFriend(userId, friendId) {
    const [rows] = await db.query(
      'SELECT * FROM friends WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)) AND status = ?',
      [userId, friendId, friendId, userId, 'accepted']
    );
    return rows.length > 0;
  }

  static async getPendingRequests(userId) {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email, f.created_at 
       FROM users u
       INNER JOIN friends f ON f.user_id = u.id
       WHERE f.friend_id = ? AND f.status = 'pending'`,
      [userId]
    );
    return rows;
  }
}

module.exports = Friend;
