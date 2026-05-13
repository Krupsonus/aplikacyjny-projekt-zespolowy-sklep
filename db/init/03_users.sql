-- Sprint 2: users table
CREATE TYPE user_role AS ENUM ('customer', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Seed accounts
-- admin@techshop.com / Admin1234!
-- customer@techshop.com / Customer1234!
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('admin@techshop.com',    '$2b$12$0XN/Bl0NFUqdJhgWKufy7eHhGoQXoHNkPOBysqMczKYgF4CF2CdcW', 'Admin',    'TechShop', 'admin'),
  ('customer@techshop.com', '$2b$12$T4QEFKQvY0h6Rj8Gz0VbTOXZRaDlgysxO63iI62NrHDoQbhaOkNwK', 'Test',     'Customer', 'customer')
ON CONFLICT (email) DO NOTHING;
