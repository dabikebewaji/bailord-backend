import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from "dotenv";

dotenv.config();

// Use SQLite for development (file-based, no server required)
export const db = await open({
  filename: process.env.DB_FILE || './bailord_dev.db',
  driver: sqlite3.Database,
});

// Create tables if they don't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'retailer')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    company TEXT,
    phone TEXT,
    address TEXT,
    description TEXT,
    refresh_token TEXT,
    last_token_refresh DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS token_blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS retailers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    performance INTEGER DEFAULT 0,
    business_type TEXT,
    total_orders INTEGER DEFAULT 0,
    total_sales REAL DEFAULT 0.00,
    average_rating REAL DEFAULT 0.00,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to INTEGER,
    retailer_id INTEGER,
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (retailer_id) REFERENCES retailers(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
  );
`);

console.log("✅ SQLite Database initialized successfully");

// For compatibility with existing code that expects a pool
export const pool = {
  execute: async (query, params = []) => {
    return await db.run(query, params);
  },
  query: async (query, params = []) => {
    if (query.toLowerCase().trim().startsWith('select')) {
      return [await db.all(query, params)];
    } else {
      return await db.run(query, params);
    }
  },
  getConnection: async () => ({
    execute: async (query, params = []) => await db.run(query, params),
    query: async (query, params = []) => {
      if (query.toLowerCase().trim().startsWith('select')) {
        return [await db.all(query, params)];
      } else {
        return await db.run(query, params);
      }
    },
    release: () => {} // No-op for SQLite
  })
};
