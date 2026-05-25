export type Link = {
  id: number;
  title: string;
  url: string;
  icon: string;
};

export const links: Link[] = [
  { id: 1, title: "인스타그램", url: "https://instagram.com/", icon: "📷" },
  { id: 2, title: "유튜브", url: "https://youtube.com/", icon: "📺" },
  { id: 3, title: "블로그", url: "https://blog.naver.com/", icon: "📝" },
  { id: 4, title: "깃허브", url: "https://github.com/oeunseog807-hash", icon: "🐙" },
  { id: 5, title: "문의하기", url: "mailto:oeunseog807@gmail.com", icon: "📮" },
];
