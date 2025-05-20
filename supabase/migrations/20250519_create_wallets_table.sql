-- Create wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  name TEXT,
  network TEXT DEFAULT 'ethereum',
  balance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS wallets_address_idx ON public.wallets(address);

-- Set up Row Level Security (RLS)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own wallets
CREATE POLICY "Users can view their own wallets" 
  ON public.wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own wallets
CREATE POLICY "Users can insert their own wallets" 
  ON public.wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own wallets
CREATE POLICY "Users can update their own wallets" 
  ON public.wallets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own wallets
CREATE POLICY "Users can delete their own wallets" 
  ON public.wallets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a unique constraint to prevent duplicate wallet addresses per user
ALTER TABLE public.wallets 
  ADD CONSTRAINT wallets_user_id_address_unique 
  UNIQUE (user_id, address);
