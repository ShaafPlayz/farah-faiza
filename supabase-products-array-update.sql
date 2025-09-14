-- Update Supabase products table to use arrays for images
-- Run this in your Supabase SQL Editor

-- Add new array columns for multiple images (only if they don't exist)
DO $$
BEGIN
    -- Add image_urls column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'image_urls') THEN
        ALTER TABLE products ADD COLUMN image_urls TEXT[];
    END IF;
    
    -- Add image_data_array column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'image_data_array') THEN
        ALTER TABLE products ADD COLUMN image_data_array TEXT[];
    END IF;
END $$;

-- Migration step skipped since old single image columns were already dropped
-- The new array columns (image_urls, image_data_array) are now ready to use

-- Note: Skipping GIN index creation as base64 image data exceeds PostgreSQL's index size limit
-- GIN indexes work better with shorter text arrays like tags or categories
-- For image arrays with base64 data, standard queries will work fine without indexes

-- Test the new structure by inserting a sample product with multiple images
INSERT INTO products (
  name,
  description,
  price,
  image_urls,
  image_data_array,
  category,
  collection,
  sizes,
  created_at,
  updated_at
) VALUES (
  'Test Product with Multiple Images',
  'This is a test product with multiple images using arrays',
  2500.00,
  ARRAY['placeholder1.jpg', 'placeholder2.jpg', 'placeholder3.jpg'],
  ARRAY['placeholder1.jpg', 'placeholder2.jpg', 'placeholder3.jpg'],
  'Clothing',
  'Summer Collection',
  ARRAY['S', 'M', 'L'],
  NOW(),
  NOW()
);

-- Verify the insertion worked
SELECT 
  name,
  array_length(image_urls, 1) as num_image_urls,
  array_length(image_data_array, 1) as num_image_data
FROM products 
WHERE name = 'Test Product with Multiple Images';

-- Show the structure of the products table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;