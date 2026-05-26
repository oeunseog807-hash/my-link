"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { findByUsername, type Profile } from "@/lib/profile-db";
import { fetchLinks, type LinkDoc } from "@/lib/links-db";
import { useAuth } from "@/lib/auth";
import { ProfileView } from "@/components/profile-view";

export default function UserPage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);
  const { user } = useAuth();

  const [status, setStatus] = useState<"loading" | "found" | "notfound">("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownerUid, setOwnerUid] = useState("");
  const [links, setLinks] = useState<LinkDoc[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const found = await findByUsername(username);
      if (!active) return;
      if (!found) {
        setStatus("notfound");
        return;
      }
      const lks = await fetchLinks(found.uid);
      if (!active) return;
      setProfile(found.profile);
      setOwnerUid(found.uid);
      setLinks(lks);
      setStatus("found");
    })().catch(() => active && setStatus("notfound"));
    return () => {
      active = false;
    };
  }, [username]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (status === "notfound" || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="text-xl font-bold">페이지를 찾을 수 없어요</h1>
        <p className="text-sm text-muted-foreground">
          &ldquo;{username}&rdquo; 사용자가 없어요.
        </p>
        <Link href="/" className="text-sm font-medium text-violet-600 hover:underline">
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <ProfileView
      displayName={profile.displayName || profile.username}
      bio={profile.bio}
      initial={(profile.displayName || profile.username).charAt(0)}
      links={links}
      ownerUid={ownerUid}
      isOwner={!!user && user.uid === ownerUid}
    />
  );
}
