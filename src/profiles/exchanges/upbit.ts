import type { ExchangeProfile } from "@/types/case";

// 업비트 소명 절차
// 담당: 거래소 프로필 · 국내
// 출처는 팀 리서치 5-3에 정리된 공개 자료입니다.
// TODO(거래소 프로필 · 국내): 출처마다 url을 채우고, 제출 창구와 심사 기간을 공개 문서에서 찾기

export const upbit: ExchangeProfile = {
  id: "upbit",
  name: "업비트",
  group: "kr",
  status: "verified",
  language: "ko",
  channel: "업비트 공식 고객센터",
  reviewPeriod: null,
  requestedDocuments: ["txHash", "depositReason", "bankRecords", "otherExchangeRecords"],
  fields: [
    {
      label: "판단 방식",
      value: "자금 출처 등 소명자료를 검토해 입출금 제한 해제 여부를 판단합니다.",
      status: "verified",
      source: { label: "업비트 계정 운영 정책" },
    },
    {
      label: "요청 자료",
      value: "입금 거래 해시(TxID), 입금 사유, 금융기관 거래내역, 타 가상자산거래소 거래내역",
      status: "verified",
      source: { label: "업비트 개인정보 처리방침 (2025년 공개본)" },
    },
    { label: "제출 창구", value: "공식 고객센터 (앱 · 웹). 세부 창구는 통지에서 확인합니다.", status: "check" },
    { label: "심사 기간", value: "공개 자료에서 찾지 못했습니다.", status: "check" },
  ],
  checkedAt: "2026-11-05",
};
