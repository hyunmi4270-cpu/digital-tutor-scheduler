import Link from "next/link";

const grades = [
  {
    grade: 1,
    title: "1학년",
    description: "6개 반 수업 신청",
    color: "bg-rose-100 hover:bg-rose-200",
  },
  {
    grade: 2,
    title: "2학년",
    description: "7개 반 수업 신청",
    color: "bg-orange-100 hover:bg-orange-200",
  },
  {
    grade: 3,
    title: "3학년",
    description: "8개 반 수업 신청",
    color: "bg-amber-100 hover:bg-amber-200",
  },
  {
    grade: 4,
    title: "4학년",
    description: "8개 반 수업 신청",
    color: "bg-emerald-100 hover:bg-emerald-200",
  },
  {
    grade: 5,
    title: "5학년",
    description: "8개 반 수업 신청",
    color: "bg-sky-100 hover:bg-sky-200",
  },
  {
    grade: 6,
    title: "6학년",
    description: "8개 반 수업 신청",
    color: "bg-violet-100 hover:bg-violet-200",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffdfb] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <div className="mb-4 text-5xl">🌱</div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            디지털튜터 수업 신청
          </h1>

          <p className="mt-4 text-base text-slate-500 sm:text-lg">
            수업을 신청할 학년을 선택해주세요.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grades.map((item) => (
            <Link
              key={item.grade}
              href={`/grade/${item.grade}`}
              className={`${item.color} group min-h-44 rounded-3xl border border-white/70 p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-500">
                    GRADE {item.grade}
                  </span>

                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    {item.title}
                  </h2>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    {item.description}
                  </span>

                  <span className="text-xl text-slate-500 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
          <p className="text-sm leading-6 text-slate-500">
            수업 신청은 해당 학년의 신청 가능 기간에
            <br className="sm:hidden" /> 화·수·목요일 2교시와 3교시에 가능합니다.
          </p>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Digital Tutor Class Scheduler
        </footer>
      </div>
    </main>
  );
}
