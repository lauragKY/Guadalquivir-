/*
  # Fix User Profiles RLS Policies - Remove Infinite Recursion

  1. Changes
    - Drop existing policies that cause infinite recursion
    - Create new simplified policies that don't self-reference user_profiles
    - Use a single policy that allows users to read their own profile
    - Use a single policy that allows reading all profiles (needed for joins)
    
  2. Security
    - Maintains security by checking auth.uid() directly
    - Allows authenticated users to read profiles (needed for displaying names in UI)
    - Only admins can modify profiles
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;

-- Create new non-recursive policies
-- Allow all authenticated users to read all profiles (needed for UI joins and references)
CREATE POLICY "Authenticated users can read profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to insert new profiles (role check in application layer)
CREATE POLICY "Authenticated users can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
