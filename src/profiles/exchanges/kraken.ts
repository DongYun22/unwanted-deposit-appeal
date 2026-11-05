import type { ExchangeProfile } from "@/types/case";

// Kraken 소명 절차
// 담당: 거래소 프로필 · 해외
// 출처는 팀 리서치 5-2, 5-3에 정리된 공개 자료입니다.
// TODO(거래소 프로필 · 해외): 출처마다 url을 채우기

export const kraken: ExchangeProfile = {
  id: "kraken",
  name: "Kraken",
  group: "intl",
  status: "verified",
  language: "en",
  channel: "Kraken 공식 지원 채널 (거래소의 개별 요청에 회신)",
  reviewPeriod: "통상 10~14영업일 (제출 기한이 아니라 심사 기간)",
  requestedDocuments: ["txHash", "depositReason", "bankRecords", "exchangeRecords"],
  fields: [
    {
      label: "제출 창구",
      value: "공식 지원 채널. 거래소의 개별 요청에 회신합니다.",
      status: "verified",
      source: { label: "Kraken 임시 제한 안내" },
    },
    {
      label: "요청 자료",
      value: "전체 재산 형성 경위(source of wealth)와 특정 거래의 자금 출처(source of funds)를 나눠 요청할 수 있습니다.",
      status: "verified",
      source: { label: "Kraken 자금 출처 안내" },
    },
    {
      label: "심사 기간",
      value: "통상 10~14영업일입니다. 제출 기한이 아니라 심사 기간입니다.",
      status: "verified",
      source: { label: "Kraken 임시 제한 안내" },
    },
    {
      label: "계정 종료 시",
      value: "별도 이의신청 절차가 있습니다.",
      status: "verified",
      source: { label: "Kraken 계정 종료 이의신청 안내" },
    },
  ],
  checkedAt: "2026-11-05",
};
