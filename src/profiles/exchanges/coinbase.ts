import type { ExchangeProfile } from "@/types/case";

// Coinbase 소명 절차
// 담당: 거래소 프로필 · 해외
// 출처는 Coinbase Help Center 공개 문서입니다. 문구는 원문을 거의 그대로 옮겼습니다.
// 제출 기한, 제재 주소가 아닌 곳에서 온 요청하지 않은 입금 처리는 아직 확인하지 못해 "check"로 남겼습니다.
// 예전 자금 출처 서류 안내(.../managing-my-account/other/proof-of-source-of-funds-and-wealth-documents)는
// 2026-11-08 기준 "Page not found"입니다. 서류 조건은 계정 검토 안내에 있는 내용만 씁니다.

const SOURCES = {
  accountReview: {
    label: "Coinbase Help · Provide information for an account review",
    url: "https://help.coinbase.com/en/coinbase/managing-my-account/other/account-review",
  },
  ofac: {
    label: "Coinbase Help · OFAC sanctioned addresses",
    url: "https://help.coinbase.com/en/coinbase/other-topics/legal-policies/ofac",
  },
  scams: {
    label: "Coinbase Help · Technical support and impersonation scams",
    url: "https://help.coinbase.com/en/coinbase/privacy-and-security/avoid-scams/tech-support-scams",
  },
} as const;

