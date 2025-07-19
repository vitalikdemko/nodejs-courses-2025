import { Pool } from 'pg';
import SQL from 'sql-template-strings';

export class Orm<T extends { id: any }> {
  constructor(
    private table: string,
    private pool: Pool,
  ) {}

  async find(filters?: Partial<T>): Promise<T[]> {
    let query = SQL`SELECT * FROM "`.append(this.table).append(SQL`"`);

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.entries(filters).map(([key, value], i) =>
        SQL`"${key}" = ${value}`.append(
          i < Object.entries(filters).length - 1 ? SQL` AND ` : SQL``,
        ),
      );
      query.append(SQL` WHERE `).append(...conditions);
    }

    const res = await this.pool.query(query);
    return res.rows;
  }

  async findOne(id: T['id']): Promise<T | null> {
    const query = SQL`SELECT * FROM "`
      .append(this.table)
      .append(SQL`" WHERE id = ${id}`);
    const res = await this.pool.query(query);
    return res.rows[0] || null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);

    let query = SQL`INSERT INTO "`.append(this.table).append(SQL`" (`);

    keys.forEach((key, idx) => {
      query.append(`"${key}"`);
      if (idx < keys.length - 1) query.append(', ');
    });

    query.append(SQL`) VALUES (`);

    values.forEach((value, idx) => {
      query.append(SQL`${value}`);
      if (idx < values.length - 1) query.append(SQL`, `);
    });

    query.append(SQL`) RETURNING *`);

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async update(id: T['id'], patch: Partial<T>): Promise<T> {
    const { id: _ignored, ...fields } = patch;
    if (Object.keys(fields).length === 0) {
      throw new Error('No fields to update');
    }

    let query = SQL`UPDATE "`.append(this.table).append(SQL`" SET `);

    const entries = Object.entries(fields);
    entries.forEach(([key, value], idx) => {
      query.append(`"${key}" = `).append(SQL`${value}`);
      if (idx < entries.length - 1) {
        query.append(', ');
      }
    });

    query.append(SQL` WHERE id = ${id} RETURNING *`);
    const result = await this.pool.query(query);
    return result.rows[0];
  }
  
  async delete(id: T['id']): Promise<void> {
    const query = SQL`DELETE FROM "`
      .append(this.table)
      .append(SQL`" WHERE id = ${id}`);
    await this.pool.query(query);
  }
}
