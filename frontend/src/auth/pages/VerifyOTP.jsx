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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
          }}
        />
      </div>

      <Card className="w-full max-w-md bg-[#111111] border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 rounded-xl">
        <CardHeader className="space-y-3 text-center pb-6 pt-8">
          <div className="flex justify-center mb-2">
            <span className="font-bold text-lg tracking-tight flex text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                  EM
                </span>
                R
              </span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Verify your email
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            We've sent a code to <span className="font-semibold text-white/90">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <CardContent className="space-y-5 p-0 mb-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4 stroke-red-400" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-white/90 font-semibold">One-Time Password</Label>
              <Input 
                id="otp"
                type="text" 
                required 
                maxLength={6}
                placeholder="000000"
                className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-14 text-center text-xl tracking-[0.5em] font-mono rounded-lg transition-all"
                onChange={e => setOtp(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-5 p-0 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] disabled:opacity-50 disabled:shadow-none text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium rounded-lg"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <div className="text-center text-sm text-white/60">
              <Link 
                to={"/a/register" + redirectQuery} 
                className="inline-flex items-center font-semibold text-[#51b749] hover:text-[#38984c] hover:underline transition-colors"
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