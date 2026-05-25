const profile = {
  name: "은석",
  bio: "안녕하세요! 제 링크들을 모아둔 마이링크 페이지입니다.",
  initial: "은",
};

const links = [
  { label: "Instagram", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Portfolio", href: "#" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-400 to-indigo-500 px-4 py-16">
      <main className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-4xl font-bold text-indigo-500 shadow-lg">
          {profile.initial}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
          <p className="mt-2 text-sm text-white/80">{profile.bio}</p>
        </div>

        <div className="mt-4 flex w-full flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-full rounded-xl bg-white py-4 text-center font-semibold text-gray-800 shadow-md transition hover:scale-105 hover:bg-gray-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
