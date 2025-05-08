
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AuthService, User } from "@/services/AuthService";
import { useNavigate } from "react-router-dom";
import { LogOut, BookUser, User as UserIcon } from "lucide-react";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(AuthService.getUser());
  const [isAuth, setIsAuth] = useState(AuthService.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = AuthService.subscribe(() => {
      setUser(AuthService.getUser());
      setIsAuth(AuthService.isAuthenticated());
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSavedPlans = () => {
    navigate("/saved");
  };

  if (!isAuth) {
    return (
      <Button 
        onClick={handleLogin} 
        variant="outline"
        className="border-white/20 hover:border-primary/50 hover:bg-primary/10 transition-all"
      >
        <UserIcon className="h-4 w-4 ml-2" />
        تسجيل الدخول
      </Button>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full hover:bg-primary/10">
          <Avatar className="border-2 border-primary/30">
            <AvatarFallback className="text-primary-foreground bg-gradient-to-br from-primary to-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10">
        <div className="px-3 py-2 text-sm font-medium text-right">
          <div className="font-bold">{user?.name}</div>
          <div className="text-muted-foreground text-xs mt-1">{user?.email}</div>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={handleSavedPlans} className="cursor-pointer text-right hover:bg-white/5 focus:bg-white/5">
          <BookUser className="h-4 w-4 ml-2" />
          خطط التعلم المحفوظة
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-right hover:bg-white/5 focus:bg-white/5 text-red-400 hover:text-red-300">
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
