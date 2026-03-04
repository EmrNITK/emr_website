import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const redirectUrl = searchParams.get('redirect') ? '?redirect=' + searchParams.get('redirect') : '';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(API_URL + '/auth/me', { withCredentials: true });
        if (res.data) {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else if (!res.data.role) {
            navigate('/role-selection');
          } else {
            navigate('/profile');
          }
        }
      } catch (error) {
      }
    };
    checkAuth();
  }, [navigate, searchParams, API_URL, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(API_URL + '/auth/login', formData, { withCredentials: true });

      localStorage.setItem('userId', res.data.user._id);

      if (redirectUrl) {
        window.location.href = searchParams.get('redirect');
      } else if (!res.data.user.role) {
        navigate('/a/role-selection');
      } else {
        navigate('/a/profile');
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <CardHeader className="space-y-3 text-center pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <span className="font-bold text-lg tracking-tight flex text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                  EM
                </span>
                R
              </span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {error && (
            <div className="w-full text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center mb-6 flex items-center justify-center gap-2">
              {error}
            </div>
          )}
          <CardContent className="space-y-5 p-0 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="College Email or Personal Email"
                className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                onChange={e => {
                  setFormData({ ...formData, email: e.target.value });
                  setError('');
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/90 font-semibold">Password</Label>
                <Link
                  to={"/a/forgot-password" + redirectUrl}
                  className="text-sm font-medium text-[#51b749] hover:text-[#38984c] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                onChange={e => {
                  setFormData({...formData, password: e.target.value}); 
                  setError('');
                }}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 p-0">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] disabled:opacity-50 disabled:shadow-none text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Link
                to={"/a/register" + redirectUrl}
                className="font-semibold text-[#51b749] hover:text-[#38984c] hover:underline transition-colors"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}