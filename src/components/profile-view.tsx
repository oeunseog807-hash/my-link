"use client";

import Link from "next/link";
import { ArrowUpRight, Settings } from "lucide-react";

import { displayUrl } from "@/lib/utils";
import { incrementClick } from "@/lib/links-db";

type ViewLink = { id?: string; title: string; url: string; icon: string };

export function ProfileView({
  displayName,
  bio,
  initial,
  links,
  ownerUid,
  isOwner = false,
}: {
  displayName: string;
  bio: string;
  initial: string;
  links: ViewLink[];
  ownerUid?: string;
  isOwner?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden bg-background px-4 py-16">
      <div className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      {isOwner && (
        <Link
          href="/mypage"
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-violet-600"
        >
          <Settings className="size-3.5" />
          관리
        </Link>
      )}

      <main className="relative flex w-full max-w-md flex-col items-center gap-10">
        <div className="animate-fade-up flex flex-col items-center gap-4">
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#c4b5fd,#7c3aed,#c4b5fd)]" />
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-background text-3xl font-bold">
              {initial}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
            {bio && <p className="mt-1.5 text-sm text-muted-foreground">{bio}</p>}
          </div>
        </div>

        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>
        ) : (
          <div className="flex w-full flex-col gap-3">
            {links.map((link, i) => (
              <a
                key={link.id ?? i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (ownerUid && link.id) {
                    incrementClick(ownerUid, link.id).catch((e) =>
                      console.error("클릭 카운트 실패", e),
                    );
                  }
                }}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                className="group animate-fade-up flex w-full items-center justify-start gap-4 rounded-2xl border border-border/60 bg-card px-4 py-3.5 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:hover:border-violet-800"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg transition-colors group-hover:bg-violet-500/10">
                  {link.icon}
                </span>
                <span className="flex flex-1 flex-col items-start">
                  <span className="font-semibold">{link.title}</span>
                  <span className="text-xs text-muted-foreground">{displayUrl(link.url)}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
              </a>
            ))}
          </div>
        )}

        <p className="animate-fade-up text-xs text-muted-foreground" style={{ animationDelay: "0.6s" }}>
          made with 마이링크
        </p>
      </main>
    </div>
  );
}
