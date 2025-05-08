import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          أسامة AI
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          منصة تعليمية متكاملة للذكاء الاصطناعي. تعلم، اكتشف، وابدأ رحلتك في عالم الذكاء الاصطناعي.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/tools">
          <Button variant="default" size="lg">
            استكشف أدوات الذكاء الاصطناعي
          </Button>
        </Link>
        <Link href="/learning">
          <Button variant="outline" size="lg">
            ابدأ رحلة التعلم
          </Button>
        </Link>
      </div>
    </div>
  );
}
