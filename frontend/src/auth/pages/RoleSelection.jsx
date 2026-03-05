import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelection() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate('/a/details-form', { state: { role } });
  };

  const roles = [
    { 
      id: 'Student', 
      icon: GraduationCap, 
      description: 'Currently enrolled at the institute' 
    },
    { 
      id: 'Alumni', 
      icon: Briefcase, 
      description: 'Graduated from the institute' 
    },
    { 
      id: 'Other', 
      icon: User, 
      description: 'Faculty, staff, or guest' 
    }
  ];

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

      <Card className="w-full max-w-md p-3 bg-[#111111] border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 rounded-xl">
        <CardHeader className="space-y-3 text-center pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <span className="font-bold text-lg tracking-tight flex text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                  Em
                </span>
                R
              </span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Select Your Role
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Choose how you want to use the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-8 p-0">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => selectRole(role.id)}
              className="w-full flex items-center p-4 rounded-xl border border-white/5 bg-black hover:border-[#51b749]/50 hover:bg-white/5 transition-all duration-300 group text-left shadow-[0_4px_20px_transparent] hover:shadow-[0_0_15px_-3px_rgba(81,183,73,0.3)]"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#51b749]/20 mr-4 transition-colors duration-300 shadow-sm border border-white/5 group-hover:border-[#51b749]/50">
                <role.icon className="w-6 h-6 text-white/40 group-hover:text-[#51b749] transition-colors duration-300" />
              </div>
              <div>
                <div className="font-semibold text-white/90 text-lg group-hover:text-white transition-colors">
                  {role.id}
                </div>
                <div className="text-sm text-white/50 mt-0.5">
                  {role.description}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}