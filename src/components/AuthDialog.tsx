import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setError(''); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("कृपया email और password भरें");
      return false;
    }

    if (!isLogin && !formData.name) {
      setError("कृपया registration के लिए अपना नाम भरें");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setFormLoading(true);
    setError('');

    try {
      const { error } = isLogin 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            pincode: formData.pincode
          });

      if (error) {
        let errorMessage = error.message;
        
        // Handle specific error cases in Hindi
        if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'कृपया अपना email check करें और verification link पर click करें।';
        } else if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'गलत email या password। कृपया अपनी जानकारी check करें।';
        } else if (error.message?.includes('User already registered')) {
          errorMessage = 'इस email का account पहले से है। कृपया login करें।';
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = 'कृपया सही email address भरें।';
        } else if (error.message?.includes('Password should be at least')) {
          errorMessage = 'Password कम से कम 6 characters का होना चाहिए।';
        }

        setError(errorMessage);
        
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        if (!isLogin) {
          toast({
            title: "Account बन गया!",
            description: "कृपया अपना email check करें और account verify करें।",
          });
        }
        onOpenChange(false);
        setFormData({ email: '', password: '', name: '', phone: '', address: '', pincode: '' });
        setError('');
      }
    } catch (error: any) {
      const errorMessage = error.message || "कोई समस्या हुई है";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormLoading(true);
    setError('');
    
    try {
      console.log('Starting Google sign in process...');
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign in error:', error);
        let errorMessage = "Google login में समस्या हुई।";
        
        if (error.message.includes('redirect_uri_mismatch')) {
          errorMessage = "Google OAuth redirect URL configuration गलत है। Admin से contact करें।";
        } else if (error.message.includes('unauthorized_client')) {
          errorMessage = "Google OAuth client properly configured नहीं है। Admin से contact करें।";
        } else if (error.message.includes('access_denied')) {
          errorMessage = "Google login permission denied। Please try again।";
        } else if (error.message.includes('popup_blocked')) {
          errorMessage = "Browser popup blocked है। Please allow popups और try again।";
        }
        
        setError(errorMessage);
        toast({
          title: "Google Login Error",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('Google OAuth redirect initiated successfully');
        // Don't close dialog immediately as user will be redirected
      }
    } catch (error: any) {
      console.error('Unexpected Google login error:', error);
      const errorMessage = "Google login में unexpected error हुई। कृपया email login का use करें।";
      setError(errorMessage);
      toast({
        title: "Google Login Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', phone: '', address: '', pincode: '' });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {isLogin 
              ? 'अपने account में login करें या Google का use करें।' 
              : 'नया account बनाने के लिए details भरें।'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={formLoading || loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {formLoading ? 'Process हो रहा है...' : 'Google से Login करें'}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">या Email से Login करें</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">पूरा नाम *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="अपना पूरा नाम भरें"
                  required={!isLogin}
                  disabled={formLoading || loading}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="अपना email भरें"
                required
                disabled={formLoading || loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="अपना password भरें"
                  required
                  disabled={formLoading || loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={formLoading || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="अपना phone number भरें"
                    disabled={formLoading || loading}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="अपना address भरें"
                    disabled={formLoading || loading}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="अपना pincode भरें"
                    disabled={formLoading || loading}
                  />
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={formLoading || loading}
            >
              {formLoading ? 'Process हो रहा है...' : (isLogin ? 'Login करें' : 'Sign Up करें')}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-sm"
              disabled={formLoading || loading}
            >
              {isLogin ? "Account नहीं है? Sign up करें" : "पहले से account है? Login करें"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
