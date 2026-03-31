import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  async getStats() {
    const tables = [
      'people',
      'families',
      'profiles',
      'posts',
      'comments',
      'events',
      'notifications',
    ];
    const stats: Record<string, number> = {};
    for (const table of tables) {
      const result = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = parseInt(result[0].count, 10);
    }
    return stats;
  }

  async getBackup() {
    const people = await this.dataSource.query('SELECT * FROM people');
    const families = await this.dataSource.query('SELECT * FROM families');
    const profiles = await this.dataSource.query('SELECT * FROM profiles');

    return {
      exported_at: new Date().toISOString(),
      people,
      families,
      profiles,
    };
  }

  async getAuditLogs() {
    // Left join with profiles to get actor email and display_name
    const logs = await this.dataSource.query(`
      SELECT a.*, json_build_object('email', p.email, 'display_name', p.display_name) as actor
      FROM audit_logs a
      LEFT JOIN profiles p ON a.actor_id = p.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);
    return logs;
  }
}
