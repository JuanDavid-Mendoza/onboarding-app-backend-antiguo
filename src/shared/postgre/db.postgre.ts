import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export default class DBConnection {
  private static instance: DBConnection;
  private connection: Pool

  private constructor() {
    this.connection = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: parseInt(process.env.PORT || '5432'),
    });
  };

  public static getInstance(): DBConnection {
    if (!this.instance) {
      this.instance = new DBConnection();
    }

    return this.instance;
  }

  public async executeQuery(sql: string, values?: any[]): Promise<any> {
    try {
      const result = await this.connection.query(sql, values);

      return result.rows;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  public async insertRecord(table: string, data: Record<string, any>): Promise<any> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      const sql = `INSERT INTO "${table}" (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.connection.query(sql, values);
      
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async updateRecord(table: string, id: number, data: Record<string, any>): Promise<any> {
    try {
      data.updated_at = new Date().toISOString().split('T')[0];
      const columns = Object.keys(data);
      const values = Object.values(data);
      
      const setClauses = columns.map((column, index) => `${column} = $${index + 1}`).join(', ');
      const sql = `UPDATE "${table}" SET ${setClauses} WHERE id = $${columns.length + 1} RETURNING *`;
      const result = await this.connection.query(sql, [...values, id]);
      
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async deleteRecord(table: string, id: number): Promise<any> {
    try {
      const sql = `DELETE FROM "${table}" WHERE id = $1 RETURNING *`;
      const result = await this.connection.query(sql, [id]);
      
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  
}