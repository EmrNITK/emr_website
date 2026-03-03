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
      navigate('/a/profile');
    } catch (err) {
      setError('Failed to save details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100">
            {role} Details
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Complete your profile information
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
            
            {success && (
              <Alert className="bg-[#13703a]/20 border-[#51b749]/50 text-[#51b749]">
                <Check className="h-4 w-4 stroke-[#51b749]" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {(role === 'Student' || role === 'Alumni') && (
              <div className="space-y-3">
                <Label className="text-zinc-300">Select Institution</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCollegeChoice('nitkkr');
                      setFormData({...formData, collegeName: 'NIT Kurukshetra'});
                      setError('');
                    }}
                    className={`h-12 border rounded-md font-medium transition-colors ${collegeChoice === 'nitkkr' ? 'bg-[#51b749]/20 border-[#51b749] text-[#51b749]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
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
                    className={`h-12 border rounded-md font-medium transition-colors ${collegeChoice === 'other' ? 'bg-[#51b749]/20 border-[#51b749] text-[#51b749]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                  >
                    Other
                  </button>
                </div>
                
                {collegeChoice === 'other' && (
                  <Input 
                    type="text" 
                    placeholder="Enter College Name" 
                    value={formData.collegeName}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12 mt-3"
                    onChange={e => setFormData({...formData, collegeName: e.target.value})} 
                    required 
                  />
                )}
              </div>
            )}

            {role === 'Student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rollNo" className="text-zinc-300">Roll Number</Label>
                  <Input 
                    id="rollNo"
                    type="text" 
                    placeholder="e.g. 12015000" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setFormData({...formData, rollNo: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-4 pt-2 border-t border-zinc-800/50">
                  {!user?.collegeEmailVerified ? (
                    <div className="space-y-3">
                      <Label htmlFor="collegeEmail" className="text-zinc-300">College Email Verification</Label>
                      <Input 
                        id="collegeEmail"
                        type="email" 
                        placeholder={collegeChoice === 'nitkkr' ? "rollno@nitkkr.ac.in" : "name@college.ac.in or .edu.in"} 
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
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
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors h-12"
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
                            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12 text-center tracking-widest font-mono"
                            onChange={e => setCollegeOtp(e.target.value)} 
                          />
                          <Button 
                            type="button" 
                            onClick={handleVerifyCollegeOtp}
                            disabled={isLoading || collegeOtp.length < 6}
                            className="bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 px-6"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-[#13703a]/10 border border-[#51b749]/30 rounded-md">
                      <Check className="w-5 h-5 text-[#51b749]" />
                      <div className="text-sm">
                        <span className="text-zinc-400 block">Verified College Email</span>
                        <span className="text-zinc-200 font-medium">{user.collegeEmail}</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {role === 'Alumni' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear" className="text-zinc-300">Graduation Year</Label>
                  <Input 
                    id="graduationYear"
                    type="text" 
                    placeholder="e.g. 2024" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setFormData({...formData, graduationYear: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCompany" className="text-zinc-300">Current Company</Label>
                  <Input 
                    id="currentCompany"
                    type="text" 
                    placeholder="Where do you work?" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setFormData({...formData, currentCompany: e.target.value})} 
                    required 
                  />
                </div>
              </>
            )}

            {role === 'Other' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-zinc-300">Organization / Company</Label>
                  <Input 
                    id="organization"
                    type="text" 
                    placeholder="Enter organization name" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setFormData({...formData, organization: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-zinc-300">Profession</Label>
                  <Input 
                    id="profession"
                    type="text" 
                    placeholder="e.g. Software Engineer, Researcher" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#51b749] h-12"
                    onChange={e => setFormData({...formData, profession: e.target.value})} 
                    required 
                  />
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || (role === 'Student' && !user?.collegeEmailVerified) || ((role === 'Student' || role === 'Alumni') && !collegeChoice)}
              className="w-full bg-[#51b749] hover:bg-[#13703a] text-white transition-colors h-12 text-lg font-medium disabled:opacity-50 disabled:bg-[#51b749]"
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