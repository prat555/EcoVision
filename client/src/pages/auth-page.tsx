import { useState } from "react";
import { useAuth, RegisterData } from "@/hooks/use-firebase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Redirect } from "wouter";
import { Loader2, User, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    user, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    resetPassword, 
    loginAsGuest 
  } = useAuth();
  
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const handleForgotPassword = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      setShowForgotPassword(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginData) => {
    try {
      setIsLoading(true);
      await loginWithEmail(data.email, data.password);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      await registerWithEmail(data.email, data.password, data.name);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  if (user) {
    return <Redirect to="/" />;
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay - matching home page */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Left Side - Branding */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-xl">
                <svg className="h-11 w-11 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              EcoVision
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              AI-powered sustainable waste management
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-md mx-auto md:mx-0">
              Join thousands of eco-conscious users making a positive impact on our planet through intelligent waste classification and disposal guidance.
            </p>
            
            {/* Features */}
            <div className="mt-8 space-y-3 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
                <span className="text-muted-foreground">Instant AI-powered identification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">♻️</span>
                </div>
                <span className="text-muted-foreground">Smart disposal guidelines</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <span className="text-muted-foreground">24/7 EcoBot assistance</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="w-full md:w-1/2 max-w-md">
            <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur-md bg-card/90 overflow-hidden">
              <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1.5 rounded-none h-14">
                  <TabsTrigger 
                    value="login" 
                    className="font-semibold text-base data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="font-semibold text-base data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <CardContent className="p-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Login with Email
                          </>
                        )}
                      </Button>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <FcGoogle className="h-4 w-4 mr-2" />
                            Continue with Google
                          </>
                        )}
                      </Button>
                                            
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Continue as Guest
                      </Button>
                      
                      <div className="text-center mt-2">
                        <Button
                          variant="link"
                          className="p-0 text-sm"
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 text-primary font-semibold" 
                      onClick={() => setTab("register")}
                    >
                      Sign up
                    </Button>
                  </p>
                </CardFooter>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <CardContent className="p-6">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Sign Up with Email
                          </>
                        )}
                      </Button>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <FcGoogle className="h-4 w-4 mr-2" />
                            Continue with Google
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Continue as Guest
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 text-primary font-semibold" 
                      onClick={() => setTab("login")}
                    >
                      Login
                    </Button>
                  </p>
                </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
}