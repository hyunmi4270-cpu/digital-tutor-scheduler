"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type GradeInfo = {
  name: string;
  classes: string[];
  topic: string;
  content: string;
  theme: {
    page: string;
    soft: string;
    strong: string;
    text: string;
    border: string;
  };
};

const gradeInfo: Record<number, GradeInfo> = {
  1: {
    name: "1학년",
    classes: ["가람반", "나래반", "다솜반", "라온반", "마루반", "바름반"],
    topic: "1학년 디지털튜터 수업",
    content:
      "크롬북 기본 사용 익히기\nAI 체험 활동\n디지털 기기 사용 약속 알아보기",
    theme: {
      page: "bg-rose-50",
      soft: "bg-rose-100",
      strong: "bg-rose-200",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  },
  2: {
    name: "2학년",
    classes: [
      "가람반",
      "나래반",
      "다솜반",
      "라온반",
      "마루반",
      "바름반",
      "사랑반",
    ],
    topic: "2학년 디지털튜터 수업",
    content: "크롬북 활용하기\n기초 디지털 활동\n안전한 인터넷 사용 알아보기",
    theme: {
      page: "bg-orange-50",
      soft: "bg-orange-100",
      strong: "bg-orange-200",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },
  3: {
    name: "3학년",
    classes: [
      "가람반",
      "나래반",
      "다솜반",
      "라온반",
      "마루반",
      "바름반",
      "사랑반",
      "아람반",
    ],
    topic: "3학년 디지털튜터 수업",
    content: "디지털 도구 활용하기\nAI 기초 체험\n디지털 예절 익히기",
    theme: {
      page: "bg-amber-50",
      soft: "bg-amber-100",
      strong: "bg-amber-200",
      text: "text-amber-700",
      border: "border-amber-200",
    },
  },
  4: {
    name: "4학년",
    classes: [
      "가람반",
      "나래반",
      "다솜반",
      "라온반",
      "마루반",
      "바름반",
      "사랑반",
      "아람반",
    ],
    topic: "4학년 디지털튜터 수업",
    content: "온라인 도구 활용하기\nAI 활용 체험\n디지털 시민의식 익히기",
    theme: {
      page: "bg-emerald-50",
      soft: "bg-emerald-100",
      strong: "bg-emerald-200",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },
  5: {
    name: "5학년",
    classes: [
      "가람반",
      "나래반",
      "다솜반",
      "라온반",
      "마루반",
      "바름반",
      "사랑반",
      "아람반",
    ],
    topic: "5학년 디지털튜터 수업",
    content: "디지털 협업 도구 활용하기\nAI 활용 활동\n저작권과 정보윤리 알아보기",
    theme: {
      page: "bg-sky-50",
      soft: "bg-sky-100",
      strong: "bg-sky-200",
      text: "text-sky-700",
      border: "border-sky-200",
    },
  },
  6: {
    name: "6학년",
    classes: [
      "가람반",
      "나래반",
      "다솜반",
      "라온반",
      "마루반",
      "바름반",
      "사랑반",
      "아람반",
    ],
    topic: "6학년 디지털튜터 수업",
    content: "디지털 프로젝트 활동\nAI 활용과 정보 탐색\n디지털 시민으로서의 책임 알아보기",
    theme: {
      page: "bg-violet-50",
      soft: "bg-violet-100",
      strong: "bg-violet-200",
      text: "text-violet-700",
      border: "border-violet-200",
    },
  },
};

const timeRows = [
  { period: "1교시", time: "09:00 ~ 09:40", bookable: false },
  { period: "2교시", time: "09:45 ~ 10:25", bookable: true },
  { period: "3교시", time: "10:45 ~ 11:25", bookable: true },
  { period: "4교시", time: "11:30 ~ 12:00", bookable: false },
];

const dayNames = ["월", "화", "수", "목", "금"];

function formatDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatWeekTitle(start: Date, end: Date) {
  return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${
    end.getMonth() + 1
  }월 ${end.getDate()}일`;
}

function getWeekDates(startDate: string) {
  const start = new Date(startDate);
  return Array.from({ length: 5 }, (_, index) => {
    const d = new Date(start);
    d.setDate(start.getDate() + index);
    return d;
  });
}

export default function GradePage() {
  const params = useParams();
  const gradeNumber = Number(params.grade);
  const info = gradeInfo[gradeNumber];

  const [startDate, setStartDate] = useState("2026-09-07");
  const [topic, setTopic] = useState(info?.topic ?? "");
  const [content, setContent] = useState(info?.content ?? "");
  const [adminMode, setAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Record<string, string>>({});
  const [occupiedSlots, setOccupiedSlots] = useState<Set<string>>(new Set());
   useEffect(() => {
 supabase.auth.getSession().then(({ data }) => {
  setIsLoggedIn(!!data.session);
  setIsAdmin(
    data.session?.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
});

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
   setIsLoggedIn(!!session);
setIsAdmin(
  session?.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
  async function handleGoogleLogin() {
   
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.href,
    },
  });

  if (error) {
    console.error(error);
    alert("Google 로그인 중 오류가 발생했어요.");
  }
}
async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    alert("로그아웃 중 오류가 발생했어요.");
    return;
  }

  setIsLoggedIn(false);
  setIsAdmin(false);
  setAdminMode(false);
}
useEffect(() => {
  const loadGradeSettings = async () => {
    const { data, error } = await supabase
      .from("grade_settings")
      .select("first_week_start, topic, content")
      .eq("school_year", 2026)
      .eq("grade", gradeNumber)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data.first_week_start) {
      setStartDate(data.first_week_start);
    }

    setTopic(data.topic);
    setContent(data.content);
  };

  loadGradeSettings();
}, [gradeNumber]);
useEffect(() => {
  const loadBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("class_name, booking_date, period")
      .eq("school_year", 2026)
      .eq("grade", gradeNumber);

    if (error) {
      console.error(error);
      return;
    }

    const loadedBookings: Record<string, string> = {};

    data?.forEach((booking) => {
      const bookingKey = `${booking.booking_date}-${booking.period}교시`;
      loadedBookings[bookingKey] = booking.class_name;
    });

    setBookings(loadedBookings);
  };
  const loadOccupiedSlots = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("booking_date, period")
    .eq("school_year", 2026);

  if (error) {
    console.error(error);
    return;
  }

  const slots = new Set<string>();

  data?.forEach((booking) => {
    slots.add(`${booking.booking_date}-${booking.period}교시`);
  });

  setOccupiedSlots(slots);
};

  loadBookings();
  loadOccupiedSlots();
}, [gradeNumber]);
  const weekDates = useMemo(() => getWeekDates(startDate), [startDate]);

  if (!info) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdfb]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            학년 정보를 찾을 수 없습니다.
          </h1>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-slate-800 px-5 py-3 text-white"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const theme = info.theme;

  function moveWeek(days: number) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    setStartDate(date.toISOString().slice(0, 10));
  }

 async function handleSave() {
    console.log("저장 직전 content:", content);
  const { error } = await supabase
    .from("grade_settings")
    .update({
      first_week_start: startDate,
      topic: topic,
      content: content,
    })
    .eq("school_year", 2026)
    .eq("grade", gradeNumber);

  if (error) {
    console.error(error);
    alert("설정 저장 중 오류가 발생했어요.");
    return;
  }

  alert("수업 설정이 저장되었습니다.");
  setAdminMode(false);
}

  return (
    <main className={`min-h-screen ${theme.page} px-4 py-8 sm:px-6`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
          >
            ← 학년 선택
          </Link>

          <div className="text-right">
            <p className={`text-sm font-semibold ${theme.text}`}>DIGITAL TUTOR</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800">
              {info.name} 수업 신청
            </h1>
          </div>
        </header>

        <section
          className={`mb-6 rounded-3xl border ${theme.border} bg-white p-6 shadow-sm`}
        >
          {!adminMode && isLoggedIn && (
            <div className={`mb-5 rounded-2xl ${theme.soft} p-4`}>
              <p className={`mb-3 text-sm font-bold ${theme.text}`}>
                관리자용 주 시작 날짜 설정
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    월요일 날짜
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
  const selectedDate = e.target.value;
  const day = new Date(`${selectedDate}T00:00:00`).getDay();

  if (day !== 1) {
    alert("주 시작 날짜는 월요일만 선택할 수 있어요.");
    return;
  }

  setStartDate(selectedDate);
}}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </div>

                <button
                  onClick={() => setAdminMode(false)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                >
                  미리보기
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => moveWeek(-7)}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600"
            >
              ← 이전 주
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-400">수업 신청 주간</p>
              <h2 className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">
                {formatWeekTitle(weekDates[0], weekDates[4])}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                화 · 수 · 목요일 / 2교시 · 3교시
              </p>
            </div>

            <button
              onClick={() => moveWeek(7)}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600"
            >
              다음 주 →
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-center">
              <thead>
                <tr className="bg-slate-100">
                  <th className="w-40 border border-slate-200 px-4 py-4 text-sm font-bold text-slate-600">
                    시간
                  </th>

                  {weekDates.map((date, index) => (
                    <th
                      key={date.toISOString()}
                      className="border border-slate-200 px-4 py-4"
                    >
                      <p className="text-base font-bold text-slate-700">
                        {formatDate(date)} ({dayNames[index]})
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeRows.map((row) => (
                  <tr key={row.period}>
                    <td className="border border-slate-200 bg-slate-50 px-4 py-5">
                      <p className="font-bold text-slate-700">{row.period}</p>
                      <p className="mt-1 text-xs text-slate-400">{row.time}</p>
                    </td>

                    {dayNames.map((day, dayIndex) => {
                      const available =
                        row.bookable &&
                        (day === "화" || day === "수" || day === "목");
const bookingDate = weekDates[dayIndex];
const bookingKey = `${bookingDate.toISOString().slice(0, 10)}-${row.period}`;
const bookedClass = bookings[bookingKey];
                      return (
                        <td
                          key={`${row.period}-${day}`}
                          className="border border-slate-200 p-3"
                        >
                         {bookedClass ? (
  <button
  onClick={async () => {
  const action = window.prompt(
    "수정하려면 새 반 이름을 입력하고, 삭제하려면 '삭제'라고 입력해주세요."
  );

  if (!action) return;

 if (action === "삭제") {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("school_year", 2026)
    .eq("grade", gradeNumber)
    .eq("booking_date", bookingDate.toISOString().slice(0, 10))
    .eq("period", Number(row.period.replace("교시", "")));

  if (error) {
    alert("삭제 중 오류가 발생했어요.");
    console.error(error);
    return;
  }

  setBookings((prev) => {
    const next = { ...prev };
    delete next[bookingKey];
    return next;
  });

  return;
}

  const { error } = await supabase
  .from("bookings")
  .update({ class_name: action })
  .eq("school_year", 2026)
  .eq("grade", gradeNumber)
  .eq("booking_date", bookingDate.toISOString().slice(0, 10))
  .eq("period", Number(row.period.replace("교시", "")));

if (error) {
  alert("수정 중 오류가 발생했어요.");
  console.error(error);
  return;
}

setBookings((prev) => ({
  ...prev,
  [bookingKey]: action,
}));
}}
  className="flex min-h-20 w-full items-center justify-center rounded-2xl bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-700"
>
  {bookedClass}
</button>
) : available && !occupiedSlots.has(bookingKey) ? (
                            <button
                            onClick={async() => {
    const className = window.prompt("신청할 반 이름을 입력해주세요.");

    if (!className) return;

const { error } = await supabase.from("bookings").insert({
  school_year: 2026,
  grade: gradeNumber,
  class_name: className,
  booking_date: bookingDate.toISOString().slice(0, 10),
  period: Number(row.period.replace("교시", "")),
});

if (error) {
  alert("신청 저장 중 오류가 발생했어요.");
  console.error(error);
  return;
}

    setBookings((prev) => ({
      ...prev,
      [bookingKey]: className,
    }));
  }}
                              className={`min-h-20 w-full rounded-2xl ${theme.soft} px-3 py-3 font-semibold ${theme.text} transition hover:opacity-80`}
                            >
                              신청하기
                            </button>
                          ) : (
                            <div className="flex min-h-20 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-300">
                              신청 불가
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className={`mt-6 rounded-3xl border ${theme.border} bg-white p-6 shadow-sm`}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full ${theme.soft} px-3 py-1 text-sm font-semibold ${theme.text}`}
              >
                {info.name}
              </span>
              <span className="text-sm text-slate-400">
                총 {info.classes.length}개 반
              </span>
            </div>

           {!adminMode && (
  <div className="flex gap-2">
    {!isLoggedIn && (
      <button
        onClick={handleGoogleLogin}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        Google로 관리자 로그인
      </button>
    )}

   {isAdmin && (
  <>
    <button
      onClick={() => setAdminMode(true)}
      className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
    >
      관리자 수정
    </button>

    <button
      onClick={handleLogout}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
    >
      관리자 로그아웃
    </button>
  </>
)}
  </div>
)}
          </div>

          

          {adminMode ? (
            <div className="mt-5 grid gap-5">
              <div>
                
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                />
              </div>

              <div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 leading-7 text-slate-700 outline-none"
                />
              </div>

              <button
                onClick={handleSave}
                className={`justify-self-end rounded-xl ${theme.strong} px-5 py-3 text-sm font-bold ${theme.text}`}
              >
                변경사항 적용하기
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="rounded-2xl bg-slate-50 p-5">
                
                <p className="mt-2 text-lg font-bold text-slate-700">{topic}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                
                <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {content}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-400">참여 학급</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {info.classes.map((className) => (
                <span
                  key={className}
                  className={`rounded-full ${theme.soft} px-3 py-1 text-sm font-medium ${theme.text}`}
                >
                  {className}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}