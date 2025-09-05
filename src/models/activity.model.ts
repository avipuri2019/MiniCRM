import { db } from '../config/database';
import { Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ActivityModel {

  static create(
    accountId: string,
    userId: string,
    type: string,
    notes?: string,
    nextFollowUp?: string
  ): Activity {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO activities (id, account_id, user_id, type, notes, next_follow_up)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, accountId, userId, type, notes, nextFollowUp);
    return this.findById(id)!;
  }


  static findByAccountId(accountId: string): Activity[] {
    const stmt = db.prepare(`
      SELECT * FROM activities 
      WHERE account_id = ? 
      ORDER BY created_at DESC
    `);

    return stmt.all(accountId) as Activity[];
  }


  static findById(id: string): Activity | null {
    const stmt = db.prepare('SELECT * FROM activities WHERE id = ?');
    return stmt.get(id) as Activity | null;
  }


  static update(id: string, updates: Partial<Activity>): Activity | null {
    const fields = Object.keys(updates).filter((key) => key !== 'id');
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field as keyof Activity]);

    const stmt = db.prepare(`UPDATE activities SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return this.findById(id);
  }


  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM activities WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
