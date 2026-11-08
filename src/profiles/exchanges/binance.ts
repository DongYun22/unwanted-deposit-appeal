import type { ExchangeProfile } from "@/types/case";

// Binance 소명 절차
// 담당: 거래소 프로필 · 해외
// 출처는 Binance Support FAQ 공개 문서입니다. 문구는 원문을 거의 그대로 옮겼습니다.
// 자료 심사 기간과 요청하지 않은 입금 처리 방식은 공개 문서에서 찾지 못해 "check"로 남겼습니다.

const SOURCES = {
  withdrawal: {
    label: "Binance FAQ · How to Reactivate the Withdrawal Function for My Binance Account?",
    url: "https://www.binance.com/en/support/faq/360038583951",
  },
  sourceOfFunds: {
    label: "Binance FAQ · Guide to Verifying Source of Wealth and Source of Funds",
    url: "https://www.binance.com/en/support/faq/what-are-source-of-funds-and-source-of-wealth-6d7de22f918d4cf28d68a7079a10e254",
  },
  assetVideo: {
    label: "Binance FAQ · How to Prove the Source of My Assets",
    url: "https://www.binance.com/en/support/faq/how-to-prove-the-source-of-my-assets-7ee8ff5813c142248c6796897b654378",
  },
  complaint: {
    label: "Binance FAQ · How to raise a complaint?",
    url: "https://www.binance.com/en/support/faq/detail/fcda7991306f4d5f91bb2a1709d26b4c",
  },
  antiScam: {
    label: "Binance FAQ · Binance Withdrawal Anti-Scam Measures",
    url: "https://www.binance.com/en/support/faq/7f3b38cb6ffe431c899fad1d74d87eab",
  },
} as const;

export const binance: ExchangeProfile = {
  id: "binance",
  name: "Binance",
  group: "intl",
  status: "verified",
  language: "en",
  channel: "Binance 고객센터 채팅 (출금 제한은 출금 화면 알림의 [Appeal] 버튼)",
  reviewPeriod: null,
  requestedDocuments: ["txHash", "depositReason", "bankRecords", "otherExchangeRecords"],
  fields: [
    {
      label: "제한 통지",
      value: "계정을 제한하면 이메일, SMS, 앱 알림으로 알립니다.",
      status: "verified",
      source: SOURCES.withdrawal,
    },
    {
      label: "제출 창구",
      value:
        "계정 제한에 대해 묻거나 이의를 제기하려면 고객센터(Customer Service)에 직접 연락합니다. 모든 계정 제한이 이의 대상은 아니며, 특히 수사기관 명령이나 규제 의무에 따른 제한이 그렇습니다.",
      status: "verified",
      source: SOURCES.withdrawal,
    },
    {
      label: "출금 제한 이의",
      value:
        "웹은 출금(Withdraw Crypto) 화면 알림의 [Withdraw appeal], 앱은 Wallets → Spot → Withdraw의 [Appeal]을 눌러 필요한 서류를 냅니다. [Appeal] 버튼이 없으면 고객센터에 연락합니다.",
      status: "verified",
      source: SOURCES.withdrawal,
    },
    {
      label: "요청 자료",
      value:
        "자금 출처(Source of Funds)는 Binance 계정에 입금하는 법정화폐나 가상자산이 어디서 왔는지, 재산 형성 경위(Source of Wealth)는 순자산을 어떻게 쌓았는지를 말합니다.",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "가상자산 자료",
      value:
        "가상자산 계정 명세서(UID와 인증된 이메일, 잔액이나 자산 가치가 보이는 것), 지갑 화면(보유 자산, 잔액, 지갑 주소가 보이는 것), 가상자산 매도 대금이 들어온 은행 거래내역을 받습니다. 지갑 화면은 함께 낸 거래소 명세서, 블록체인 기록, 세금 서류와 맞아야 합니다.",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "자산 출처 영상",
      value:
        "다른 플랫폼에서 출금해 온 자산이라면, 그 플랫폼에 로그인해 출금 기록과 TxID를 보여 주는 영상을 고객센터에 냅니다. 화면 녹화가 아니라 직접 촬영하고, 플랫폼 이름과 주소, 코인 이름, 수량, TxID가 보여야 합니다. 비밀번호는 가리고 영상 하나에 담습니다.",
      status: "verified",
      source: SOURCES.assetVideo,
    },
    {
      label: "서류 조건",
      value:
        "계정 이름과 같은 이름의 문서여야 합니다. 300 DPI 해상도로 네 모서리가 보이게 하고, 자르거나 흐리게 하거나 필터를 쓰지 않습니다. 수정할 수 없는 형식(PDF, JPG, PNG)만 받고 엑셀 · 워드는 대체로 거절합니다. 원본 PDF를 권장합니다. 스크린숏은 URL과 이름, 날짜가 담긴 전체 화면일 때만 받습니다. 최근 문서를 냅니다(예: 최근 3개월 급여명세서, 최근 연도 세금 신고).",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "심사 기간",
      value: "자금 출처 자료의 심사 기간은 공개 자료에서 찾지 못했습니다.",
      status: "check",
    },
    {
      label: "사기 방지 출금 제한",
      value: "사기 방지를 위한 출금 제한(cool-down)은 보통 최대 24시간이며 영구적이지 않습니다.",
      status: "verified",
      source: SOURCES.antiScam,
    },
    {
      label: "민원",
      value:
        "고객센터나 24시간 채팅으로 공식 민원을 낼 수 있습니다. 2영업일 안에 접수 확인을 보내고, 30영업일 안에 최종 답변을 목표로 합니다. 더 걸리면 사유를 알리고 60영업일 안에 답변하려고 합니다. 그 뒤 아부다비 금융감독청(ADGM FSRA)에 제기할 수 있습니다(Binance에 먼저 낸 민원, 2026년 1월 5일 이후 일만).",
      status: "verified",
      source: SOURCES.complaint,
    },
    {
      label: "요청하지 않은 입금",
      value: "보낸 사람이 임의로 보낸 가상자산 입금을 어떻게 처리하는지는 공개 자료에서 찾지 못했습니다.",
      status: "check",
    },
  ],
  checkedAt: "2026-11-07",
};
