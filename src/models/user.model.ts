import { db } from '../config/database';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static create(
    email: string,
    passwordHash: string,
    role: 'rep' | 'manager' = 'rep'
  ): User {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, email, passwordHash, role);

    return this.findById(id)!;
  }

  static findByEmail(email: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }

  static findById(id: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }
}
