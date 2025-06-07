
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "parent" | "tutor";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('talentschool_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('talentschool_user');
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent deadlock in auth callback
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log("Profile fetch result:", profile, error);
              
              if (profile && !error && mounted) {
                const userData = {
                  id: session.user.id,
                  fullName: profile.full_name,
                  email: session.user.email || '',
                  role: profile.role,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
                };
                
                setUser(userData);
                // Store user data in localStorage for persistence
                localStorage.setItem('talentschool_user', JSON.stringify(userData));
              } else if (error && mounted) {
                console.error("Error fetching profile:", error);
                setUser(null);
                localStorage.removeItem('talentschool_user');
              }
            } catch (err) {
              console.error("Error in profile fetch:", err);
              if (mounted) {
                setUser(null);
                localStorage.removeItem('talentschool_user');
              }
            }
            
            if (mounted) {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('talentschool_user');
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      if (!session && mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string, role: User['role']) => {
    setIsLoading(true);
    try {
      console.log("Starting signup with:", { fullName, email, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/redirect`,
        },
      });
      
      console.log("Signup result:", data, error);
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      // If signup was successful but user needs email confirmation
      if (data.user && !data.session) {
        console.log("User created but needs email confirmation");
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setSession(null);
      localStorage.removeItem('talentschool_user');
      await supabase.auth.signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    login,
    signup,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
