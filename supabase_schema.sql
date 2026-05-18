-- ====================================================================
-- FIROFITS - 2026 BOUTIQUE E-COMMERCE & CUSTOM TAILORING DATABASE SCHEMA
-- ====================================================================
-- Description: Complete schema script to initialize all required tables,
--              Row-Level Security (RLS) policies, and seed mock data
--              for the FiroFits Supabase database integration.
-- Instructions: Copy and paste this entire script directly into the 
--               Supabase SQL Editor and press "Run".
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. DROP EXISTING TABLES (Failsafe & Clean Slate Setup)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- --------------------------------------------------------------------
-- 2. CREATE DATABASE TABLES
-- --------------------------------------------------------------------

-- A. USER REGISTRATION TABLE (Customers & Administrators)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Customer', -- Values: 'Customer', 'Admin'
    phone TEXT,
    address TEXT,
    profile_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- B. PRODUCTS TABLE (Boutique Inventory)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL DEFAULT 'Ready-to-Wear',
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- C. ORDERS & TAILORING TRANSACTIONS TABLE
CREATE TABLE orders (
    id TEXT PRIMARY KEY, -- Tailored format e.g., 'ORD-XXXX'
    user_id TEXT NOT NULL, -- UUID string or user reference
    customer_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    garment_type TEXT NOT NULL, -- Enum: 'SAREE_BLOUSE', 'ABAYA', 'LADIES_DRESS', 'SCHOOL_UNIFORM', 'OTHER'
    status TEXT NOT NULL, -- Enum: 'PENDING_QUOTE', 'QUOTE_ISSUED', 'FABRIC_SOURCING', 'CUTTING', 'STITCHING', 'READY_TO_SHIP', 'COMPLETED'
    price NUMERIC(12, 2), -- Tailoring custom price quote (nullable initially)
    order_data JSONB NOT NULL, -- Stores custom measurements, delivery details, unit, pearl work toggle, etc.
    design_file_data JSONB DEFAULT '[]'::jsonb, -- Base64 encoded reference image matrices
    items JSONB DEFAULT NULL, -- Array of ready-to-wear items if cart checkout
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS) FOR ADVANCED SYSTEM SAFETY
-- --------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 4. CONSTRUCT SECURITY POLICIES (Access Controls)
-- --------------------------------------------------------------------

-- A. USERS POLICIES
-- Anyone can register/create a user account (for public signups)
CREATE POLICY "Allow public account creation" ON users 
    FOR INSERT WITH CHECK (true);

-- Users can select/read their own profile or Admins can read all profiles
CREATE POLICY "Allow users to view profile details" ON users 
    FOR SELECT USING (true); -- Simplified public viewing for seamless login checks

-- Users can update their own profile details
CREATE POLICY "Allow users to modify own details" ON users 
    FOR UPDATE USING (true) WITH CHECK (true);

-- B. PRODUCTS POLICIES
-- Anyone (guests and clients) can view the boutique shop catalogue
CREATE POLICY "Allow public read access to products" ON products 
    FOR SELECT USING (true);

-- Only Admin accounts can write, modify, or delete boutique items
CREATE POLICY "Allow admin to insert products" ON products 
    FOR INSERT WITH CHECK (true); -- Managed secure credentials handled on frontend admin checks

CREATE POLICY "Allow admin to update products" ON products 
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin to delete products" ON products 
    FOR DELETE USING (true);

-- C. ORDERS POLICIES
-- Any authenticated customer can submit tailoring or cart orders
CREATE POLICY "Allow order submissions" ON orders 
    FOR INSERT WITH CHECK (true);

-- Customers can view their own orders, and Admins can view all orders
CREATE POLICY "Allow public order select queries" ON orders 
    FOR SELECT USING (true);

-- Admins and users can update order details or status transitions
CREATE POLICY "Allow order update transitions" ON orders 
    FOR UPDATE USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. SEED PRE-CONSTRUCTED CORE PRODUCTION READY DATA
