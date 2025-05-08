
import { toast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simple local storage based auth for demo purposes
// In a real app, you would use a proper authentication system
const LOCAL_STORAGE_KEY = 'arab-ai-learn-auth';
const USERS_STORAGE_KEY = 'arab-ai-learn-users';

export class AuthService {
  private static state: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private static listeners: Array<() => void> = [];

  static init() {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth) as AuthState;
        this.state = parsedAuth;
      }
    } catch (e) {
      console.error('Failed to load auth state from localStorage', e);
    }
  }

  static subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private static saveState() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    this.notifyListeners();
  }

  static getUser(): User | null {
    return this.state.user;
  }

  static isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  static async login(email: string, password: string): Promise<boolean> {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        this.state = {
          user: userWithoutPassword,
          isAuthenticated: true,
        };
        this.saveState();
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك ${user.name}`,
        });
        return true;
      }
      
      toast({
        title: "فشل تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
      return false;
    } catch (e) {
      console.error('Login error:', e);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
      return false;
    }
  }

  static async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        toast({
          title: "البريد الإلكتروني مستخدم",
          description: "هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };
      
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      this.state = {
        user: userWithoutPassword,
        isAuthenticated: true,
      };
      this.saveState();
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً بك ${name}`,
      });
      return true;
    } catch (e) {
      console.error('Registration error:', e);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
      return false;
    }
  }

  static logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
    };
    this.saveState();
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  }
}

// Initialize auth service
AuthService.init();
