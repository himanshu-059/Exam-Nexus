import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut, 
  GraduationCap,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Exams', path: '/exams' },
    { icon: FileText, label: 'Results', path: '/results' },
  ];

  if (currentUser?.isAdmin) {
    navItems.push({ icon: Settings, label: 'Admin Panel', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex font-serif">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#5A5A40]/10 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 border-bottom border-[#5A5A40]/10">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center shadow-md">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-light tracking-tight text-[#1a1a1a]">Exam Nexus</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300",
                  isActive 
                    ? "bg-[#5A5A40] text-white shadow-md translate-x-2" 
                    : "text-[#5A5A40]/70 hover:bg-[#f5f5f0] hover:text-[#5A5A40]"
                )
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-[#5A5A40]/10">
          <div className="bg-[#f5f5f0] p-4 rounded-2xl mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="text-[#5A5A40] w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-[#5A5A40]/60 uppercase tracking-wider truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 rounded-full transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8 sm:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
