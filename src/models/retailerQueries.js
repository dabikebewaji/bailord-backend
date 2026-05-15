// Create retailers table query (SQLite compatible)
export const CREATE_RETAILERS_TABLE = `
  CREATE TABLE IF NOT EXISTS retailers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT DEFAULT 'Nigeria',
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL CHECK (business_type IN ('Grocery', 'Electronics', 'Fashion', 'Food & Beverage', 'Health & Beauty', 'Other')),
    registration_number TEXT UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    total_sales REAL DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    average_rating REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

// Insert retailer query (SQLite compatible)
export const INSERT_RETAILER = `
  INSERT INTO retailers (
    id, name, email, phone, street_address, city, state, zip_code, country,
    business_name, business_type, registration_number, bank_name, account_number, account_name
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

// Get all retailers with pagination
export const GET_RETAILERS = `
  SELECT * FROM retailers
  WHERE 
    CASE WHEN ? IS NOT NULL THEN business_type = ? ELSE 1 END
    AND CASE WHEN ? IS NOT NULL THEN status = ? ELSE 1 END
    AND CASE WHEN ? IS NOT NULL THEN city = ? ELSE 1 END
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?;
`;

// Count total retailers (for pagination)
export const COUNT_RETAILERS = `
  SELECT COUNT(*) as total FROM retailers
  WHERE 
    CASE WHEN ? IS NOT NULL THEN business_type = ? ELSE 1 END
    AND CASE WHEN ? IS NOT NULL THEN status = ? ELSE 1 END
    AND CASE WHEN ? IS NOT NULL THEN city = ? ELSE 1 END;
`;

// Get single retailer
export const GET_RETAILER = `
  SELECT * FROM retailers WHERE id = ?;
`;

// Update retailer
export const UPDATE_RETAILER = `
  UPDATE retailers 
  SET 
    name = ?,
    phone = ?,
    street_address = ?,
    city = ?,
    state = ?,
    zip_code = ?,
    country = ?,
    business_name = ?,
    business_type = ?,
    registration_number = ?,
    bank_name = ?,
    account_number = ?,
    account_name = ?
  WHERE id = ?;
`;

// Update retailer metrics
export const UPDATE_RETAILER_METRICS = `
  UPDATE retailers 
  SET 
    total_sales = ?,
    total_orders = ?,
    average_rating = ?
  WHERE id = ?;
`;

// Delete retailer
export const DELETE_RETAILER = `
  DELETE FROM retailers WHERE id = ?;
`;