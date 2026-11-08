import type { ExchangeProfile } from "@/types/case";

// Kraken 소명 절차
// 담당: 거래소 프로필 · 해외
// 출처는 Kraken Support Center 공개 문서입니다. 문구는 원문을 거의 그대로 옮겼습니다.
// 요청하지 않은 가상자산 입금에 관한 안내는 공개 문서에서 찾지 못해 "check"로 남겼습니다.

const SOURCES = {
  restricted: {
    label: "Kraken Support · Why is my account restricted?",
    url: "https://support.kraken.com/articles/why-is-my-account-restricted",
  },
  request: {
    label: "Kraken Support · Responding to a request for additional information",
    url: "https://support.kraken.com/articles/responding-to-request-for-additional-information",
  },
  sourceOfFunds: {
    label: "Kraken Support · Why do we ask for Source of Wealth or Source of Funds Documents?",
    url: "https://support.kraken.com/articles/source-of-wealth-or-source-of-funds-documents",
  },
  protective: {
    label: "Kraken Support · Why does my account have temporary protective measures?",
    url: "https://support.kraken.com/articles/why-does-my-account-have-temporary-protective-measures",
  },
  closure: {
    label: "Kraken Support · Account Closures: Safeguarding Our Clients and Kraken",
    url: "https://support.kraken.com/articles/account-closures-safeguarding-our-clients-and-kraken",
  },
} as const;

export const kraken: ExchangeProfile = {
  id: "kraken",
  name: "Kraken",
  group: "intl",
  status: "verified",
  language: "en",
  channel: "Kraken 웹사이트의 추가 정보 요청 화면 (웹 브라우저에서만 답할 수 있음)",
  reviewPeriod: "보통 제한일부터 10~14영업일 (제출 기한이 아니라 심사 기간)",
  requestedDocuments: ["depositReason", "bankRecords", "otherExchangeRecords", "exchangeRecords"],
  fields: [
    {
      label: "요청 받는 곳",
      value: "추가 정보가 필요하면 이메일과 앱 알림으로 알립니다. 앱이나 웹사이트의 안내를 따릅니다.",
      status: "verified",
      source: SOURCES.restricted,
    },
    {
      label: "제출 창구",
      value:
        "추가 정보 요청은 현재 웹 브라우저에서만 보고 답할 수 있습니다. 요청의 항목마다 질문에 답하거나 문서를 올리고, 항목별로 따로 제출합니다.",
      status: "verified",
      source: SOURCES.request,
    },
    {
      label: "제출 기한",
      value:
        "요청마다 완료해야 하는 날짜가 적혀 있고, 그 전에 알림을 보냅니다. 기한 안에 답하지 않으면 거래나 입금 같은 일부 기능이 멈출 수 있습니다(출금은 영향 없음). 기한이 부족하면 만료 전에 연락합니다.",
      status: "verified",
      source: SOURCES.request,
    },
    {
      label: "제출 후 상태",
      value:
        "보낸 항목은 Submitted로, 검토가 끝나면 Reviewed로 바뀝니다. 문서가 불분명하거나 요청한 기간을 다 담지 않으면 Needs update와 사유가 표시되고 이메일이 옵니다.",
      status: "verified",
      source: SOURCES.request,
    },
    {
      label: "요청 자료",
      value:
        "자금 출처(source of funds)와 재산 형성 경위(source of wealth) 서류를 요청할 수 있습니다. 자금이 이미 Kraken 계정에 있으면, 그 자금이나 가상자산이 Kraken 계정으로 들어왔음을 보여 주는 문서도 냅니다.",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "가상자산 자료",
      value:
        "외부 가상자산거래소 명세서(이름, 이메일 ID, 지갑 주소, 잔액이 보이는 것)와 그 자산의 원래 출처를 보여 주는 문서를 받습니다.",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "서류 조건",
      value:
        "파일 형식은 .pdf .png .jpg .jpeg .doc .docx입니다. 24개월 안의 날짜가 있어야 합니다(예외 있음). 문서의 주소는 Kraken 프로필의 주소와 같아야 하고, 사서함(P.O. Box) 주소는 받지 않습니다. 계좌번호 같은 민감한 정보는 가려도 되지만 이름, 발행처 이름 · 로고, 명세서 · 거래 날짜, 잔액, 거래 금액은 보여야 합니다. 잔액이 0인 명세서는 받지 않습니다.",
      status: "verified",
      source: SOURCES.sourceOfFunds,
    },
    {
      label: "심사 기간",
      value:
        "보통 제한일부터 10~14영업일이고, 바쁠 때는 더 걸릴 수 있습니다. 14영업일이 지나도 연락이 없으면 채팅 지원으로 문의합니다. 제출 기한이 아니라 심사 기간입니다.",
      status: "verified",
      source: SOURCES.restricted,
    },
    {
      label: "심사 중",
      value: "계정 심사를 마칠 때까지 법정화폐와 가상자산의 입출금을 처리하지 않습니다.",
      status: "verified",
      source: SOURCES.restricted,
    },
    {
      label: "사기 보호 조치",
      value:
        "임시 보호 조치(temporary protective measures)라면 가상자산 출금이 멈추고 자산은 잔액에 남습니다. 최소 기간(최대 90일) 동안 유지되며 고객지원도 그 전에 풀 수 없습니다. 채팅으로 계정 검토를 요청합니다.",
      status: "verified",
      source: SOURCES.protective,
    },
    {
      label: "계정 종료 시",
      value:
        "종료 결정은 대체로 최종입니다. 잘못 종료됐다고 보면 지원팀이 두 번째 검토로 올릴 수 있고, 결정이 바뀌면 이메일로 알립니다. 이의 창구와 기한은 따로 안내되어 있지 않습니다.",
      status: "verified",
      source: SOURCES.closure,
    },
    {
      label: "요청하지 않은 입금",
      value: "보낸 사람이 임의로 보낸 가상자산 입금을 어떻게 처리하는지는 공개 자료에서 찾지 못했습니다.",
      status: "check",
    },
    {
      label: "주의",
      value:
        "Kraken은 비밀번호, 2FA 코드, 복구 문구(recovery phrase)를 묻지 않고, 다른 주소로 자금을 옮기라고 하지 않습니다.",
      status: "caution",
      source: SOURCES.request,
    },
  ],
  checkedAt: "2026-11-07",
};
