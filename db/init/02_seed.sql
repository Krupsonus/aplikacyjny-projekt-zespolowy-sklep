-- =============================================================================
-- TechShop Seed Data
-- Sprint 1: 5 categories, 15 electronics products
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
INSERT INTO categories (name, slug, description) VALUES
    ('Laptops',      'laptops',      'Portable computers for work and study'),
    ('Smartphones',  'smartphones',  'Mobile phones and accessories'),
    ('Audio',        'audio',        'Headphones, earbuds and speakers'),
    ('Accessories',  'accessories',  'Cables, chargers, mice and more'),
    ('Gaming',       'gaming',       'Controllers, peripherals and monitors')
ON CONFLICT (slug) DO NOTHING;


-- -----------------------------------------------------------------------------
-- Products (15 items — 3 per category)
-- Prices in USD, realistic electronics pricing
-- -----------------------------------------------------------------------------

-- Laptops (category_id = 1)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
    'Dell XPS 15 (2024)',
    'Premium 15.6" OLED laptop with Intel Core i7-13700H, 16GB RAM, 512GB SSD. '
    'Perfect for creative professionals who demand performance and portability.',
    1299.99, 12, NULL, 1
),
(
    'Apple MacBook Air M2',
    '13.6" Liquid Retina display, Apple M2 chip, 8GB unified memory, 256GB SSD. '
    'Fanless design, up to 18 hours battery life.',
    999.99, 20, NULL, 1
),
(
    'Lenovo ThinkPad X1 Carbon Gen 11',
    'Ultra-light 14" business laptop with Intel vPro, 16GB LPDDR5, 512GB SSD. '
    'MIL-SPEC tested durability, Thunderbolt 4, fingerprint reader.',
    1499.99, 8, NULL, 1
);

-- Smartphones (category_id = 2)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
    'iPhone 15 Pro',
    '6.1" Super Retina XDR display, A17 Pro chip, 48MP main camera system. '
    'Titanium design, USB-C, Action Button.',
    999.00, 25, NULL, 2
),
(
    'Samsung Galaxy S24',
    '6.2" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 50MP triple camera. '
    'Galaxy AI features, 7 years of OS and security updates.',
    799.99, 18, NULL, 2
),
(
    'Google Pixel 8',
    '6.2" Actua display, Google Tensor G3, 50MP camera with Magic Eraser. '
    'Built-in VPN, 7 years of updates guaranteed.',
    699.99, 15, NULL, 2
);

-- Audio (category_id = 3)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
    'Sony WH-1000XM5 Headphones',
    'Industry-leading noise cancellation, 30-hour battery, Multipoint connection. '
    'Speak-to-Chat technology, foldable design for easy portability.',
    349.99, 30, NULL, 3
),
(
    'Apple AirPods Pro (2nd Gen)',
    'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio. '
    'Up to 6 hours listening time (30h with case), USB-C charging.',
    249.99, 40, NULL, 3
),
(
    'JBL Charge 5 Bluetooth Speaker',
    'Powerful portable speaker with IP67 waterproof rating, 20 hours playtime. '
    'Built-in power bank, PartyBoost to pair with multiple speakers.',
    149.99, 22, NULL, 3
);

-- Accessories (category_id = 4)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
    'Anker 65W USB-C GaN Charger',
    'Compact 65W 3-port charger (2× USB-C, 1× USB-A) with GaN II technology. '
    'Charges MacBook Pro, iPhone and iPad simultaneously.',
    39.99, 60, NULL, 4
),
(
    'SanDisk 1TB Portable SSD',
    'Up to 1050 MB/s read speeds, USB 3.2 Gen 2, shock-resistant casing. '
    'Compact enough to fit in your pocket, password protection included.',
    89.99, 35, NULL, 4
),
(
    'Logitech MX Master 3S Mouse',
    '8K DPI sensor, MagSpeed electromagnetic scroll wheel, Quiet Click buttons. '
    'Works on any surface including glass, Bluetooth + USB receiver.',
    99.99, 28, NULL, 4
);

-- Gaming (category_id = 5)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
    'PlayStation 5 DualSense Controller',
    'Haptic feedback and adaptive triggers for immersive gameplay. '
    'Built-in microphone, USB-C charging, 12-hour battery life.',
    69.99, 45, NULL, 5
),
(
    'Razer DeathAdder V3 Gaming Mouse',
    '59g ultra-lightweight design, Focus Pro 30K optical sensor. '
    'Razer Speedflex Cable, 90-hour battery, Razer Synapse support.',
    79.99, 20, NULL, 5
),
(
    'ASUS TUF Gaming VG27AQ Monitor 27"',
    '27" WQHD (2560×1440) IPS, 165Hz refresh rate, 1ms MPRT response. '
    'G-Sync compatible, HDR10, Extreme Low Motion Blur technology.',
    299.99, 10, NULL, 5
);
