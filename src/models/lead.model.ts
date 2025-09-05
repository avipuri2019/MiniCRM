import { db } from '../config/database';
import { Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LeadModel {
  
  static create(
    ownerId: string,
    name: string,
    company?: string,
    status: string = 'new'
  ): Lead {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO leads (id, owner_id, name, company, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, ownerId, name, company, status);
    return this.findById(id)!;
  }

  
  static findAll(filters?: {
    status?: string;
    createdFrom?: string;
    createdTo?: string;
  }): Lead[] {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.createdFrom) {
      query += ' AND created_at >= ?';
      params.push(filters.createdFrom);
    }

    if (filters?.createdTo) {
      query += ' AND created_at <= ?';
      params.push(filters.createdTo);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params) as Lead[];
  }

  
  static findById(id: string): Lead | null {
    const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    return stmt.get(id) as Lead | null;
  }

 
  static update(id: string, updates: Partial<Lead>): Lead | null {
    const fields = Object.keys(updates).filter((key) => key !== 'id');
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field as keyof Lead]);

    const stmt = db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return this.findById(id);
  }

 
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
