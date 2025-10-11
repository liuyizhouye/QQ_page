import db from './db.js';

const migrations = [
  `CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    location TEXT,
    detail TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS moments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    description TEXT,
    tags_json TEXT NOT NULL DEFAULT '[]',
    media_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    author TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    ip_address TEXT,
    is_public INTEGER NOT NULL DEFAULT 1
  );`,
  `CREATE TABLE IF NOT EXISTS love_notes (
    id TEXT PRIMARY KEY,
    writer TEXT NOT NULL,
    recipient TEXT,
    date TEXT NOT NULL,
    title TEXT,
    excerpt TEXT,
    pdf_path TEXT,
    pdf_name TEXT,
    pdf_size INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    created_at TEXT NOT NULL
  );`,
  `CREATE INDEX IF NOT EXISTS idx_milestones_occurred_at ON milestones (occurred_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_moments_occurred_at ON moments (occurred_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_love_notes_writer_date ON love_notes (writer, date DESC);`
];

function runMigrations() {
  db.transaction(() => {
    migrations.forEach((sql) => {
      db.prepare(sql).run();
    });
  })();
  console.log('Database migrated successfully.');
}

runMigrations();
