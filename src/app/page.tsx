import { ArrowUpRight } from "lucide-react";

import { links } from "@/data/links";
import { Button } from "@/components/ui/button";

const profile = {
  name: "은석",
  bio: "안녕하세요! 제 링크들을 모아둔 마이링크 페이지입니다.",
  initial: "은",
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden bg-background px-4 py-16">
      <div className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <main className="relative flex w-full max-w-md flex-col items-center gap-10">
        <div className="animate-fade-up flex flex-col items-center gap-4">
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#c4b5fd,#7c3aed,#c4b5fd)]" />
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-background text-3xl font-bold">
              {profile.initial}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {links.map((link, i) => (
            <Button
              key={link.id}
              variant="outline"
              nativeButton={false}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              className="group animate-fade-up h-auto w-full items-center justify-start gap-4 rounded-2xl border-border/60 bg-card px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:hover:border-violet-800"
              render={
                <a href={link.url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg transition-colors group-hover:bg-violet-500/10">
                {link.icon}
              </span>
              <span className="flex flex-1 flex-col items-start">
                <span className="font-semibold">{link.title}</span>
                <span className="text-xs text-muted-foreground">{link.url}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
            </Button>
          ))}
        </div>

        <p
          className="animate-fade-up text-xs text-muted-foreground"
          style={{ animationDelay: "0.6s" }}
        >
          made with 마이링크
        </p>
      </main>
    </div>
  );
}
