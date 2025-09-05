import { db } from '../config/database';
import { Account } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AccountModel {

  static create(ownerId: string, name: string, industry?: string): Account {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO accounts (id, owner_id, name, industry)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, ownerId, name, industry);
    return this.findById(id)!;
  }


  static findAll(): Account[] {
    const stmt = db.prepare(`
      SELECT a.*, COUNT(act.id) as activity_count
      FROM accounts a
      LEFT JOIN activities act ON a.id = act.account_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);

    return stmt.all() as Account[];
  }


  static findById(id: string): Account | null {
    const stmt = db.prepare(`
      SELECT a.*, COUNT(act.id) as activity_count
      FROM accounts a
      LEFT JOIN activities act ON a.id = act.account_id
      WHERE a.id = ?
      GROUP BY a.id
    `);

    return stmt.get(id) as Account | null;
  }


  static update(id: string, updates: Partial<Account>): Account | null {
    const fields = Object.keys(updates).filter(
      (key) => key !== 'id' && key !== 'activity_count'
    );
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field as keyof Account]);

    const stmt = db.prepare(`UPDATE accounts SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return this.findById(id);
  }


  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM accounts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }


  static getAccountsWithRecentActivity(): any[] {
    const stmt = db.prepare(`
      WITH recent_activities AS (
        SELECT 
          account_id,
          type,
          notes,
          created_at,
          ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY created_at DESC) as rn
        FROM activities
      )
      SELECT 
        a.*,
        ra.type as last_activity_type,
        ra.notes as last_activity_notes,
        ra.created_at as last_activity_date
      FROM accounts a
      LEFT JOIN recent_activities ra ON a.id = ra.account_id AND ra.rn = 1
      ORDER BY a.created_at DESC
    `);

    return stmt.all();
  }
}
