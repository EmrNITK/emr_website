import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DetailsForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || 'Other';
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ collegeName: '', collegeEmail: '', rollNo: '', graduationYear: '', currentCompany: '', organization: '', profession: '' });
  const [collegeChoice, setCollegeChoice] = useState('');
  const [collegeOtp, setCollegeOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_URL + '/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        if (res.data.collegeEmailVerified) {
          setFormData(prev => ({ ...prev, collegeEmail: res.data.collegeEmail }));
        }
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUser();
  }, [API_URL]);

  const handleSendCollegeOtp = async () => {
    setError('');
    setSuccess('');
    
    if (collegeChoice === 'nitkkr' && !formData.collegeEmail?.endsWith('@nitkkr.ac.in')) {
      setError('Please use a valid @nitkkr.ac.in email address');
      return;
    }

    if (!formData.collegeEmail) {
      setError('Please enter your college email');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(API_URL + '/auth/send-college-otp', {
        userId: user._id,
        collegeEmail: formData.collegeEmail
      });
      setShowOtpInput(true);
      setSuccess('OTP sent successfully to your college email');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCollegeOtp = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const res = await axios.post(API_URL + '/auth/verify-college-otp', {
        userId: user._id,
        otp: collegeOtp
      });
      setUser(res.data.user);
      setShowOtpInput(false);
      setSuccess('College email verified successfully');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (role === 'Student' && !user?.collegeEmailVerified) {
      setError('Please verify your college email first');
      return;
    }

    if (!formData.collegeName && role !== 'Other') {
      setError('Please select or enter your college name');
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(API_URL + '/auth/update-profile', {
        userId: user?._id,
        role,
        ...formData
      });
      window.location.href = ('/a/profile');
    } catch (err) {
      setError('Failed to save details');
    } finally {
      setIsLoading(false);
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

      <Card className="w-full max-w-md bg-[#111111] border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 rounded-xl my-8">
        <CardHeader className="space-y-3 text-center pb-6 pt-8">
          <div className="flex justify-center mb-2">
            <span className="font-bold text-lg tracking-tight flex text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                  Em
                </span>
                R
              </span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            {role} Details
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Complete your profile information
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

            {(role === 'Student' || role === 'Alumni') && (
              <div className="space-y-3">
                <Label className="text-white/90 font-semibold">Select Institution</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCollegeChoice('nitkkr');
                      setFormData({...formData, collegeName: 'NIT Kurukshetra'});
                      setError('');
                    }}
                    className={`h-12 border rounded-lg font-medium transition-all duration-300 ${collegeChoice === 'nitkkr' ? 'bg-[#51b749]/20 border-[#51b749]/50 text-[#51b749] shadow-[0_0_15px_-3px_rgba(81,183,73,0.2)]' : 'bg-black border-white/10 text-white/50 hover:border-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                    NIT Kurukshetra
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCollegeChoice('other');
                      setFormData({...formData, collegeName: ''});
                      setError('');
                    }}
                    className={`h-12 border rounded-lg font-medium transition-all duration-300 ${collegeChoice === 'other' ? 'bg-[#51b749]/20 border-[#51b749]/50 text-[#51b749] shadow-[0_0_15px_-3px_rgba(81,183,73,0.2)]' : 'bg-black border-white/10 text-white/50 hover:border-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                    Other
                  </button>
                </div>
                
                {collegeChoice === 'other' && (
                  <Input 
                    type="text" 
                    placeholder="Enter College Name" 
                    value={formData.collegeName}
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 mt-3 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, collegeName: e.target.value})} 
                    required 
                  />
                )}
              </div>
            )}

            {role === 'Student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rollNo" className="text-white/90 font-semibold">Roll Number</Label>
                  <Input 
                    id="rollNo"
                    type="text" 
                    placeholder="e.g. 12015000" 
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, rollNo: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/5 mt-4">
                  {!user?.collegeEmailVerified ? (
                    <div className="space-y-3">
                      <Label htmlFor="collegeEmail" className="text-white/90 font-semibold">College Email Verification</Label>
                      <Input 
                        id="collegeEmail"
                        type="email" 
                        placeholder={collegeChoice === 'nitkkr' ? "rollno@nitkkr.ac.in" : "name@college.ac.in or .edu.in"} 
                        className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                        onChange={e => {
                          setFormData({...formData, collegeEmail: e.target.value});
                          setError('');
                        }} 
                        disabled={showOtpInput}
                        required 
                      />
                      
                      {!showOtpInput ? (
                        <Button 
                          type="button" 
                          onClick={handleSendCollegeOtp}
                          disabled={isLoading || !formData.collegeEmail || !collegeChoice}
                          className="w-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 h-12 rounded-lg disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Send Verification OTP
                        </Button>
                      ) : (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                          <Input 
                            type="text" 
                            placeholder="6-digit OTP" 
                            maxLength={6}
                            className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 text-center tracking-[0.3em] font-mono rounded-lg flex-1"
                            onChange={e => setCollegeOtp(e.target.value)} 
                          />
                          <Button 
                            type="button" 
                            onClick={handleVerifyCollegeOtp}
                            disabled={isLoading || collegeOtp.length < 6}
                            className="bg-[#51b749]/80 hover:bg-[#38984c] text-white transition-all active:scale-95 border-none h-12 px-6 rounded-lg disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-[#13703a]/10 border border-[#51b749]/30 rounded-lg">
                      <div className="bg-[#51b749]/20 p-2 rounded-full">
                        <Check className="w-4 h-4 text-[#51b749]" />
                      </div>
                      <div className="text-sm">
                        <span className="text-white/50 block font-medium">Verified College Email</span>
                        <span className="text-white/90 font-medium tracking-wide">{user.collegeEmail}</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {role === 'Alumni' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear" className="text-white/90 font-semibold">Graduation Year</Label>
                  <Input 
                    id="graduationYear"
                    type="text" 
                    placeholder="e.g. 2024" 
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, graduationYear: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCompany" className="text-white/90 font-semibold">Current Company</Label>
                  <Input 
                    id="currentCompany"
                    type="text" 
                    placeholder="Where do you work?" 
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, currentCompany: e.target.value})} 
                    required 
                  />
                </div>
              </>
            )}

            {role === 'Other' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-white/90 font-semibold">Organization / Company</Label>
                  <Input 
                    id="organization"
                    type="text" 
                    placeholder="Enter organization name" 
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, organization: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-white/90 font-semibold">Profession</Label>
                  <Input 
                    id="profession"
                    type="text" 
                    placeholder="e.g. Software Engineer, Researcher" 
                    className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] h-12 rounded-lg transition-all"
                    onChange={e => setFormData({...formData, profession: e.target.value})} 
                    required 
                  />
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="p-0 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || (role === 'Student' && !user?.collegeEmailVerified) || ((role === 'Student' || role === 'Alumni') && !collegeChoice)}
              className="w-full bg-[#51b749]/80 hover:bg-[#38984c] text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 border-none h-12 text-lg font-medium disabled:opacity-50 disabled:shadow-none rounded-lg"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Saving...' : 'Save Details'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}