import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const redirectParam = searchParams.get('redirect');
  const redirectQuery = redirectParam ? '?redirect=' + redirectParam : '';

  const pwdReqs = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };
  
  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isPasswordValid) {
      setError('Please ensure all password requirements are met.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(API_URL + '/auth/register', formData);
      navigate('/a/verify-otp' + redirectQuery, { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-[#51b749]" />
      ) : (
        <X className="w-4 h-4 text-zinc-500" />
      )}
      <span className={met ? "text-zinc-300" : "text-zinc-500"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100">
            Create an account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Username</Label>
              <Input 
                id="name"
                type="text" 
                required 
                placeholder="Choose a username"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input 
                id="email"
                type="email" 
                required 
                placeholder="name@example.com"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  required 
                  placeholder="Create a strong password"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 space-y-2 border border-zinc-800/50">
                <RequirementItem met={pwdReqs.length} text="At least 8 characters" />
                <RequirementItem met={pwdReqs.upper} text="One uppercase letter" />
                <RequirementItem met={pwdReqs.lower} text="One lowercase letter" />
                <RequirementItem met={pwdReqs.number} text="One number" />
                <RequirementItem met={pwdReqs.special} text="One special character" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-5 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || (!isPasswordValid && formData.password.length > 0)}
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium disabled:opacity-50 disabled:bg-[#51b749]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
            
            <div className="text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <Link 
                to={"/a/login" + redirectQuery} 
                className="font-semibold text-[#51b749] hover:text-[#13703a] hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}