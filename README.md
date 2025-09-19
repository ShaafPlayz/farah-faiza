# Zarab Collections - Next.js E-commerce Application

An e-commerce website for clothing built with Next.js, TypeScript, and Supabase.

Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Docker-ready with GitHub Actions CI/CD on Digital Ocean


## Environment Variables

This application uses a runtime-only approach for environment variables to ensure builds can succeed in CI/CD environments without access to secrets.

### Required Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Development vs Production

- **Development**: Use `.env.local` file
- **Production**: Set environment variables in your deployment environment
- **Build**: No environment variables required during build process

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

### Docker Deployment (Recommended)

This application is designed for Docker deployment with runtime environment variables:

1. **Build the Docker image** (GitHub Actions handles this automatically)
   ```bash
   docker build -t your-app:latest .
   ```

2. **Set environment variables** on your server
   ```bash
   # Create .env file on your server
   echo "SUPABASE_URL=https://your-project-id.supabase.co" >> .env
   echo "SUPABASE_ANON_KEY=your-anon-key" >> .env
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker compose up -d
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting environment
   ```bash
   export SUPABASE_URL=https://your-project-id.supabase.co
   export SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the application**
   ```bash
   npm start
   ```

### CI/CD with GitHub Actions

The included GitHub Actions workflow:
- Builds the Docker image without requiring environment variables
- Deploys to your VPS automatically
- Environment variables are set at runtime on the server

## Troubleshooting

### Common Issues

1. **Supabase connection errors**
   - Verify your environment variables are set correctly
   - Check if your Supabase project is active
   - Ensure RLS policies are correctly set

2. **Build failures in CI/CD**
   - The build should now work without environment variables
   - If still failing, check the Supabase client configuration

3. **Runtime environment variable errors**
   - Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in your deployment environment
   - Check that environment variables are available to the Node.js process

4. **Image loading issues**
   - Make sure image URLs are publicly accessible
   - Check the Next.js image optimization settings

5. **Authentication issues**
   - Verify your Supabase auth configuration
   - Check if users are created in Supabase dashboard

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the `ENVIRONMENT_SETUP.md` file
3. Review Supabase documentation
4. Check Next.js documentation

## License

This project is licensed under the MIT License.
