import { GROUPS } from "@/profiles/groups";
import { getProfile } from "@/profiles/registry";
import type { DeadlineStatus, SubmissionDetails, SubmissionRoute } from "@/types/case";

// 제한 유형 + 거래소 프로필 + 기준일 → 어디에, 언제까지 낼지
// 오늘 날짜를 인자로 받는 순수 함수라서 테스트에서 날짜를 고정해 확인합니다. (__tests__/route.test.ts)
//
// TODO(리포트·통합): 영어 문구 (Kraken 같은 해외 거래소 소명서용)

const SOON_DAYS = 3; // 기한이 이 날수 안으로 남으면 "곧 마감"
const PHISHING_OBJECTION_MONTHS = 2; // 통신사기피해환급법 제7조 (리서치 5-2)

type RouteInput = Pick<SubmissionDetails, "exchange" | "restrictionType" | "baseDate">;

export function getSubmissionRoute(input: RouteInput, today: string): SubmissionRoute {
  const profile = getProfile(input.exchange);
  const group = profile ? GROUPS[profile.group] : null;
  const channel = profile?.channel ?? "해당 거래소 공식 고객센터";
  const baseDate = isDate(input.baseDate) ? input.baseDate : null;
  const notes: string[] = [];

  if (!profile) {
    notes.push("거래소를 고르면 제출 창구와 요청 자료를 더 구체적으로 안내합니다.");
  } else if (profile.status === "research") {
    notes.push(`${profile.name}의 제출 창구와 요청 자료는 아직 확인하지 못했습니다. ${group?.name} 공통 기준으로 안내합니다.`);
  }
  if (profile?.group === "intl") {
    notes.push("해외 거래소는 약관이 기준입니다. 국내 미신고 사업자라면 한국 법의 이용자 보호 조항이 적용되지 않을 수 있습니다.");
  }

  switch (input.restrictionType) {
    case "internal": {
      if (profile?.group === "kr") {
        notes.push(
          "국내 거래소는 입출금을 막을 때 사유를 미리 알려야 합니다(가상자산이용자보호법 제11조). 통지에 사유가 없으면 먼저 요청할 수 있습니다.",
        );
      }
      return {
        submitTo: channel,
        deadline: baseDate
          ? { text: `${baseDate}까지 (거래소 통지 기준)`, date: baseDate, status: deadlineStatus(baseDate, today) }
          : unknownDeadline("기한 확인 필요 · 거래소 통지에서 확인하세요"),
        reviewPeriod: profile?.reviewPeriod ?? null,
        notes,
      };
    }

    case "sanction":
      return {
        submitTo: `${channel}에 동결 근거를 확인한 뒤, 해당 제도의 해제·허가 절차 (미국 OFAC, 영국 OFSI 등)`,
        deadline: unknownDeadline("해당 절차에서 신청 요건과 기한을 확인해야 합니다"),
        reviewPeriod: null,
        notes,
      };

    case "phishing": {
      if (profile?.group === "intl") {
        return {
          submitTo: `보이스피싱 법정 지급정지는 한국 법 절차입니다. 먼저 ${channel}에 제한 근거를 확인하세요.`,
          deadline: unknownDeadline("해외 거래소에는 해당하지 않을 수 있습니다 · 확인 필요"),
          reviewPeriod: null,
          notes,
        };
      }
      const named = profile && profile.status !== "fallback" ? ` (${profile.name})` : "";
      notes.push(
        "기한은 민법의 기간 계산(첫날은 빼고, 마지막 달에 같은 날이 없으면 그 달 말일)으로 추정한 날짜입니다. 마지막 날이 토요일이나 공휴일이면 다음 날로 늘어날 수 있으니 공고문에서 확인하세요.",
      );
      if (!baseDate) {
        return {
          submitTo: `지급정지 조치를 한 금융회사 또는 가상자산거래소${named}`,
          deadline: unknownDeadline("기한 확인 필요 · 채권소멸절차 개시 공고일을 입력하세요"),
          reviewPeriod: null,
          notes,
        };
      }
      const end = objectionDeadline(baseDate);
      return {
        submitTo: `지급정지 조치를 한 금융회사 또는 가상자산거래소${named}`,
        deadline: {
          text: `${end}까지 (공고일 ${baseDate}부터 ${PHISHING_OBJECTION_MONTHS}개월 · 추정)`,
          date: end,
          status: deadlineStatus(end, today),
        },
        reviewPeriod: null,
        notes,
      };
    }

    case "unknown":
    default:
      return {
        submitTo: `${channel} · 먼저 제한 유형, 사건번호, 요청 자료를 물어보세요`,
        deadline: unknownDeadline("제한 유형을 확인한 뒤 정해집니다"),
        reviewPeriod: null,
        notes,
      };
  }
}

// 공고일 다음 날부터 세어 2개월째 같은 날의 전날 = 공고일과 같은 날짜 (민법 제157조, 제160조)
// 그 달에 같은 날이 없으면 그 달 말일
export function objectionDeadline(noticeDate: string): string {
  const [year, month, day] = noticeDate.split("-").map(Number);
  const targetMonthIndex = month - 1 + PHISHING_OBJECTION_MONTHS;
  const lastDay = new Date(Date.UTC(year, targetMonthIndex + 1, 0)).getUTCDate();
  const date = new Date(Date.UTC(year, targetMonthIndex, Math.min(day, lastDay)));
  return date.toISOString().slice(0, 10);
}

export function deadlineStatus(deadline: string, today: string): DeadlineStatus {
  const days = daysBetween(today, deadline);
  if (days < 0) return "passed";
  if (days <= SOON_DAYS) return "soon";
  return "set";
}

// 서버 시각과 상관없이 한국 날짜로 "오늘"을 구합니다.
export function todayInSeoul(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function unknownDeadline(text: string) {
  return { text, date: null, status: "unknown" as const };
}

function isDate(value: string | undefined): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function daysBetween(from: string, to: string): number {
  const toUtc = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}