export const coinbase: ExchangeProfile = {
  id: "coinbase",
  name: "Coinbase",
  group: "intl",
  status: "verified",
  language: "en",
  channel: "Coinbase 계정의 알림 또는 계정 작업(account task) 화면",
  reviewPeriod: "정해진 기간 없음 · 서류와 계정 활동에 따라 다름 (제출 기한이 아니라 심사 기간)",
  requestedDocuments: ["depositReason", "bankRecords", "otherExchangeRecords"],
  fields: [
    {
      label: "요청 이유",
      value:
        "계정 활동이나 프로필, 지역 규제, 갱신 · 확인이 필요한 정보, 정기 검토 때문에 추가 정보를 요청할 수 있습니다. 정보 요청은 잘못을 했다는 뜻이 아닙니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "요청 받는 곳",
      value: "추가 정보가 필요하면 이메일이나 Coinbase 계정으로 알림을 받습니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "제출 창구",
      value:
        "Coinbase 계정에 로그인해 알림이나 계정 작업(account task)을 엽니다. 질문에 답하고 문서 조건을 확인한 뒤, 요청받은 경우 선명하고 유효한 문서를 올려 제출합니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "요청할 수 있는 정보",
      value:
        "직업 · 사업 · 고용, 예상 계정 활동, Coinbase 계정 목적, 예상 거래량, 자금 출처, 재산 형성 경위, 사업체 등과의 관계, 거래의 보낸 사람 또는 받는 사람, 거주지 주소 또는 거주 증명, 납세자 식별 정보, 가상자산 거래 내역",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "가상자산 자료",
      value:
        "거래소 계정 명세서, 거래 내역 또는 트레이딩 보고서, 지갑 거래 내역, 채굴 · 스테이킹 기록, 매도 · 이전 기록, 사업 · 투자 등으로 얻은 가상자산의 출처를 보여 주는 문서",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "금융 자료",
      value:
        "은행 · 증권 명세서, 투자 계좌 명세서, 매매 계약서 또는 정산서, 배당 · 투자 수익 명세서, 대출 계약서 또는 대출금 지급 명세서, 상속 · 증여 서류",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "고용 · 사업 자료",
      value:
        "급여명세서 또는 재직 증명, 고용 계약서, 사업자 등록 서류, 사업 세금 신고서, 회사 재무제표, 사업 소득을 보여 주는 송장이나 계약서",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "서류 조건",
      value:
        "선명하고 읽을 수 있어야 하며, 해당 검토의 날짜 요건을 맞춰야 합니다. 본인 이름이나 본인 것임을 알 수 있는 정보가 보여야 합니다. 원본 문서나 규제받는 곳 · 독립적으로 확인할 수 있는 곳이 발행한 문서를 요청할 수 있습니다. 문서가 불완전하거나, 만료됐거나, 불분명하거나, 계정 정보를 뒷받침하지 않으면 추가 정보를 요청할 수 있습니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "요청 기준",
      value:
        "요청 내용은 국가 · 지역, 계정을 맡은 Coinbase 법인, 쓰는 상품, 계정 활동에 따라 다릅니다. 내 Coinbase 계정에 표시된 요청 내용이 그 검토에 가장 정확한 안내입니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "주의",
      value:
        "정보를 낸다고 해서 거래나 계정 기능이 승인된다는 보장은 없습니다. 제출한 정보가 정확하고, 빠짐없고, 최신인지는 제출한 사람이 책임집니다.",
      status: "caution",
      source: SOURCES.accountReview,
    },
    {
      label: "사칭 주의",
      value:
        "Coinbase 고객지원 담당자는 자금을 보호 · 이동하거나 접근하라고 하지 않고, 시드 문구를 주거나 묻지 않고, 비밀번호나 2단계 인증 코드를 묻지 않습니다. 담당자를 대신해 외부 주소로 가상자산을 보내라고 하지도 않습니다. 이런 요청을 받으면 연락을 끊고 security@coinbase.com에 바로 알립니다. Coinbase에는 Contact us 페이지에 적힌 전화번호나 이메일로만 연락합니다.",
      status: "caution",
      source: SOURCES.scams,
    },
    { label: "제출 기한", value: "공개 자료에서 찾지 못했습니다. 알림이나 계정 작업에 적힌 기한을 확인합니다.", status: "check" },
    {
      label: "심사 기간",
      value:
        "정해진 기간은 안내되어 있지 않습니다. 요청한 정보, 서류의 품질과 완전성, 계정 활동의 복잡도, 추가 정보가 필요한지, 수동 검토가 필요한지에 따라 다릅니다. 빠짐없고 선명하고 일관된 정보를 내면 지연을 줄일 수 있습니다.",
      status: "verified",
      source: SOURCES.accountReview,
    },
    {
      label: "제재 주소에서 온 요청하지 않은 입금",
      value:
        "OFAC 제재 주소에서 요청하지 않은 가상자산이 오면 Coinbase가 그 시도를 알리고, 자동으로 계정에 입금되지 않게 막습니다. 따로 할 일은 없고, 계정 이용에도 영향이 없습니다.",
      status: "verified",
      source: SOURCES.ofac,
    },
    {
      label: "그 밖의 요청하지 않은 입금",
      value: "제재 주소가 아닌 곳에서 임의로 보낸 가상자산 입금을 어떻게 처리하는지는 공개 자료에서 찾지 못했습니다.",
      status: "check",
    },
    {
      label: "제재 주소 거래 동결",
      value:
        "제재 주소와 주고받으려 한 거래를 알렸다면, 그 자금은 동결되어 Coinbase 내부 보관 계정으로 옮겨집니다. 동결된 거래는 취소할 수 없습니다. 계정의 다른 자금은 이 제한을 받지 않고 이용약관에 따라 쓸 수 있습니다. 다른 이유로 계정이 정지됐다면 별도 통지가 옵니다.",
      status: "verified",
      source: SOURCES.ofac,
    },
    {
      label: "동결 해제 절차",
      value:
        "자금을 돌려받으려면 OFAC 웹사이트의 동결 자금 해제(Release of Blocked Funds) 신청서로 OFAC 특정 허가(specific license)를 받아야 합니다. 거래를 이어 가지 않으려는 경우에도 허가가 필요합니다. Coinbase는 OFAC 허가를 받기 전에는 이 자금에 조치할 수 없습니다.",
      status: "verified",
      source: SOURCES.ofac,
    },
    {
      label: "허가서 제출",
      value:
        "OFAC 허가를 받으면 Coinbase Support에 연락합니다. 지원 담당자가 허가서와 거래 정보를 낼 링크를 보내 줍니다. 메신저나 이메일로 보내지 않습니다. 제출하고 24~48시간 안에 자금이 보여야 합니다.",
      status: "verified",
      source: SOURCES.ofac,
    },
  ],
  checkedAt: "2026-11-08",
};
