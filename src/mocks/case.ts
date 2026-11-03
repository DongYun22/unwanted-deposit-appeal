import type {
  CaseAnalysis,
  CaseReport,
  SubmissionDetails,
  Transfer,
  UserStatement,
} from "@/types/case";

export const DEMO_WALLET = "0x1111111111111111111111111111111111111111";

export const mockTransfers: Transfer[] = [
  {
    id: "tx-review",
    txHash: "0x9999999999999999999999999999999999999999999999999999999999990001",
    from: "0x9999999999999999999999999999999999999999",
    to: DEMO_WALLET,
    asset: "ETH",
    amount: "0.001",
    timestamp: "2026-10-28T14:22:13Z",
    direction: "in",
    reviewReason: "거래소에서 설명을 요청한 입금",
  },
  {
    id: "tx-known",
    txHash: "0x8888888888888888888888888888888888888888888888888888888888880002",
    from: "0x2222222222222222222222222222222222222222",
    to: DEMO_WALLET,
    asset: "ETH",
    amount: "0.42",
    timestamp: "2026-10-22T09:14:02Z",
    direction: "in",
  },
  {
    id: "tx-usdc",
    txHash: "0x7777777777777777777777777777777777777777777777777777777777770003",
    from: "0x3333333333333333333333333333333333333333",
    to: DEMO_WALLET,
    asset: "USDC",
    amount: "1,250",
    timestamp: "2026-10-14T05:48:39Z",
    direction: "in",
  },
];

export const mockAnalysis: CaseAnalysis = {
  caseId: "CASE-DEMO-1028",
  windowLabel: "문제 거래 전후 24시간",
  priorDirectTransactions: 0,
  senderRecipientCount: 286,
  similarAmountCount: 241,
  returnedToSender: false,
  evidence: [
    {
      id: "evidence-transfer",
      kind: "verified",
      title: "선택한 주소가 0.001 ETH를 수신했습니다",
      description: "2026년 10월 28일 23:22 KST에 문제 발신 주소에서 입금됐습니다.",
      sourceLabel: "거래 해시 · 블록 기록",
    },
    {
      id: "evidence-prior",
      kind: "verified",
      title: "문제 거래 이전의 직접 거래가 확인되지 않았습니다",
      description: "조회 시작 시점부터 문제 거래 직전까지 두 주소 사이의 직접 전송은 0건입니다.",
      sourceLabel: "대상 지갑·발신자 거래 기록",
    },
    {
      id: "evidence-spread",
      kind: "derived",
      title: "발신자는 24시간 동안 286개 주소로 송금했습니다",
      description: "그중 241건이 문제 금액의 ±10% 범위에 해당합니다.",
      sourceLabel: "발신자 거래 286건 분석",
    },
    {
      id: "evidence-return",
      kind: "verified",
      title: "이후 해당 발신자에게 보낸 직접 거래는 없습니다",
      description: "문제 입금 이후 7일 동안 문제 발신자로 향한 직접 전송은 확인되지 않았습니다.",
      sourceLabel: "입금 이후 거래 기록",
    },
    {
      id: "evidence-label",
      kind: "unknown",
      title: "발신 주소의 실제 소유자는 확인되지 않았습니다",
      description: "온체인 기록만으로 발신자의 신원이나 송금 의도를 확정할 수 없습니다.",
      sourceLabel: "추가 확인 필요",
    },
  ],
  nodes: [
    { id: "sender", label: "문제 발신자", detail: "0x9999…9999", role: "sender", x: 90, y: 150 },
    { id: "subject", label: "내 지갑", detail: "0x1111…1111", role: "subject", x: 330, y: 150 },
    { id: "r1", label: "다른 수신 주소", detail: "0x4444…4444", role: "recipient", x: 570, y: 54 },
    { id: "r2", label: "다른 수신 주소", detail: "0x5555…5555", role: "recipient", x: 570, y: 150 },
    { id: "r3", label: "다른 수신 주소", detail: "0x6666…6666", role: "recipient", x: 570, y: 246 },
  ],
  edges: [
    { id: "s-subject", from: "sender", to: "subject", label: "0.001 ETH", emphasized: true },
    { id: "s-r1", from: "sender", to: "r1", label: "0.001 ETH" },
    { id: "s-r2", from: "sender", to: "r2", label: "0.0009 ETH" },
    { id: "s-r3", from: "sender", to: "r3", label: "0.001 ETH" },
  ],
};

export function makeMockReport(
  statement: UserStatement,
  submission: SubmissionDetails,
): CaseReport {
  const additionalDocuments = [
    ...(submission.requestText.trim() ? ["거래소에서 받은 소명 요청 원문"] : []),
    ...(submission.exchange !== "unspecified"
      ? ["제출 계정 정보가 확인되는 화면"]
      : []),
    statement.attachments.length > 0
      ? `사용자가 첨부한 관련 자료 ${statement.attachments.length}개`
      : "관련 자료가 있다면 추가 첨부",
  ];

  return {
    generatedAt: "2026-11-03T10:30:00+09:00",
    summary:
      "선택한 지갑은 문제 발신 주소로부터 0.001 ETH를 수신했습니다. 조회 범위에서 두 주소 사이의 이전 직접 거래와 입금 이후 발신자에게 돌아간 직접 전송은 확인되지 않았습니다. 같은 발신자는 24시간 동안 다수 주소에 유사한 금액을 전송했습니다.",
    request:
      "위 온체인 기록과 사용자 진술을 바탕으로 해당 입금의 경위 및 계정 제한을 재검토해 주시기 바랍니다.",
    additionalDocuments,
  };
}
