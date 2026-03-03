import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, CheckCircle2, XCircle, AlertCircle, 
  Loader2, Pencil, X, ShieldCheck, Github, Linkedin, Instagram
} from 'lucide-react';
import Cropper from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const targetSize = 300;
  canvas.width = targetSize;
  canvas.height = targetSize;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, targetSize, targetSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], 'profile-pic.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const pwdReqs = {
    length: passwordData.newPassword.length >= 8,
    upper: /[A-Z]/.test(passwordData.newPassword),
    lower: /[a-z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
    special: /[^A-Za-z0-9]/.test(passwordData.newPassword)
  };
  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (!res.data.role) {
          navigate('/a/role-selection');
        } else {
          setUser(res.data);
          setEditData(res.data);
        }
      } catch (err) {
        navigate('/a/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, API_URL]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await axios.post(`${API_URL}/auth/update-profile`, {
        userId: user._id,
        ...editData
      }, { withCredentials: true });
      setUser(res.data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    if (!isPasswordValid) {
      setError('Please meet all new password requirements.');
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        userId: user._id,
        ...passwordData
      }, { withCredentials: true });
      
      setSuccess('Password updated securely.');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('userId');
      navigate('/a/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117]">
      <Loader2 className="animate-spin text-[#58a6ff] w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-[#c9d1d9] font-sans selection:bg-black">
      
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link to={'/p'}>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                  EM
                </span>
                R
                <span className="text-white/30 font-normal ml-1.5">/ NITKKR</span>
              </span>
            </Link>
          </div>
          <span className="text-sm font-semibold tracking-tight">Profile Settings</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout} 
          className="text-[#8b949e] hover:text-[#c9d1d9] bg-gray-500/40 hover:bg-[#30363d] transition-colors h-8 px-3 text-sm"
        >
          <LogOut className="w-4 h-4 sm:mr-2" /> <span className='sm:block hidden'>Sign out</span>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-10 sm:pt-10 pt-6 space-y-6">
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border border-[#30363d]">
            <AvatarImage src={user.profilePhoto} />
            <AvatarFallback className="bg-[#161b22] text-[#58a6ff] sm:text-2xl text-xl">{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="sm:text-2xl text-xl font-semibold text-[#c9d1d9]">{user.name}</h1>
            <p className="sm:text-xl text-sm text-[#8b949e] font-light">{user.email}</p>
          </div>
        </div>

        {error && (
          <Alert className="bg-[#ffebe9]/10 border-[#f85149]/40 text-[#ff7b72]">
            <AlertCircle className="h-4 w-4 stroke-[#ff7b72]" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-[#238636]/10 border-[#238636]/40 text-[#3fb950]">
            <CheckCircle2 className="h-4 w-4 stroke-[#3fb950]" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full justify-start border-b border-[#30363d] bg-transparent h-auto p-0 rounded-none mb-6 space-x-2 overflow-x-auto">
            <GithubTabTrigger value="overview">Overview</GithubTabTrigger>
            <GithubTabTrigger value="edit">Edit Profile</GithubTabTrigger>
            <GithubTabTrigger value="security">Security</GithubTabTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-[#0d1117] border-[#30363d] rounded-md overflow-hidden">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d]">
                <h3 className="text-sm font-semibold text-[#c9d1d9]">Public profile</h3>
              </div>
              <CardContent className="p-0">
                <InfoRow label="Name" value={user.name} />
                <InfoRow label="Role" value={<Badge className="bg-[#1f6feb]/10 text-[#58a6ff] hover:bg-[#1f6feb]/20 border border-[#1f6feb]/30 rounded-full px-2.5 py-0.5">{user.role}</Badge>} />
                <InfoRow label="Bio" value={user.bio || 'Add a bio'} />
                <InfoRow label="LinkedIn" value={user.linkedin ? <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1"><Linkedin className="w-3 h-3"/> {user.linkedin}</a> : null} />
                <InfoRow label="GitHub" value={user.github ? <a href={user.github} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1"><Github className="w-3 h-3"/> {user.github}</a> : null} />
                <InfoRow label="Instagram" value={user.instagram ? <a href={user.instagram} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1"><Instagram className="w-3 h-3"/> {user.instagram}</a> : null} isLast />
              </CardContent>
            </Card>

            <Card className="bg-[#0d1117] border-[#30363d] rounded-md overflow-hidden">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d]">
                <h3 className="text-sm font-semibold text-[#c9d1d9]">{user.role} Details</h3>
              </div>
              <CardContent className="p-0">
                <InfoRow label="Email" value={user.email} />
                {user.role === 'Student' && (
                  <>
                    <InfoRow label="College" value={user.collegeName} />
                    <InfoRow label="Roll No" value={user.rollNo} />
                    <InfoRow label="College Email" value={user.collegeEmail} isLast />
                  </>
                )}
                {user.role === 'Alumni' && (
                  <>
                    <InfoRow label="College" value={user.collegeName} />
                    <InfoRow label="Graduated" value={user.graduationYear} />
                    <InfoRow label="Company" value={user.currentCompany} isLast />
                  </>
                )}
                {user.role === 'Other' && (
                  <>
                    <InfoRow label="Organization" value={user.organization} />
                    <InfoRow label="Profession" value={user.profession} isLast />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="animate-in fade-in duration-300">
            <Card className="bg-[#0d1117] border-[#30363d] rounded-md">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d]">
                <h3 className="text-sm font-semibold text-[#c9d1d9]">Edit Profile</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleUpdate} className="space-y-6">
                  
                  <div className="flex flex-col items-start space-y-3 mb-6">
                    <Label className="text-[#c9d1d9] text-sm font-semibold">Profile picture</Label>
                    <ProfilePictureEditor 
                      value={editData.profilePhoto} 
                      userName={user.name}
                      onChange={(url) => setEditData({...editData, profilePhoto: url})} 
                      setError={setError}
                      API_URL={API_URL}
                    />
                  </div>

                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <Label className="text-[#c9d1d9] text-sm font-semibold">Name</Label>
                      <GithubInput 
                        value={editData.name || ''} 
                        onChange={e => setEditData({...editData, name: e.target.value})} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[#c9d1d9] text-sm font-semibold">Bio</Label>
                      <Textarea 
                        value={editData.bio || ''} 
                        onChange={e => setEditData({...editData, bio: e.target.value})} 
                        className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] focus-visible:ring-1 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] rounded-md resize-y min-h-[100px]"
                        placeholder="Tell us a little bit about yourself"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-[#30363d] pt-5 mt-2">
                      <div className="space-y-2">
                        <Label className="text-[#c9d1d9] text-sm font-semibold flex items-center gap-1"><Linkedin className="w-3.5 h-3.5"/> LinkedIn URL</Label>
                        <GithubInput 
                          value={editData.linkedin || ''} 
                          onChange={e => setEditData({...editData, linkedin: e.target.value})} 
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#c9d1d9] text-sm font-semibold flex items-center gap-1"><Github className="w-3.5 h-3.5"/> GitHub URL</Label>
                        <GithubInput 
                          value={editData.github || ''} 
                          onChange={e => setEditData({...editData, github: e.target.value})} 
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#c9d1d9] text-sm font-semibold flex items-center gap-1"><Instagram className="w-3.5 h-3.5"/> Instagram URL</Label>
                        <GithubInput 
                          value={editData.instagram || ''} 
                          onChange={e => setEditData({...editData, instagram: e.target.value})} 
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>

                    {user.role === 'Student' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-[#30363d] pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">College Name</Label>
                          <GithubInput value={editData.collegeName || ''} onChange={e => setEditData({...editData, collegeName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">Roll No</Label>
                          <GithubInput value={editData.rollNo || ''} onChange={e => setEditData({...editData, rollNo: e.target.value})} />
                        </div>
                      </div>
                    )}

                    {user.role === 'Alumni' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-[#30363d] pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">Graduation Year</Label>
                          <GithubInput value={editData.graduationYear || ''} onChange={e => setEditData({...editData, graduationYear: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">Current Company</Label>
                          <GithubInput value={editData.currentCompany || ''} onChange={e => setEditData({...editData, currentCompany: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">College Name</Label>
                          <GithubInput value={editData.collegeName || ''} onChange={e => setEditData({...editData, collegeName: e.target.value})} />
                        </div>
                      </div>
                    )}

                    {user.role === 'Other' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-[#30363d] pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">Organization</Label>
                          <GithubInput value={editData.organization || ''} onChange={e => setEditData({...editData, organization: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#c9d1d9] text-sm font-semibold">Profession</Label>
                          <GithubInput value={editData.profession || ''} onChange={e => setEditData({...editData, profession: e.target.value})} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="bg-[#238636] text-white hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] rounded-md px-4 font-medium">
                      Update profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-in fade-in duration-300">
            <Card className="bg-[#0d1117] border-[#30363d] rounded-md">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d]">
                <h3 className="text-sm font-semibold text-[#c9d1d9]">Change password</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[#c9d1d9] text-sm font-semibold">Old password</Label>
                    <GithubInput 
                      type="password" 
                      value={passwordData.currentPassword} 
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#c9d1d9] text-sm font-semibold">New password</Label>
                    <GithubInput 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-md space-y-2 text-sm">
                    <p className="font-semibold text-[#c9d1d9] mb-3">Make sure your password meets these requirements:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <RequirementItem met={pwdReqs.length} text="At least 8 characters" />
                      <RequirementItem met={pwdReqs.upper} text="One uppercase letter" />
                      <RequirementItem met={pwdReqs.lower} text="One lowercase letter" />
                      <RequirementItem met={pwdReqs.number} text="One number" />
                      <RequirementItem met={pwdReqs.special} text="One special character" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={!isPasswordValid || !passwordData.currentPassword} className="bg-[#238636] text-white hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] rounded-md px-4 font-medium disabled:opacity-50 disabled:bg-[#238636]">
                      Update password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ProfilePictureEditor({ value, userName, onChange, setError, API_URL }) {
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const fileInputRef = useRef(null);

  const onFileSelect = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if ((file.size / (1024 * 1024)) > 5) {
      setError(`Exceeds maximum size of 5MB`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setStatus('cropping');
    };
    e.target.value = null; 
  };

  const handleUpload = async () => {
    try {
      setStatus('uploading');
      setProgress(0);
      
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedFile);

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total))
      });

      onChange(res.data.url || croppedFile.name);
      setStatus('idle');
      setImageSrc(null);
    } catch (err) {
      setStatus('idle');
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20 border border-[#30363d] rounded-full">
        <AvatarImage src={value} />
        <AvatarFallback className="bg-[#161b22] text-[#58a6ff] text-2xl">{userName?.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#21262d] border-[#363b42] text-[#c9d1d9] hover:bg-[#30363d] hover:text-[#c9d1d9] h-8 px-3 text-xs rounded-md shadow-sm"
          >
            <Pencil className="w-3 h-3 mr-2" /> Edit
          </Button>
        </div>
        <p className="text-xs text-[#8b949e]">JPG, GIF or PNG. 5MB max.</p>
      </div>
      
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelect} />

      {status === 'cropping' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010409]/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0d1117] rounded-md w-full max-w-md overflow-hidden shadow-2xl flex flex-col border border-[#30363d]">
            <div className="p-3 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
              <h3 className="text-sm font-semibold text-[#c9d1d9]">Crop photo</h3>
              <button type="button" onClick={() => setStatus('idle')} className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><X className="w-4 h-4"/></button>
            </div>
            <div className="relative h-[300px] w-full bg-[#010409]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} 
                cropShape="round" 
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-3 flex justify-between items-center bg-[#161b22] border-t border-[#30363d]">
               <span className="text-xs text-[#8b949e]">Drag to pan, scroll to zoom</span>
               <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setStatus('idle')} className="text-[#c9d1d9] hover:bg-[#30363d] h-8 px-3 text-sm">Cancel</Button>
                  <Button type="button" onClick={handleUpload} className="bg-[#238636] text-white hover:bg-[#2ea043] h-8 px-3 text-sm border border-[rgba(240,246,252,0.1)]">Set new profile picture</Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010409]/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#161b22] rounded-md w-full max-w-xs p-6 shadow-2xl border border-[#30363d] space-y-4 text-center">
             <Loader2 className="w-8 h-8 animate-spin text-[#58a6ff] mx-auto" />
             <p className="text-[#c9d1d9] text-sm font-semibold">Uploading... {progress}%</p>
             <Progress value={progress} className="h-1.5 bg-[#0d1117]" />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, children, isLast }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center px-4 py-3 ${!isLast ? 'border-b border-[#30363d]' : ''} hover:bg-[#161b22] transition-colors`}>
      <div className="w-full sm:w-1/3 text-sm font-semibold text-[#c9d1d9] mb-1 sm:mb-0">
        {label}
      </div>
      <div className="w-full sm:w-2/3 text-[#8b949e] text-sm flex items-center">
        {children || value || <span className="italic">Not provided</span>}
      </div>
    </div>
  );
}

function GithubInput({ className, ...props }) {
  return (
    <Input 
      {...props} 
      className={cn(
        "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] rounded-md h-8 px-3 py-1 text-sm focus-visible:ring-1 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] transition-all",
        className
      )}
    />
  );
}

function GithubTabTrigger({ value, children }) {
  return (
    <TabsTrigger 
      value={value} 
      className="pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#f78166] data-[state=active]:bg-transparent data-[state=active]:text-[#c9d1d9] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-transparent hover:border-[#8b949e] font-semibold px-4 text-sm transition-all shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function RequirementItem({ met, text }) {
  return (
    <div className={`flex items-center gap-2 transition-colors ${met ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>
      {met ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span className="text-xs">{text}</span>
    </div>
  );
}