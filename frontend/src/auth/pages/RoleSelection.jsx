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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100">
            Select Your Role
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Choose how you want to use the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => selectRole(role.id)}
              className="w-full flex items-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-[#51b749] hover:bg-zinc-800/80 transition-all duration-200 group text-left"
            >
              <div className="p-3 rounded-full bg-zinc-950 group-hover:bg-[#51b749]/10 mr-4 transition-colors duration-200 shadow-sm border border-zinc-800 group-hover:border-[#51b749]/30">
                <role.icon className="w-6 h-6 text-zinc-400 group-hover:text-[#51b749] transition-colors duration-200" />
              </div>
              <div>
                <div className="font-semibold text-zinc-100 text-lg group-hover:text-white transition-colors">
                  {role.id}
                </div>
                <div className="text-sm text-zinc-500 mt-0.5">
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