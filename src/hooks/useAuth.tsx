

import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (userData: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Clean up auth state function
  const cleanupAuthState = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning auth state:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully:', session.user.email);
          
          // Get user's display name for toast
          const displayName = getUserDisplayName(session.user);
          
          // Show success message
          toast({
            title: "Login Successful!",
            description: `Welcome back, ${displayName}!`,
          });

          // Defer profile creation/update to prevent deadlocks
          setTimeout(() => {
            ensureUserProfile(session.user);
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          cleanupAuthState();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to get user's display name
  const getUserDisplayName = (user: User) => {
    const metadata = user.user_metadata || {};
    return metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User';
  };

  const ensureUserProfile = async (user: User) => {
    try {
      console.log('Ensuring user profile for:', user.email);
      console.log('User metadata:', user.user_metadata);
      
      // Check if profile exists
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      const metadata = user.user_metadata || {};
      
      // If profile doesn't exist, create it
      if (!profile) {
        console.log('Creating new profile for user');
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: metadata.full_name || metadata.name || user.email?.split('@')[0] || '',
            phone: metadata.phone || '',
            address: metadata.address || '',
            pincode: metadata.pincode || ''
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully with name:', metadata.full_name || metadata.name);
        }
      } else {
        console.log('Profile already exists:', profile.name);
        
        // Update profile with Google metadata if name is missing or different
        const shouldUpdate = !profile.name || 
          (metadata.full_name && profile.name !== metadata.full_name) ||
          (metadata.name && profile.name !== metadata.name);

        if (shouldUpdate) {
          const updatedName = metadata.full_name || metadata.name || profile.name || user.email?.split('@')[0] || '';
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              name: updatedName,
              phone: metadata.phone || profile.phone || '',
              address: metadata.address || profile.address || '',
              pincode: metadata.pincode || profile.pincode || ''
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('Profile updated successfully with name:', updatedName);
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      cleanupAuthState();
      
      console.log('Attempting to sign up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData || {}
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up successful:', data.user?.email);

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to verify your email address.",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      cleanupAuthState();
      
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Email not verified",
          description: "Please check your email and click the verification link.",
          variant: "destructive"
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      cleanupAuthState();
      
      console.log('Attempting Google sign in...');
      
      // Use the exact redirect URL that should be configured in Supabase
      const redirectUrl = `${window.location.origin}/`;
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        
        // Handle 404 and other common Google OAuth errors
        let errorMessage = "Google login failed. ";
        
        if (error.message.includes('404') || error.message.includes('not found')) {
          errorMessage = "Google login configuration error. Please contact support to fix the redirect URLs.";
        } else if (error.message.includes('provider is not enabled')) {
          errorMessage = "Google login is not enabled. Please contact support or try email login.";
        } else if (error.message.includes('Invalid redirect URL')) {
          errorMessage = "Invalid redirect URL. Please contact support to fix the configuration.";
        } else if (error.message.includes('unauthorized_client')) {
          errorMessage = "Google OAuth client not properly configured. Please contact support.";
        } else {
          errorMessage += error.message;
        }

        toast({
          title: "Google Login Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        return { error };
      }

      console.log('Google OAuth initiated successfully');
      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Login Error",
        description: "An unexpected error occurred. Please try email login instead.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user...');
      
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Sign out error:', error);
      // Force reload even if sign out fails
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile for user:', user.email);
      
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      console.log('Profile updated successfully');
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      loading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

