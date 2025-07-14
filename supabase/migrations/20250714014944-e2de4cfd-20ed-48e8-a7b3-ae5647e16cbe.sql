
-- Update admin policies to use the new email address
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;

-- Create new policies with the updated admin email
CREATE POLICY "Admin can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'ng9218028@gmail.com'
    )
  );

CREATE POLICY "Admin can update all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'ng9218028@gmail.com'
    )
  );
