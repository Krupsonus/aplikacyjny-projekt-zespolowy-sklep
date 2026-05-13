-- =============================================================================
-- TechShop Database Schema
-- Sprint 1: categories and products tables
-- =============================================================================

-- Trigger function: auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- -----------------------------------------------------------------------------
-- categories
-- Lookup table for product groupings (Laptops, Smartphones, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,   -- URL-friendly identifier
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- products
-- Core product catalogue with stock tracking and category association
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock       INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url   VARCHAR(500),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update updated_at whenever a product row is changed
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name        ON products USING BTREE (name);
