import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const redirectParam = searchParams.get('redirect');
  const redirectQuery = redirectParam ? '?redirect=' + redirectParam : '';

  const pwdReqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword)
  };
  
  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axios.post(API_URL + '/auth/forgot-password', { email });
      setSuccess('OTP sent successfully to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isPasswordValid) {
      setError('Please ensure all password requirements are met.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(API_URL + '/auth/reset-forgot-password', {
        email, 
        otp, 
        newPassword
      });
      navigate('/a/login' + redirectQuery);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-[#51b749]" />
      ) : (
        <X className="w-4 h-4 text-white/40" />
      )}
      <span className={met ? "text-white/90" : "text-white/40"}>{text}</span>
    </div>
  );

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

      <Card className="w-full max-w-md bg-[#111111] border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 rounded-xl my-8">
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 p-0 px-6 mb-6">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
              <AlertCircle className="h-4 w-4 stroke-red-400" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && step === 2 && (
            <Alert className="bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]">
              <Check className="h-4 w-4 stroke-[#51b749]" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <form id="forgot-password-form" onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-semibold">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  value={email}
                  className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </form>
          ) : (
            <form id="reset-password-form" onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white/90 font-semibold">One-Time Password</Label>
                <Input 
                  id="otp"
                  type="text" 
                  required 
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 tracking-widest rounded-lg transition-all text-center font-mono"
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white/90 font-semibold">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password" 
                    required 
                    placeholder="Create a strong password"
                    value={newPassword}
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 space-y-2 border border-white/5">
                  <RequirementItem met={pwdReqs.length} text="At least 8 characters" />
                  <RequirementItem met={pwdReqs.upper} text="One uppercase letter" />
                  <RequirementItem met={pwdReqs.lower} text="One lowercase letter" />
                  <RequirementItem met={pwdReqs.number} text="One number" />
                  <RequirementItem met={pwdReqs.special} text="One special character" />
                </div>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-5 p-0 px-6 pb-6 pt-2">
          {step === 1 ? (
            <Button 
              type="submit" 
              form="forgot-password-form"
              disabled={isLoading || !email}
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium disabled:opacity-50 disabled:shadow-none rounded-lg"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Sending...' : 'Send Reset OTP'}
            </Button>
          ) : (
            <Button 
              type="submit" 
              form="reset-password-form"
              disabled={isLoading || !otp || (!isPasswordValid && newPassword.length > 0)}
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium disabled:opacity-50 disabled:shadow-none rounded-lg"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
          
          <div className="text-center text-sm text-white/60">
            <Link 
              to={"/a/login" + redirectQuery} 
              className="inline-flex items-center font-semibold text-[#51b749] hover:text-[#38984c] hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}