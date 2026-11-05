import { GROUPS } from "@/profiles/groups";
import type { ExchangeGroup, ExchangeProfile, ProfiledExchangeId } from "@/types/case";

// 아직 공개 자료를 확인하지 못한 거래소
// 거래소별 칸은 "확인 필요"로 두고, 요청 자료는 공통 칸을 씁니다.
export function researchProfile(id: ProfiledExchangeId, name: string, group: ExchangeGroup): ExchangeProfile {
  return {
    id,
    name,
    group,
    status: "research",
    language: GROUPS[group].language,
    channel: `${name} 공식 고객센터 (세부 창구 확인 필요)`,
    reviewPeriod: null,
    requestedDocuments: GROUPS[group].requestedDocuments,
    fields: [
      { label: "제출 창구", value: "리서치 필요", status: "check" },
      { label: "요청 자료", value: `리서치 필요. 그동안 ${GROUPS[group].name} 공통 항목을 씁니다.`, status: "check" },
      { label: "심사 기간", value: "리서치 필요", status: "check" },
    ],
    checkedAt: null,
  };
}

// 프로필이 없는 거래소 (그 외 국내 / 그 외 해외)
export function fallbackProfile(id: ProfiledExchangeId, group: ExchangeGroup): ExchangeProfile {
  return {
    id,
    name: group === "kr" ? "그 외 국내 거래소" : "그 외 해외 거래소",
    group,
    status: "fallback",
    language: GROUPS[group].language,
    channel: "해당 거래소 공식 고객센터",
    reviewPeriod: null,
    requestedDocuments: GROUPS[group].requestedDocuments,
    fields: [],
    checkedAt: null,
  };
}
