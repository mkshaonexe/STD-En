
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Clock, BarChart3, Trophy, UserCircle, Settings, Menu, X, BookOpen, Users, CheckSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSelector } from '@/components/theme/ThemeSelector';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, isActive }: SidebarItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button 
        variant={isActive ? "default" : "ghost"} 
        className={`w-full justify-start gap-2 mb-1 ${isActive ? 'bg-study-primary text-white' : ''}`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const sidebarItems = [
    { icon: Clock, label: 'Timer', to: '/' },
    { icon: BarChart3, label: 'Dashboard', to: '/dashboard' },
    { icon: Trophy, label: 'Leaderboard', to: '/leaderboard' },
    { icon: Users, label: 'Groups', to: '/groups' },
    { icon: BookOpen, label: 'Resources', to: '/resources' },
    { icon: CheckSquare, label: 'Tasks', to: '/tasks' },
    { icon: UserCircle, label: 'Profile', to: '/profile' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {isSidebarOpen ? (
          <Sidebar className="border-r h-screen">
            <SidebarHeader className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-study-primary flex items-center justify-center">
                  <Clock className="text-white" size={18} />
                </div>
                <h1 className="text-xl font-bold">SDT-En</h1>
              </div>
              <div className="flex gap-1">
                <ThemeSelector />
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X size={20} />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  isActive={location.pathname === item.to}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="text-xs text-center text-gray-500">
                SDT-En Study App © 2025
              </div>
            </SidebarFooter>
          </Sidebar>
        ) : (
          <div className="p-4 fixed z-10">
            <Button onClick={toggleSidebar} variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
