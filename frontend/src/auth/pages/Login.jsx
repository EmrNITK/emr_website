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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(API_URL + '/auth/me');
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
    try {
      const res = await axios.post(API_URL + '/auth/login', formData);
      localStorage.setItem('userId', res.data.user._id);
      if (redirectUrl) {
        window.location.href = searchParams.get('redirect');
      } else if (!res.data.user.role) {
         navigate('/a/role-selection');
      } else {
         navigate('/a/profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="College Email or Personal Email"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Link
                  to={"/a/forgot-password" + redirectUrl}
                  className="text-sm font-medium text-[#51b749] hover:text-[#13703a] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pt-4">
            <Button
              type="submit"
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium"
            >
              Login
            </Button>
            <div className="text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to={"/a/register" + redirectUrl}
                className="font-semibold text-[#51b749] hover:text-[#13703a] hover:underline transition-colors"
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