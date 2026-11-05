// 거래소 프로필 (어디에, 무엇을, 언제까지 내나)
// 화면과 서버가 같이 씁니다. 비밀값이 없어서 server-only가 아닙니다.
// 채우는 방법: src/profiles/README.md

export { DOCUMENT_LABELS } from "@/profiles/documents";
export { GROUPS } from "@/profiles/groups";
export { PROFILE_ORDER, PROFILES, exchangeLabel, getProfile } from "@/profiles/registry";
export { getSubmissionRoute, todayInSeoul } from "@/profiles/route";

export const RESTRICTION_LABELS = {
  internal: "거래소 내부 심사",
  sanction: "제재에 따른 자산 동결",
  phishing: "보이스피싱 법정 지급정지",
  unknown: "아직 모름",
} as const;
