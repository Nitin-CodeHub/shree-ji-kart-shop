
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminPasswordPromptProps {
  onAuthenticated: () => void;
}

const AdminPasswordPrompt: React.FC<AdminPasswordPromptProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Admin password - you can change this to any password you want
  const ADMIN_PASSWORD = 'admin123';

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Admin Password *</Label>
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
                required
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
            {loading ? 'Processing...' : 'Admin Panel में Enter करें'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 यह admin panel secure है। केवल authorized users ही access कर सकते हैं।
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordPrompt;
