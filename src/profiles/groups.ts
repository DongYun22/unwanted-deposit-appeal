import type { ExchangeGroup, ExchangeGroupProfile } from "@/types/case";

// 국내 · 해외 공통 칸
// 거래소별 프로필이 아직 비어 있어도 이 칸은 항상 적용됩니다.
// 법 조항 요약은 팀 리서치 4-2(나라별 비교), 5-2(소명 절차)를 따릅니다. 고칠 때는 리서치 담당 확인을 받아 주세요.

export const GROUPS: Record<ExchangeGroup, ExchangeGroupProfile> = {
  kr: {
    id: "kr",
    name: "국내 원화 거래소",
    language: "ko",
    requestedDocuments: [
      "txHash",
      "depositReason",
      "exchangeRecords",
      "bankRecords",
      "otherExchangeRecords",
      "counterpartyRecords",
    ],
    fields: [
      {
        label: "적용 법",
        value:
          "가상자산이용자보호법 제11조. 정당한 사유 없이 입출금을 막을 수 없고, 막을 때는 사유를 미리 알리고 금융위원회에 보고해야 합니다.",
        status: "verified",
        source: { label: "팀 리서치 4-2" },
      },
      {
        label: "보이스피싱 지급정지",
        value: "통신사기피해환급법 제7조. 채권소멸절차 개시 공고일부터 2개월 안에 이의를 제기할 수 있습니다.",
        status: "verified",
        source: { label: "팀 리서치 5-2" },
      },
    ],
  },
  intl: {
    id: "intl",
    name: "해외 거래소",
    language: "en",
    requestedDocuments: ["txHash", "depositReason", "bankRecords", "exchangeRecords"],
    fields: [
      {
        label: "적용 기준",
        value:
          "거래소 약관과 본사 소재국 규정을 따릅니다. 국내 미신고 사업자라면 한국 법의 이용자 보호 조항이 적용되지 않을 수 있습니다.",
        status: "caution",
      },
      {
        label: "국내 신고",
        value: "금융정보분석원 신고 사업자 현황에서 거래소별로 확인합니다.",
        status: "check",
      },
    ],
  },
};
