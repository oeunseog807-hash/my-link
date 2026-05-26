import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const name = decodeURIComponent(username);
  return {
    title: name,
    description: `${name}님의 마이링크 페이지`,
    openGraph: {
      title: `마이링크 - ${name}`,
      description: `${name}님의 링크 모음`,
    },
  };
}

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
