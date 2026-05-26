import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type LinkDoc = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

// 로그인 기능 전까지는 모든 링크를 anonymous 사용자 아래에 저장
// 경로: users/anonymous/links/{linkId}  (11주차 이후 anonymous -> 실제 uid)
const linksCol = collection(db, "users", "anonymous", "links");

export async function fetchLinks(): Promise<LinkDoc[]> {
  const q = query(linksCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<LinkDoc, "id">;
    return { id: d.id, title: data.title, url: data.url, icon: data.icon };
  });
}

export async function addLink(data: {
  title: string;
  url: string;
  icon: string;
}) {
  await addDoc(linksCol, { ...data, createdAt: serverTimestamp() });
}
