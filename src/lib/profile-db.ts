import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";

import { db } from "./firebase";

export type Profile = {
  username: string; // 공개 URL 슬러그 (고유)
  displayName: string; // 화면에 표시될 이름
  bio: string;
  photoURL: string;
};

// username을 URL-friendly하게 정리 (소문자, 영숫자/-/_ 만)
export function sanitizeUsername(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
}

export async function isUsernameTaken(username: string, exceptUid: string) {
  const snap = await getDocs(
    query(collection(db, "users"), where("username", "==", username)),
  );
  return snap.docs.some((d) => d.id !== exceptUid);
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  if (!d.username) return null;
  return {
    username: d.username,
    displayName: d.displayName ?? "",
    bio: d.bio ?? "",
    photoURL: d.photoURL ?? "",
  };
}

// 로그인 시 프로필이 없으면 기본값으로 생성 (username=이메일 앞부분, 이름=구글 이름)
export async function ensureProfile(user: User): Promise<Profile> {
  const existing = await getProfile(user.uid);
  if (existing) return existing;

  const base = sanitizeUsername(user.email?.split("@")[0] ?? "") || "user";
  let username = base;
  let n = 0;
  while (await isUsernameTaken(username, user.uid)) {
    n += 1;
    username = `${base}${n}`;
  }

  const profile: Profile = {
    username,
    displayName: user.displayName ?? base,
    bio: "",
    photoURL: user.photoURL ?? "",
  };
  await setDoc(
    doc(db, "users", user.uid),
    { ...profile, createdAt: serverTimestamp() },
    { merge: true },
  );
  return profile;
}

export async function updateProfile(
  uid: string,
  data: { username: string; displayName: string; bio: string },
) {
  const username = sanitizeUsername(data.username);
  if (!username) throw new Error("INVALID_USERNAME");
  if (await isUsernameTaken(username, uid)) throw new Error("USERNAME_TAKEN");

  await updateDoc(doc(db, "users", uid), {
    username,
    displayName: data.displayName.trim(),
    bio: data.bio.trim(),
    updatedAt: serverTimestamp(),
  });
  return username;
}

export async function findByUsername(
  username: string,
): Promise<{ uid: string; profile: Profile } | null> {
  const snap = await getDocs(
    query(collection(db, "users"), where("username", "==", username)),
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    uid: d.id,
    profile: {
      username: data.username,
      displayName: data.displayName ?? "",
      bio: data.bio ?? "",
      photoURL: data.photoURL ?? "",
    },
  };
}
