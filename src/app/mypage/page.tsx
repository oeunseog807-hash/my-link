"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { displayUrl } from "@/lib/utils";
import { useAuth, signInWithGoogle, logout } from "@/lib/auth";
import {
  fetchLinks,
  addLink,
  updateLink,
  deleteLink,
  type LinkDoc,
} from "@/lib/links-db";
import {
  ensureProfile,
  updateProfile,
  type Profile,
} from "@/lib/profile-db";
import type { User } from "firebase/auth";
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
  uid,
  link,
  onSaved,
  onAskDelete,
}: {
  uid: string;
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
      await updateLink(uid, link.id, { title: t, url: normalizeUrl(u) });
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
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="주소" />
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
      <span className="shrink-0 text-xs text-muted-foreground" title="클릭수">
        👆 {link.clickCount}
      </span>
      <Button variant="ghost" size="icon" aria-label="수정" onClick={startEdit}>
        ✏️
      </Button>
      <Button variant="ghost" size="icon" aria-label="삭제" onClick={() => onAskDelete(link)}>
        🗑️
      </Button>
    </div>
  );
}

function ProfileEditor({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ensureProfile(user).then(setProfile);
  }, [user]);

  function startEdit() {
    if (!profile) return;
    setUsername(profile.username);
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setError("");
    setEditing(true);
  }

  async function save() {
    if (!displayName.trim()) return setError("이름을 입력해주세요");
    try {
      setSaving(true);
      setError("");
      const savedUsername = await updateProfile(user.uid, {
        username,
        displayName,
        bio,
      });
      setProfile({
        username: savedUsername,
        displayName: displayName.trim(),
        bio: bio.trim(),
        photoURL: profile?.photoURL ?? "",
      });
      setEditing(false);
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "USERNAME_TAKEN") setError("이미 사용 중인 주소예요");
      else if (code === "INVALID_USERNAME")
        setError("주소는 영문/숫자/-/_ 만 가능해요");
      else setError("저장에 실패했어요");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <p className="text-center text-sm text-muted-foreground">프로필 불러오는 중...</p>
    );
  }

  // 읽기 모드 — 수정 버튼을 눌러야 편집 화면으로
  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold">{profile.displayName}</p>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-violet-600 hover:underline"
          >
            /{profile.username}
          </a>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.bio || "소개글이 없어요"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={startEdit}>
          수정
        </Button>
      </div>
    );
  }

  // 편집 모드 — 라이브 입력창 + 저장/취소
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-violet-300 bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold">프로필 수정</p>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">표시 이름</label>
        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">공개 주소 (username)</label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className="text-xs text-muted-foreground">공개 URL: /{username || "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">소개글</label>
        <Input value={bio} maxLength={150} onChange={(e) => setBio(e.target.value)} />
      </div>
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

function Stats({ items }: { items: LinkDoc[] }) {
  const total = items.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);
  const sorted = [...items].sort((a, b) => b.clickCount - a.clickCount);
  const max = Math.max(1, ...items.map((l) => l.clickCount));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold">통계</p>
      <div>
        <p className="text-3xl font-bold text-violet-600">{total}</p>
        <p className="text-xs text-muted-foreground">총 클릭수</p>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map((link) => (
          <div key={link.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{link.icon}</span>
                <span className="font-medium">{link.title}</span>
              </span>
              <span className="text-muted-foreground">{link.clickCount} 클릭</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${(link.clickCount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<LinkDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LinkDoc | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [username, setUsername] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin() {
    try {
      setLoginError("");
      await signInWithGoogle();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("로그인 실패:", e);
      setLoginError(msg);
    }
  }

  async function reload(uid: string) {
    setItems(await fetchLinks(uid));
  }

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUsername("");
      return;
    }
    setLoading(true);
    fetchLinks(user.uid)
      .then(setItems)
      .catch(() => setError("링크를 불러오지 못했어요"))
      .finally(() => setLoading(false));
    ensureProfile(user).then((p) => setUsername(p.username));
  }, [user]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    const t = title.trim();
    const u = url.trim();

    if (!t) return setError("제목을 입력해주세요");
    if (!u) return setError("주소를 입력해주세요");
    if (!isValidUrl(u)) return setError("올바른 주소를 입력해주세요");

    try {
      setSaving(true);
      setError("");
      await addLink(user.uid, { title: t, url: normalizeUrl(u), icon: "🔗" });
      await reload(user.uid);
      setTitle("");
      setUrl("");
    } catch {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !user) return;
    try {
      setDeleting(true);
      await deleteLink(user.uid, deleteTarget.id);
      await reload(user.uid);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-12">
      <main className="flex w-full max-w-md flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">내 링크 관리</h1>
          {!authLoading &&
            (user ? (
              <div className="flex items-center gap-2">
                {username && (
                  <Link
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
                  >
                    <ExternalLink className="size-3.5" />
                    공개 페이지
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleLogin}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                Google로 로그인
              </Button>
            ))}
        </header>

        {authLoading ? (
          <p className="text-center text-sm text-muted-foreground">확인 중...</p>
        ) : !user ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              로그인하면 나만의 링크를 추가하고 관리할 수 있어요.
            </p>
            <Button
              onClick={handleLogin}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              Google로 로그인
            </Button>
            {loginError && (
              <p className="max-w-full break-words text-xs text-destructive">
                {loginError}
              </p>
            )}
          </div>
        ) : (
          <>
            <ProfileEditor user={user} />

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
                    uid={user.uid}
                    link={link}
                    onSaved={() => reload(user.uid)}
                    onAskDelete={setDeleteTarget}
                  />
                ))
              )}
            </div>

            {!loading && items.length > 0 && <Stats items={items} />}
          </>
        )}
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