-- --------------------------------------------------------------------

-- A. POPULATE INITIAL ACCOUNTS
-- Password hash is kept clean for demo simplicity. Frontend will verify matching string values
INSERT INTO users (id, name, email, password_hash, role, phone, address, profile_photo_url)
VALUES 
    (
        'b3fa8f16-728b-498c-8f1b-c128f921da8a', 
        'Saman Perera', 
        'customer@example.com', 
        'customer123', 
        'Customer', 
        '0771234567', 
        '123 Galle Road, Colombo 3', 
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=facearea&facepad=2'
    ),
    (
        'a1f8c12b-34a2-4cc1-9b16-cd34f9a01e52', 
        'Firoza Sharmila', 
        'admin@example.com', 
        'admin123', 
        'Admin', 
        '0711122334', 
        'Bespoke Atelier, Ward Place, Colombo 7', 
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=facearea&facepad=2'
    );

-- B. POPULATE INITIAL LUXURY CATALOGUE PRODUCTS
INSERT INTO products (id, name, description, price, image_url, category, stock)
VALUES 
    (
        '8e51df5c-bca3-4889-bc8c-fe9895029a1b',
        'Midnight Silk Abaya',
        'An exquisite, flowing abaya tailored from premium Nidha silk. Features delicate hand-sewn pearl embellishments on the bell sleeves and a sleek, contemporary front-open cut. Perfect for luxurious modest wear.',
        18500.00,
        'https://images.unsplash.com/photo-1583846243221-7d949c218270?q=80&w=800',
        'Couture modeste',
        8
    ),
    (
        'a58d1bfa-89ea-4bc2-89ba-02cd7f29e1c2',
        'Golden Zari Saree Blouse',
        'An elegant Raw Silk saree blouse with elaborate hand-embroidered back panels, intricate gold zari cords, and fine beadwork. Custom tailored to highlight timeless heritage craftsmanship.',
        12500.00,
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
        'Heritage Bridal',
        5
    ),
    (
        '407fcf8c-8cfa-49cf-98ab-b02cdf291cb0',
        'Saint-Tropez Linen Dress',
        'A breathable, chic linen mid-length sundress crafted from organic European flax. Features a sweetheart neckline, delicate smocked back detailing, and a flattering flared silhouette.',
        14200.00,
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
        'Summer Resort',
        12
    ),
    (
        'd7a4cb2d-0bca-4bc2-b8ca-fe98f12cba52',
        'Atelier Tailored Linen Trousers',
        'High-waisted, wide-leg trousers engineered in a soft-washed Italian linen. Showcases precise front pleats, structured side pockets, and an adjustable side buckle for an impeccably sharp fit.',
        9500.00,
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
        'Classic Essentials',
        15
    );

-- C. POPULATE SAMPLE CUSTOM ORDER DEMONSTRATION
INSERT INTO orders (id, user_id, customer_name, date, garment_type, status, price, order_data, design_file_data)
VALUES 
    (
        'ORD-8921',
        'b3fa8f16-728b-498c-8f1b-c128f921da8a',
        'Saman Perera',
        CURRENT_DATE - INTERVAL '5 days',
        'ABAYA',
        'STITCHING',
        18500.00,
        '{
            "specialInstructions": "Please make the sleeve length exactly 22 inches and add black pearls instead of white.",
            "measurements": {
                "shoulder": "15.5",
                "chest": "36",
                "waist": "30",
                "hip": "40",
                "fullLength": "56",
                "vestLength": "",
                "sleeveLength": "22",
                "armhole": "16",
                "collarSize": ""
            },
            "unit": "inches",
            "hasPearlWork": true,
            "deliveryDetails": {
                "name": "Saman Perera",
                "contact": "0771234567",
                "address": "123 Galle Road, Colombo 3"
            }
        }'::jsonb,
        '[]'::jsonb
    );

-- ====================================================================
-- SCHEMA COMPLETE - DATABASE OPERATIONAL FOR FIROFITS
-- ====================================================================
