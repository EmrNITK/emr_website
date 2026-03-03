import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirectUrl = searchParams.get('redirect');
  const redirectQuery = redirectUrl ? '?redirect=' + redirectUrl : '';
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/a/register' + redirectQuery);
    }
  }, [email, navigate, redirectQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post(API_URL + '/auth/verify-otp', {
        email,
        otp
      });
      
      localStorage.setItem('userId', res.data.user._id);
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        navigate('/a/role-selection');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100">
            Verify your email
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            We've sent a code to <span className="font-semibold text-zinc-300">{email}</span>
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
              <Label htmlFor="otp" className="text-zinc-300">One-Time Password</Label>
              <Input 
                id="otp"
                type="text" 
                required 
                maxLength={6}
                placeholder="000000"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-14 text-center text-xl tracking-[0.5em] font-mono"
                onChange={e => setOtp(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-5 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium disabled:opacity-50 disabled:bg-[#51b749]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <div className="text-center text-sm text-zinc-400">
              <Link 
                to={"/a/register" + redirectQuery} 
                className="inline-flex items-center font-semibold text-[#51b749] hover:text-[#13703a] hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to registration
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}