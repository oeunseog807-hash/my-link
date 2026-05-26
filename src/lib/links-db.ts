import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type LinkDoc = {
  id: string;
  title: string;
  url: string;
  icon: string;
  clickCount: number;
};

// 사용자별 링크 경로: users/{uid}/links/{linkId}
function linksCol(uid: string) {
  return collection(db, "users", uid, "links");
}

function linkDoc(uid: string, id: string) {
  return doc(db, "users", uid, "links", id);
}

export async function fetchLinks(uid: string): Promise<LinkDoc[]> {
  const q = query(linksCol(uid), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      url: data.url,
      icon: data.icon,
      clickCount: data.clickCount ?? 0,
    };
  });
}

export async function addLink(
  uid: string,
  data: { title: string; url: string; icon: string },
) {
  await addDoc(linksCol(uid), {
    ...data,
    clickCount: 0,
    createdAt: serverTimestamp(),
  });
}

// 방문자가 링크를 클릭하면 서버에서 원자적으로 +1 (동시 클릭에도 손실 없음)
export async function incrementClick(uid: string, linkId: string) {
  await updateDoc(linkDoc(uid, linkId), { clickCount: increment(1) });
}

export async function updateLink(
  uid: string,
  id: string,
  data: { title: string; url: string },
) {
  await updateDoc(linkDoc(uid, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteLink(uid: string, id: string) {
  await deleteDoc(linkDoc(uid, id));
}
