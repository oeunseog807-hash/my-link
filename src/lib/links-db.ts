import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
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
    const data = d.data() as Omit<LinkDoc, "id">;
    return { id: d.id, title: data.title, url: data.url, icon: data.icon };
  });
}

export async function addLink(
  uid: string,
  data: { title: string; url: string; icon: string },
) {
  await addDoc(linksCol(uid), { ...data, createdAt: serverTimestamp() });
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
