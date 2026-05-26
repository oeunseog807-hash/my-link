import Link from "next/link";
import { Link2, BarChart3, Globe, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "링크 관리",
    desc: "여러 링크를 한 곳에 모아 추가·수정·삭제할 수 있어요.",
  },
  {
    icon: BarChart3,
    title: "클릭 통계",
    desc: "어떤 링크가 인기 있는지 클릭 수로 확인해요.",
  },
  {
    icon: Globe,
    title: "개인 URL",
    desc: "나만의 주소(/username)로 어디서든 공유해요.",
  },
];

export default function Landing() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      <div className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />

      {/* 히어로 */}
      <section className="relative flex flex-col items-center px-4 pt-28 pb-20 text-center">
        <span className="rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          링크-인-바이오
        </span>
        <h1 className="mt-5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          마이링크
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          나만의 링크 페이지를 만들고
          <br />
          URL 하나로 공유하세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mypage"
            className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700"
          >
            시작하기
          </Link>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="relative mx-auto grid w-full max-w-4xl gap-4 px-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <f.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* 미리보기 */}
      <section className="relative mx-auto mt-20 flex w-full max-w-md flex-col items-center px-4 text-center">
        <div className="w-full rounded-3xl border border-border/60 bg-card p-6 shadow-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500" />
          <p className="mt-3 font-bold">홍길동</p>
          <p className="text-xs text-muted-foreground">안녕하세요!</p>
          <div className="mt-4 flex flex-col gap-2">
            {["인스타그램", "블로그", "유튜브"].map((t) => (
              <div
                key={t}
                className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium"
              >
                {t}
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/mypage"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-violet-300 px-6 font-semibold text-violet-600 transition hover:bg-violet-500/10"
        >
          나도 만들어보기
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="relative mt-24 border-t border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
        <a
          href="https://github.com/oeunseog807-hash/my-link"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-violet-600"
        >
          GitHub
        </a>
        <p className="mt-2 text-xs">© 2026 마이링크</p>
      </footer>
    </div>
  );
}
