import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminPasswordPromptProps {
  onAuthenticated: () => void;
}

const AdminPasswordPrompt: React.FC<AdminPasswordPromptProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();

  // Your specific Gmail ID for admin access
  const ADMIN_EMAIL = 'nitinyadav7755321@gmail.com';
  
  // Fallback password for testing
  const ADMIN_PASSWORD = 'nitin@2007';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError('Google login में समस्या हुई है।');
        toast({
          title: "Login Error",
          description: "Google login में समस्या हुई है।",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setError('कोई समस्या हुई है। कृपया फिर से कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (password === ADMIN_PASSWORD) {
        toast({
          title: "Access Granted",
          description: "Welcome to Admin Panel!",
        });
        onAuthenticated();
      } else {
        setError('गलत password! कृपया सही password डालें।');
        toast({
          title: "Access Denied",
          description: "गलत password! कृपया सही password डालें।",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setError('कोई समस्या हुई है। कृपया फिर से कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in with correct Google account
  React.useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      toast({
        title: "Access Granted",
        description: "Welcome Admin! Google authentication successful.",
      });
      onAuthenticated();
    } else if (user && user.email !== ADMIN_EMAIL) {
      setError(`केवल ${ADMIN_EMAIL} से login कर सकते हैं।`);
      toast({
        title: "Access Denied",
        description: `केवल ${ADMIN_EMAIL} से login कर सकते हैं।`,
        variant: "destructive"
      });
      // Sign out the unauthorized user
      supabase.auth.signOut();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel Access</h1>
          <p className="text-gray-600 mt-2">
            Admin panel में access के लिए password डालें
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Google से Admin Login करें'}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">या</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password (Backup)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Admin password डालें"
                  disabled={loading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading || !password}
            >
              {loading ? 'Processing...' : 'Password से Login करें'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 केवल {ADMIN_EMAIL} से access कर सकते हैं।
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordPrompt;
