# TechShop — Database Layer

PostgreSQL 16 database with SQL migration files and seed data.

## Structure

```
db/
└── init/
    ├── 01_schema.sql   — table definitions, indexes, triggers
    └── 02_seed.sql     — sample categories and products
```

Files in `init/` are executed automatically (in alphabetical order) by the PostgreSQL Docker entrypoint **on the first container start**. To re-run them, remove the volume first (`docker compose down -v`).

## Connection details

| Field    | Value          |
|----------|----------------|
| Host     | localhost      |
| Port     | 5432           |
| Database | techshop       |
| User     | techshop       |
| Password | techshop_pass  |

## Schema overview

### Sprint 1
| Table        | Purpose                          |
|--------------|----------------------------------|
| `categories` | Product groupings (5 categories) |
| `products`   | Electronics catalogue (15 items) |

### Planned (future sprints)
| Table         | Sprint | Purpose                     |
|---------------|--------|-----------------------------|
| `users`       | 2      | Registered accounts         |
| `carts`       | 3      | Per-user cart               |
| `cart_items`  | 3      | Items in a cart             |
| `orders`      | 4      | Submitted orders            |
| `order_items` | 4      | Line items of an order      |
| `payments`    | 6      | Payment simulation records  |

## Quick start

```bash
# Start only the database
docker compose up db -d

# Wait for healthy, then connect
docker exec -it techshop-db psql -U techshop -d techshop

# Useful psql commands
\dt                        -- list tables
SELECT * FROM categories;
SELECT COUNT(*) FROM products;
SELECT p.name, p.price, c.name AS category
  FROM products p
  JOIN categories c ON p.category_id = c.id;

# Stop and remove all data (re-runs init scripts on next start)
docker compose down -v
```
