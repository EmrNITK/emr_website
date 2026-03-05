import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LogOut, CheckCircle2, XCircle, AlertCircle,
  Loader2, Pencil, X, ShieldCheck, Github, Linkedin, Instagram
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../context/AuthContext';

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
import Header from '@/components/Header';

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
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const { user, isLoading, setUser, logout } = useAuth();
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
        }
      } catch (err) {
        navigate('/a/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, API_URL, user]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/a/login');
      } else {
        setEditData(user);
      }
    }
  }, [user, isLoading, navigate]);

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

  if (loading || isLoading || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Loader2 className="animate-spin text-[#51b749] w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] pt-16">

      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-10 sm:pt-10 pt-6 space-y-6">

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border border-[#51b749]/30 shadow-[0_0_15px_-3px_rgba(81,183,73,0.3)]">
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className="bg-[#111111] text-[#51b749] sm:text-2xl text-xl font-bold">{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="sm:text-2xl text-xl font-bold text-white tracking-tight">{user.name}</h1>
            <p className="sm:text-xl text-sm text-white/60 font-light">{user.email}</p>
          </div>
        </div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
            <AlertCircle className="h-4 w-4 stroke-red-400" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]">
            <CheckCircle2 className="h-4 w-4 stroke-[#51b749]" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full justify-start border-b border-white/10 bg-transparent h-auto p-0 rounded-none mb-6 space-x-2 overflow-x-auto">
            <EMRTabTrigger value="overview">Overview</EMRTabTrigger>
            <EMRTabTrigger value="edit">Edit Profile</EMRTabTrigger>
            <EMRTabTrigger value="security">Security</EMRTabTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-[#111111] border-white/5 hover:border-[#51b749]/30 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">Public profile</h3>
              </div>
              <CardContent className="p-0">
                <InfoRow label="Name" value={user.name} />
                <InfoRow label="Role" value={<Badge className="bg-[#13703a]/20 text-[#51b749] border border-[#51b749]/30 rounded-full px-2.5 py-0.5">{user.role}</Badge>} />
                <InfoRow label="Bio" value={user.bio || 'Add a bio'} />
                <InfoRow label="LinkedIn" value={user.linkedin ? <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-[#51b749] hover:text-[#38984c] flex items-center gap-1"><Linkedin className="w-3 h-3" /> {user.linkedin}</a> : null} />
                <InfoRow label="GitHub" value={user.github ? <a href={user.github} target="_blank" rel="noreferrer" className="text-[#51b749] hover:text-[#38984c] flex items-center gap-1"><Github className="w-3 h-3" /> {user.github}</a> : null} />
                <InfoRow label="Instagram" value={user.instagram ? <a href={user.instagram} target="_blank" rel="noreferrer" className="text-[#51b749] hover:text-[#38984c] flex items-center gap-1"><Instagram className="w-3 h-3" /> {user.instagram}</a> : null} isLast />
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-white/5 hover:border-[#51b749]/30 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">{user.role} Details</h3>
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
            <Card className="bg-[#111111] border-red-500/20 hover:border-red-500/40 transition-all duration-300 rounded-xl">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">Session</h3>
              </div>

              <CardContent className="p-6 sm:flex justify-between items-center">
                <p className="text-sm text-white/60">
                  Sign out of your account on this device.
                </p>

                <Button
                  onClick={logout}
                  className="bg-red-500/80 hover:bg-red-600 text-white rounded-lg px-5 py-2 text-sm flex items-center gap-2 sm:mt-0 mt-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="animate-in fade-in duration-300">
            <Card className="bg-[#111111] border-white/5 hover:border-[#51b749]/30 transition-all duration-300 rounded-xl">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">Edit Profile</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleUpdate} className="space-y-6">

                  <div className="flex flex-col items-start space-y-3 mb-6">
                    <Label className="text-white/90 text-sm font-semibold">Profile picture</Label>
                    <ProfilePictureEditor
                      value={editData?.profilePhoto}
                      userName={user.name}
                      onChange={(url) => setEditData({ ...editData, profilePhoto: url })}
                      setError={setError}
                      API_URL={API_URL}
                    />
                  </div>

                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <Label className="text-white/90 text-sm font-semibold">Name</Label>
                      <EMRInput
                        value={editData?.name || ''}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90 text-sm font-semibold">Bio</Label>
                      <Textarea
                        value={editData?.bio || ''}
                        onChange={e => setEditData({ ...editData, bio: e.target.value })}
                        className="bg-black border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] rounded-lg resize-y min-h-[100px] transition-all"
                        placeholder="Tell us a little bit about yourself"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-white/5 pt-5 mt-2">
                      <div className="space-y-2">
                        <Label className="text-white/90 text-sm font-semibold flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-[#51b749]" /> LinkedIn URL</Label>
                        <EMRInput
                          value={editData?.linkedin || ''}
                          onChange={e => setEditData({ ...editData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90 text-sm font-semibold flex items-center gap-1"><Github className="w-3.5 h-3.5 text-[#51b749]" /> GitHub URL</Label>
                        <EMRInput
                          value={editData?.github || ''}
                          onChange={e => setEditData({ ...editData, github: e.target.value })}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90 text-sm font-semibold flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-[#51b749]" /> Instagram URL</Label>
                        <EMRInput
                          value={editData?.instagram || ''}
                          onChange={e => setEditData({ ...editData, instagram: e.target.value })}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>

                    {user.role === 'Student' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">College Name</Label>
                          <EMRInput value={editData?.collegeName || ''} onChange={e => setEditData({ ...editData, collegeName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">Roll No</Label>
                          <EMRInput value={editData?.rollNo || ''} onChange={e => setEditData({ ...editData, rollNo: e.target.value })} />
                        </div>
                      </div>
                    )}

                    {user.role === 'Alumni' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">Graduation Year</Label>
                          <EMRInput value={editData?.graduationYear || ''} onChange={e => setEditData({ ...editData, graduationYear: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">Current Company</Label>
                          <EMRInput value={editData?.currentCompany || ''} onChange={e => setEditData({ ...editData, currentCompany: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-white/90 text-sm font-semibold">College Name</Label>
                          <EMRInput value={editData?.collegeName || ''} onChange={e => setEditData({ ...editData, collegeName: e.target.value })} />
                        </div>
                      </div>
                    )}

                    {user.role === 'Other' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-5 mt-2">
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">Organization</Label>
                          <EMRInput value={editData?.organization || ''} onChange={e => setEditData({ ...editData, organization: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/90 text-sm font-semibold">Profession</Label>
                          <EMRInput value={editData?.profession || ''} onChange={e => setEditData({ ...editData, profession: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-[#51b749]/80 hover:bg-[#38984c] text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] rounded-lg px-6 py-2.5 font-medium transition-all active:scale-95 border-none">
                      Update profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-in fade-in duration-300">
            <Card className="bg-[#111111] border-red-500/20 hover:border-red-500/40 transition-all duration-300 rounded-xl">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">Account Session</h3>
              </div>

              <CardContent className="sm:flex p-6 justify-between items-center">
                <div className="w-full text-sm text-white/60">
                  Logout from your account securely.
                </div>

                <Button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-600 text-white rounded-lg px-5 py-2 text-sm flex items-center gap-2 sm:mt-0 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-[#111111] border-white/5 hover:border-[#51b749]/30 transition-all duration-300 rounded-xl mt-6">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">Change password</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm font-semibold">Old password</Label>
                    <EMRInput
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm font-semibold">New password</Label>
                    <EMRInput
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-lg space-y-2 text-sm">
                    <p className="font-semibold text-white/90 mb-3">Make sure your password meets these requirements:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <RequirementItem met={pwdReqs.length} text="At least 8 characters" />
                      <RequirementItem met={pwdReqs.upper} text="One uppercase letter" />
                      <RequirementItem met={pwdReqs.lower} text="One lowercase letter" />
                      <RequirementItem met={pwdReqs.number} text="One number" />
                      <RequirementItem met={pwdReqs.special} text="One special character" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={!isPasswordValid || !passwordData.currentPassword} className="bg-[#51b749]/80 hover:bg-[#38984c] text-white shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] rounded-lg px-6 py-2.5 font-medium transition-all active:scale-95 border-none disabled:opacity-50 disabled:shadow-none">
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
      <Avatar className="w-20 h-20 border border-[#51b749]/40 rounded-full shadow-[0_0_15px_-3px_rgba(81,183,73,0.3)]">
        <AvatarImage src={value} />
        <AvatarFallback className="bg-[#111111] text-[#51b749] text-2xl font-bold">{userName?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/5 border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 h-8 px-4 text-xs rounded-lg shadow-sm transition-all"
          >
            <Pencil className="w-3 h-3 mr-2" /> Edit
          </Button>
        </div>
        <p className="text-xs text-white/50">JPG, GIF or PNG. 5MB max.</p>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelect} />

      {status === 'cropping' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111111] rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-sm font-semibold text-white">Crop photo</h3>
              <button type="button" onClick={() => setStatus('idle')} className="text-white/50 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative h-[300px] w-full bg-black">
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
            <div className="p-4 flex justify-between items-center bg-white/5 border-t border-white/10">
              <span className="text-xs text-white/50">Drag to pan, scroll to zoom</span>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStatus('idle')} className="text-white hover:bg-white/10 h-8 px-4 text-sm rounded-lg border border-transparent">Cancel</Button>
                <Button type="button" onClick={handleUpload} className="bg-[#51b749]/80 text-white hover:bg-[#38984c] h-8 px-4 text-sm border-none shadow-[0_0_15px_-3px_rgba(81,183,73,0.5)] rounded-lg">Set new profile picture</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111111] rounded-xl w-full max-w-xs p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#51b749]/30 space-y-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#51b749] mx-auto" />
            <p className="text-white text-sm font-semibold">Uploading... {progress}%</p>
            <Progress value={progress} className="h-1.5 bg-black" indicatorColor="bg-[#51b749]" />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, children, isLast }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center px-4 py-3 ${!isLast ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
      <div className="w-full sm:w-1/3 text-sm font-semibold text-white/80 mb-1 sm:mb-0">
        {label}
      </div>
      <div className="w-full sm:w-2/3 text-white/60 text-sm flex items-center">
        {children || value || <span className="italic">Not provided</span>}
      </div>
    </div>
  );
}

function EMRInput({ className, ...props }) {
  return (
    <Input
      {...props}
      className={cn(
        "bg-black border-white/10 text-white rounded-lg h-9 px-3 py-1 text-sm focus-visible:ring-1 focus-visible:ring-[#51b749] focus-visible:border-[#51b749] transition-all",
        className
      )}
    />
  );
}

function EMRTabTrigger({ value, children }) {
  return (
    <TabsTrigger
      value={value}
      className="pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#51b749] data-[state=active]:bg-transparent data-[state=active]:text-[#51b749] text-white/50 hover:text-white hover:bg-transparent hover:border-white/30 font-semibold px-4 text-sm transition-all shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function RequirementItem({ met, text }) {
  return (
    <div className={`flex items-center gap-2 transition-colors ${met ? 'text-[#51b749]' : 'text-white/40'}`}>
      {met ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span className="text-xs">{text}</span>
    </div>
  );
}