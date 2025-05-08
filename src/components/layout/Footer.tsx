
import { Link } from "react-router-dom";
import { Code, BookOpen, Home, Heart, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-sm">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-primary/20 w-8 h-8 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-lg">شبوة لتعلم البرمجة</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة يمنية تساعدك على تعلم البرمجة من خلال إنشاء مسار تعليمي مخصص لك باستخدام الذكاء الاصطناعي، وتوفير أفضل المصادر المجانية والمدفوعة باللغتين العربية والإنجليزية.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition flex items-center group">
                <Home className="h-4 w-4 ml-2 group-hover:text-primary transition-colors" />
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  الرئيسية
                </span>
              </Link>
              <Link to="/saved" className="text-sm text-muted-foreground hover:text-foreground transition flex items-center group">
                <BookOpen className="h-4 w-4 ml-2 group-hover:text-primary transition-colors" />
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  خطط التعلم المحفوظة
                </span>
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition flex items-center group">
                <Code className="h-4 w-4 ml-2 group-hover:text-primary transition-colors" />
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  تسجيل الدخول
                </span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">اتصل بنا</h3>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
              للاستفسارات والاقتراحات، يرجى التواصل معنا
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-primary" />
              <span dir="ltr">+79214490788</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تم تطوير الموقع بواسطة المهندس أسامة صالح السقمة
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} شبوة لتعلم البرمجة. جميع الحقوق محفوظة
          </p>
          <p className="text-sm flex items-center text-muted-foreground">
            <span>صُنع بكل</span> <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse" /> <span>من اليمن</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
