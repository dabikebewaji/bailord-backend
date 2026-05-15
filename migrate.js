import fs from 'fs';
import path from 'path';
import { pool } from './src/config/db.js';

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/config/schema-postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database migrations completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - projects');
    console.log('   - retailers');
    console.log('   - project_retailers');
    console.log('   - messages');
    console.log('   - token_blacklist');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigrations();
