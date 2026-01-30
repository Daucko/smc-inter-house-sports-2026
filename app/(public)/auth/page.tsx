'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/hooks/use-toast';
import { Trophy, Loader2, Mail, Lock, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { signIn, signUp, user, isAdmin } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (user && isAdmin) {
            router.push('/admin');
        } else if (user && !isAdmin) {
            toast({
                title: "Access Pending",
                description: "Account created! Contact admin for access privileges.",
            });
        }
    }, [user, isAdmin, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate
        const result = authSchema.safeParse({ email, password });
        if (!result.success) {
            const fieldErrors: { email?: string; password?: string } = {};
            result.error.errors.forEach((err) => {
                if (err.path[0] === 'email') fieldErrors.email = err.message;
                if (err.path[0] === 'password') fieldErrors.password = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);

        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) {
                toast({
                    title: "Sign Up Failed",
                    description: error.message || "Could not create account.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Account Created!",
                    description: "Please check your email to confirm your account, then contact admin for access.",
                });
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                toast({
                    title: "Login Failed",
                    description: error.message || "Invalid credentials. Please try again.",
                    variant: "destructive",
                });
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-gradient-card border border-border rounded-2xl p-8 shadow-glow">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="font-display text-2xl font-bold">
                            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-2">
                            {isSignUp ? 'Register to manage the competition' : 'Sign in to manage the competition'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@school.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isSignUp ? 'Creating Account...' : 'Signing in...'}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
