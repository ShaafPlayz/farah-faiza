-- Update Supabase orders table to use 8-digit string IDs
-- Run this in your Supabase SQL Editor

-- First, drop the existing orders table if it exists
-- WARNING: This will delete all existing orders! 
-- If you have important data, export it first.
DROP TABLE IF EXISTS orders;

-- Create new orders table with string ID field
CREATE TABLE orders (
  id VARCHAR(8) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_instructions TEXT,
  payment_method VARCHAR(100) NOT NULL DEFAULT 'Cash on Delivery',
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_date for faster sorting
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);

-- Create index on status for filtering
CREATE INDEX idx_orders_status ON orders(status);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Enable read access for all users" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Test the table by inserting a sample order
INSERT INTO orders (
  id,
  customer_name,
  customer_phone,
  customer_address,
  delivery_instructions,
  payment_method,
  total_amount,
  items,
  order_date,
  status
) VALUES (
  '12345678',
  'Test Customer',
  '+92 300 1234567',
  '123 Test Street, Test City',
  'Test delivery instructions',
  'Cash on Delivery',
  2500.00,
  '[{"id": 1, "name": "Test Product", "price": 2500, "image_url": "/test.jpg", "size": "M", "quantity": 1}]'::jsonb,
  NOW(),
  'pending'
);

-- Verify the insertion worked
SELECT * FROM orders WHERE id = '12345678';