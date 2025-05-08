
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/AuthService";

type AuthMode = 'login' | 'register';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.login(email, password);
      } else {
        await AuthService.register(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? 'قم بتسجيل الدخول للوصول إلى خطط التعلم المحفوظة' 
            : 'أنشئ حسابًا جديدًا لحفظ خطط التعلم الخاصة بك'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input 
                id="name" 
                placeholder="أدخل اسمك" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جاري التحميل...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="link" onClick={toggleMode} className="w-full">
          {mode === 'login' 
            ? 'ليس لديك حساب؟ إنشاء حساب جديد' 
            : 'لديك حساب بالفعل؟ تسجيل الدخول'}
        </Button>
      </CardFooter>
    </Card>
  );
}
