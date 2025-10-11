import Database from 'better-sqlite3';
import config from './config.js';

const db = new Database(config.DATABASE_FILE);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
