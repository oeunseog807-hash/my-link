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
    <div className="flex min-h-screen items-center justify-center bg-[#E0E7FF] p-4">
      <main className="flex w-full flex-col items-center gap-6 rounded-xl border-[3px] border-black bg-[#FEF08A] p-4 shadow-[6px_6px_0_0_#000] md:w-4/5 md:max-w-[480px] md:p-8 lg:w-[400px]">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-black bg-white text-4xl font-extrabold text-black">
          {profile.initial}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-black">{profile.name}</h1>
          <p className="mt-2 text-sm font-medium text-black/70">{profile.bio}</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-full rounded-lg border-[3px] border-black bg-white py-3 text-center font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
