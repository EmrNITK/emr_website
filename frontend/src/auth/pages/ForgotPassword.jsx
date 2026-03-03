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
            Reset Password
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && step === 2 && (
            <Alert className="bg-[#13703a]/20 border-[#51b749]/50 text-[#51b749]">
              <Check className="h-4 w-4 stroke-[#51b749]" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <form id="forgot-password-form" onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  value={email}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </form>
          ) : (
            <form id="reset-password-form" onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-zinc-300">One-Time Password</Label>
                <Input 
                  id="otp"
                  type="text" 
                  required 
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12 tracking-widest"
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-zinc-300">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password" 
                    required 
                    placeholder="Create a strong password"
                    value={newPassword}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setNewPassword(e.target.value)}
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
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-5 pt-2">
          {step === 1 ? (
            <Button 
              type="submit" 
              form="forgot-password-form"
              disabled={isLoading || !email}
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium disabled:opacity-50 disabled:bg-[#51b749]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Sending...' : 'Send Reset OTP'}
            </Button>
          ) : (
            <Button 
              type="submit" 
              form="reset-password-form"
              disabled={isLoading || !otp || (!isPasswordValid && newPassword.length > 0)}
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium disabled:opacity-50 disabled:bg-[#51b749]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
          
          <div className="text-center text-sm text-zinc-400">
            <Link 
              to={"/a/login" + redirectQuery} 
              className="inline-flex items-center font-semibold text-[#51b749] hover:text-[#13703a] hover:underline transition-colors"
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