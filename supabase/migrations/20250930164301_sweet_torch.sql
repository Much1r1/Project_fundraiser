/*
  # Create Admin User

  1. New Admin User
    - Creates an admin user with email and password
    - Sets up proper role and permissions
    - Enables the user account

  2. Security
    - Admin user has 'admin' role
    - Account is verified and active
*/

-- Insert admin user into auth.users (this would normally be done through Supabase Auth)
-- For now, we'll create the profile and you'll need to sign up manually with this email

-- Create admin user profile
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  verification_status,
  wallet_balance,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@fundrise.com',
  'System Administrator',
  'admin',
  'verified',
  0,
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  verification_status = 'verified',
  is_active = true,
  updated_at = now();

-- Also create a backup admin
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  verification_status,
  wallet_balance,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'superadmin@fundrise.com',
  'Super Administrator',
  'admin',
  'verified',
  0,
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  verification_status = 'verified',
  is_active = true,
  updated_at = now();
/*
  # Create Admin User

  1. New Admin User
    - Creates an admin user with email and password
    - Sets up proper role and permissions
    - Enables the user account

  2. Security
    - Admin user has 'admin' role
    - Account is verified and active
*/

-- Insert admin user into auth.users (this would normally be done through Supabase Auth)
-- For now, we'll create the profile and you'll need to sign up manually with this email

-- Create admin user profile
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  verification_status,
  wallet_balance,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@fundrise.com',
  'System Administrator',
  'admin',
  'verified',
  0,
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  verification_status = 'verified',
  is_active = true,
  updated_at = now();

-- Also create a backup admin
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  verification_status,
  wallet_balance,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'superadmin@fundrise.com',
  'Super Administrator',
  'admin',
  'verified',
  0,
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  verification_status = 'verified',
  is_active = true,
  updated_at = now();
  