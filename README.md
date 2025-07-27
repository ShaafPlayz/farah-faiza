# Zarab Collections - Next.js E-commerce Application

A modern e-commerce website for feminine ready-to-wear clothing built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Public Website**: Homepage and shop page with elegant design
- **Seller Authentication**: Secure login system for sellers
- **Admin Dashboard**: Complete product management system
- **Product Management**: Add, edit, and delete products with images
- **Responsive Design**: Mobile-friendly interface
- **Database Integration**: Supabase for authentication and data storage

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom styles
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment Ready**: Vercel-optimized

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zarab-collections
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and update with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Supabase Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project name: "zarab-collections"
6. Generate a strong database password
7. Select your region
8. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ`)

### 3. Update Environment Variables

Replace the values in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  image_data TEXT, -- Base64 encoded image data
  category VARCHAR(100) NOT NULL,
  collection VARCHAR(100),
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 5. Create Your First Seller Account

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click "Add user"
3. Enter email and password for your seller account
4. Click "Create user"

### 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Go to [http://localhost:3000](http://localhost:3000) to see the public website
3. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel
4. Log in with the seller credentials you created
5. Add your first product!

## Project Structure

```
zarab-collections/
├── app/
│   ├── admin/                 # Admin dashboard
│   │   ├── components/        # Admin-specific components
│   │   └── page.tsx          # Admin main page
│   ├── components/            # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── ProductCard.tsx
│   ├── shop/                  # Shop page
│   │   └── page.tsx
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── lib/
│   └── supabase.ts            # Supabase configuration
├── public/
│   └── images/                # Static images
├── types/                     # TypeScript types
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Public Website
- **Homepage**: Hero slider, brand introduction, elegant design
- **Shop Page**: Product grid, filtering, sorting, pagination
- **Responsive**: Mobile-optimized design

### Admin Dashboard
- **Authentication**: Secure seller login
- **Product Management**: CRUD operations for products
- **Image Upload**: Drag & drop file upload with react-dropzone (stored in database)
- **Category Management**: Organize products by categories
- **Size Management**: Multiple size options per product

### Design Features
- **Custom Fonts**: Playfair Display, Poppins, Cormorant Garamond
- **Color Scheme**: Black, gold (#C5A875), and neutral tones
- **Animations**: Smooth transitions and hover effects
- **Icons**: Font Awesome integration

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Troubleshooting

### Common Issues

1. **Supabase connection errors**
   - Verify your environment variables
   - Check if your Supabase project is active
   - Ensure RLS policies are correctly set

2. **Image loading issues**
   - Make sure image URLs are publicly accessible
   - Check the Next.js image optimization settings

3. **Authentication issues**
   - Verify your Supabase auth configuration
   - Check if users are created in Supabase dashboard

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check Next.js documentation

## License

This project is licensed under the MIT License.