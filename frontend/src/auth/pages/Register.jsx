import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (isLoading) return;

    setError('');
    setSuccess('');

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    if (!trimmedData.name || !trimmedData.email || !trimmedData.password) {
      setError('All fields are required.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure all password requirements are met.');
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        API_URL + '/auth/register',
        trimmedData
      );

      setSuccess(res.data.message || 'OTP sent to your email.');

      setTimeout(() => {
        navigate('/a/verify-otp' + redirectQuery, {
          state: { email: trimmedData.email }
        });
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
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
      <span className={met ? "text-white/90" : "text-white/40"}>
        {text}
      </span>
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

      <Card className="w-full max-w-md bg-[#111111] border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 rounded-xl mt-8 mb-8">
        
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
            Create an account
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Enter your details to get started
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

            {success && (
              <Alert className="bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]">
                <Check className="h-4 w-4 stroke-[#51b749]" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90 font-semibold">
                Username
              </Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Choose a username"
                className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError('');
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                value={formData.email}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value.trim().toLowerCase()
                  });
                  setError('');
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-white/90 font-semibold">
                  Password
                </Label>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a strong password"
                  className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 pr-10 rounded-lg transition-all"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value
                    });
                    setError('');
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-4 space-y-2 border border-white/5">
                <RequirementItem met={pwdReqs.length} text="At least 8 characters" />
                <RequirementItem met={pwdReqs.upper} text="One uppercase letter" />
                <RequirementItem met={pwdReqs.lower} text="One lowercase letter" />
                <RequirementItem met={pwdReqs.number} text="One number" />
                <RequirementItem met={pwdReqs.special} text="One special character" />
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col space-y-5 p-0 pt-2">
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !isPasswordValid
              }
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] disabled:opacity-50 disabled:shadow-none text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium rounded-lg"
            >
              {isLoading && (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              )}
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>

            <div className="text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link
                to={"/a/login" + redirectQuery}
                className="font-semibold text-[#51b749] hover:text-[#38984c] hover:underline transition-colors"
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