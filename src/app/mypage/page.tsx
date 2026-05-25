"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { links as initialLinks, type Link } from "@/data/links";
import { displayUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isValidUrl(value: string) {
  if (value.startsWith("mailto:")) {
    return /^\S+@\S+\.\S+$/.test(value.slice("mailto:".length));
  }
  try {
    const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

function normalizeUrl(value: string) {
  if (value.startsWith("mailto:") || /^https?:\/\//.test(value)) return value;
  return `https://${value}`;
}

export default function MyPage() {
  const [items, setItems] = useState<Link[]>(initialLinks);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const u = url.trim();

    if (!t) return setError("제목을 입력해주세요");
    if (!u) return setError("주소를 입력해주세요");
    if (!isValidUrl(u)) return setError("올바른 주소를 입력해주세요");

    setItems((prev) => [
      ...prev,
      { id: Date.now(), title: t, url: normalizeUrl(u), icon: "🔗" },
    ]);
    setTitle("");
    setUrl("");
    setError("");
  }

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-12">
      <main className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-2xl font-bold tracking-tight">내 링크 관리</h1>

        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <Input
            placeholder="제목 (예: 내 인스타그램)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="주소 (예: instagram.com/myname)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
          >
            추가하기
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          {items.map((link) => (
            <Button
              key={link.id}
              variant="outline"
              nativeButton={false}
              className="group h-auto w-full items-center justify-start gap-4 rounded-2xl border-border/60 bg-card px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:hover:border-violet-800"
              render={
                <a href={link.url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg transition-colors group-hover:bg-violet-500/10">
                {link.icon}
              </span>
              <span className="flex flex-1 flex-col items-start">
                <span className="font-semibold">{link.title}</span>
                <span className="text-xs text-muted-foreground">
                  {displayUrl(link.url)}
                </span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
