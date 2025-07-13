
-- Create a policy that allows admin users to view all orders
CREATE POLICY "Admin can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'nitinyadav7755321@gmail.com'
    )
  );

-- Create a policy that allows admin users to update all orders
CREATE POLICY "Admin can update all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'nitinyadav7755321@gmail.com'
    )
  );

-- Enable realtime for orders table to get live updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
