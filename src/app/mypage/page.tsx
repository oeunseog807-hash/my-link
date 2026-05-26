"use client";

import { useState, useEffect, type FormEvent } from "react";

import { displayUrl } from "@/lib/utils";
import {
  fetchLinks,
  addLink,
  updateLink,
  deleteLink,
  type LinkDoc,
} from "@/lib/links-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function LinkRow({
  link,
  onSaved,
  onAskDelete,
}: {
  link: LinkDoc;
  onSaved: () => void;
  onAskDelete: (link: LinkDoc) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setTitle(link.title);
    setUrl(link.url);
    setError("");
    setEditing(true);
  }

  async function save() {
    const t = title.trim();
    const u = url.trim();
    if (!t) return setError("제목을 입력해주세요");
    if (!u) return setError("주소를 입력해주세요");
    if (!isValidUrl(u)) return setError("올바른 주소를 입력해주세요");

    try {
      setSaving(true);
      setError("");
      await updateLink(link.id, { title: t, url: normalizeUrl(u) });
      setEditing(false);
      onSaved();
    } catch {
      setError("수정에 실패했어요");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-violet-300 bg-card p-4 shadow-sm">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="주소"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
            취소
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
        {link.icon}
      </span>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-1 flex-col items-start"
      >
        <span className="max-w-full truncate font-semibold">{link.title}</span>
        <span className="max-w-full truncate text-xs text-muted-foreground">
          {displayUrl(link.url)}
        </span>
      </a>
      <Button variant="ghost" size="icon" aria-label="수정" onClick={startEdit}>
        ✏️
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="삭제"
        onClick={() => onAskDelete(link)}
      >
        🗑️
      </Button>
    </div>
  );
}

export default function MyPage() {
  const [items, setItems] = useState<LinkDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LinkDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function reload() {
    setItems(await fetchLinks());
  }

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
      await reload();
      setTitle("");
      setUrl("");
    } catch {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteLink(deleteTarget.id);
      await reload();
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
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
              <LinkRow
                key={link.id}
                link={link}
                onSaved={reload}
                onAskDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </main>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; 링크가 삭제됩니다.
              <br />
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "삭제 중..." : "삭제하기"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
