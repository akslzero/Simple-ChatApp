const db = require('../config/db');

class Message {
  static async create(senderId, recipientId, content) {
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)',
      [senderId, recipientId, content]
    );
    return result.insertId;
  }

  static async getConversation(userId, friendId, limit = 50) {
    const [rows] = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND recipient_id = ?) 
       OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, friendId, friendId, userId, limit]
    );
    return rows.reverse();
  }

  static async markAsRead(messageId, userId) {
    const [result] = await db.query(
      'UPDATE messages SET is_read = TRUE WHERE id = ? AND recipient_id = ?',
      [messageId, userId]
    );
    return result.affectedRows > 0;
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async deleteMessage(messageId, userId) {
    const [result] = await db.query(
      'DELETE FROM messages WHERE id = ? AND sender_id = ?',
      [messageId, userId]
    );
    return result.affectedRows > 0;
  }

  static async getLatestMessages(userId) {
    const [rows] = await db.query(
      `SELECT m.*, u.username as sender_name 
       FROM messages m
       INNER JOIN users u ON m.sender_id = u.id
       WHERE m.recipient_id = ?
       ORDER BY m.created_at DESC
       LIMIT 10`,
      [userId]
    );
    return rows;
  }
}

module.exports = Message;
