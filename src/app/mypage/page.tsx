"use client";

import { useState, useEffect, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { displayUrl } from "@/lib/utils";
import { fetchLinks, addLink, type LinkDoc } from "@/lib/links-db";
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
  const [items, setItems] = useState<LinkDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLinks()
      .then(setItems)
      .catch(() => setError("링크를 불러오지 못했어요"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const u = url.trim();

    if (!t) return setError("제목을 입력해주세요");
    if (!u) return setError("주소를 입력해주세요");
    if (!isValidUrl(u)) return setError("올바른 주소를 입력해주세요");

    try {
      setSaving(true);
      setError("");
      await addLink({ title: t, url: normalizeUrl(u), icon: "🔗" });
      setItems(await fetchLinks());
      setTitle("");
      setUrl("");
    } catch {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setSaving(false);
    }
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
            disabled={saving}
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
          >
            {saving ? "추가 중..." : "추가하기"}
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              아직 링크가 없어요. 위에서 추가해보세요!
            </p>
          ) : (
            items.map((link) => (
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
            ))
          )}
        </div>
      </main>
    </div>
  );
}
