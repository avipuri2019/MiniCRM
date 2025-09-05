const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Your provided schema and data
const schema = `
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('rep','manager')) DEFAULT 'rep',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  company TEXT,
  status TEXT CHECK(status IN ('new','working','qualified','disqualified')) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  industry TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT CHECK(type IN ('call','email','demo')),
  notes TEXT,
  next_follow_up DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* bcrypt hash for 'Password1!' */
INSERT INTO users (id,email,password_hash,role) VALUES 
('u1','alice@corp.com','$2b$10$LRb6Sk4mJqqljoNV2KqB7el8R/Q9ZLf9rObmhZEC4sSLaS4L4JFfG','manager'),
('u2','bob@corp.com','$2b$10$LRb6Sk4mJqqljoNV2KqB7el8R/Q9ZLf9rObmhZEC4sSLaS4L4JFfG','rep');

INSERT INTO leads (id,owner_id,name,company,status) VALUES 
('l1','u2','Charlie','Acme Inc','working');

INSERT INTO accounts (id,owner_id,name,industry) VALUES 
('a1','u2','Acme Inc','Manufacturing');

INSERT INTO activities (id,account_id,user_id,type,notes) VALUES 
('act1','a1','u2','call','Intro call--good fit!');
`;

try {
  db.exec(schema);
  console.log('Database initialized successfully with sample data!');
  console.log('Sample users:');
  console.log('- alice@corp.com (manager) - Password: Password1!');
  console.log('- bob@corp.com (rep) - Password: Password1!');
} catch (error) {
  console.error('Error initializing database:', error);
} finally {
  db.close();
}
