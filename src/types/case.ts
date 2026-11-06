// 화면과 서버가 주고받는 데이터 모양 (API 계약)
// 바꿀 때는 docs/api.md도 같이 고치고, PR에 "계약 변경"이라고 적어주세요.

export type ChainId = 1; // MVP: Ethereum Mainnet만
export type AssetType = "native" | "erc20";
export type DataProvider = "demo" | "alchemy" | "upbit" | "binance";
export type CaseStep = "situation" | "transaction" | "analysis" | "statement" | "report";

// ── 온체인 전송 1건 ─────────────────────────────────────────
// 같은 거래 안에 토큰 전송이 여러 개일 수 있어서 id는 txHash:eventIndex
export interface Transfer {
  id: string;
  chainId: ChainId;
  txHash: string;
  eventIndex: number; // ETH 직접 전송은 0, ERC-20은 로그 번호
  blockNumber: number;
  timestamp: string; // ISO 8601 (UTC)
  from: string;
  to: string;
  assetType: AssetType;
  asset: string; // 화면 표시용 심볼 (ETH, USDC …)
  contractAddress: string | null; // ETH면 null
  rawValue: string; // 소수점 없는 정수 문자열 (계산은 이 값으로)
  decimals: number;
  displayValue: string; // 화면 표시용 (계산에 쓰지 않기)
  sourceProvider: DataProvider;
  fetchedAt: string;
  explorerUrl: string;
}

// ── 거래소 입금 목록 1건 ────────────────────────────────────
export type ExchangeSource = "upbit" | "binance";

export interface ExchangeDeposit {
  id: string;
  exchange: ExchangeSource;
  asset: string;
  network: string;
  amount: string;
  txHash: string | null; // 거래소 내부 이체면 없음
  state: string;
  createdAt: string;
  sourceAddress: string | null; // 바이낸스만 제공. 업비트는 null
}

// ── 조사 결과 ──────────────────────────────────────────────
// verified     = 확인된 기록 (온체인에 그대로 있는 사실)
// derived      = 분석한 정황 (기록을 세거나 비교해서 나온 것)
// unverifiable = 확인할 수 없음 (온체인으로 원래 알 수 없거나, 조회 범위 밖)
// 사용자 설명은 UserStatement로 따로 받습니다.
export type EvidenceCategory = "verified" | "derived" | "unverifiable";

// 어느 분석에서 나온 항목인지 (노션 A~E + 제재 목록)
export type AnalysisCode = "A" | "B" | "C" | "D" | "E" | "S";

export interface SourceRef {
  label: string;
  txHash?: string;
  url?: string;
}

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  analysis: AnalysisCode;
  title: string; // 문장 규칙: docs/writing-rules.md
  description: string;
  sources: SourceRef[]; // verified·derived는 최소 1개 필수
}

export interface AnalysisScope {
  windowLabel: string; // 예: "입금 전후 24시간"
  windowStart: string;
  windowEnd: string;
  maxTransfers: number; // 조회 상한
  fetchedTransfers: number; // 실제로 가져온 건수
  complete: boolean; // 상한에 걸리면 false → 화면·보고서에 "일부만 조회" 표시
  provider: DataProvider;
  fetchedAt: string;
  failures: string[]; // 조회에 실패한 범위 (없으면 빈 배열)
}

export interface SanctionsCheck {
  listName: string;
  listUpdatedAt: string;
  checkedAt: string;
  senderMatched: boolean; // false여도 "제재 주소가 아님"이라고 쓰지 않기
}

export interface CaseFacts {
  priorDirectTransactions: number; // B: 입금 전 두 주소 사이 직접 거래 수
  senderRecipientCount: number; // C: 조사 범위에서 보낸 사람이 보낸 고유 주소 수
  similarAmountCount: number; // C: 그중 비슷한 금액(±10%) 건수
  returnedToSender: boolean; // D: 입금 후 보낸 사람에게 다시 보낸 기록
  firstOutgoingAfter: Transfer | null; // D: 입금 후 처음 나간 전송 (순서만 말할 수 있음)
}

export interface GraphNode {
  id: string;
  label: string;
  detail: string;
  role: "subject" | "sender" | "recipient";
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  emphasized?: boolean;
}

export interface CaseAnalysis {
  caseId: string;
  version: string;
  walletAddress: string;
  transfer: Transfer;
  scope: AnalysisScope;
  facts: CaseFacts;
  sanctions: SanctionsCheck;
  evidence: EvidenceItem[]; // 사용자가 빼거나 고칠 수 없음
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── 사용자 설명 ────────────────────────────────────────────
// null = 아직 답하지 않음 → 보고서에 "미확인"
export type Answer = "no" | "yes" | "unknown" | null;

export interface StatementAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface UserStatement {
  requestedTransfer: Answer;
  knowsSender: Answer;
  hadPurpose: Answer;
  discoveredAt: string; // 비어 있으면 "미확인"
  note: string;
  attachments: StatementAttachment[]; // 사용자가 고를 수 있는 건 첨부뿐
}

// ── 제출 정보 ──────────────────────────────────────────────
// 여기서 말하는 거래소는 "어디에 소명하나"(src/profiles/)입니다.
// 위의 ExchangeSource는 "입금 목록을 어디서 불러오나"(src/server/exchanges/)라서 다른 목록입니다.
export type ExchangeGroup = "kr" | "intl"; // 국내 원화 거래소 / 해외 거래소

export type ProfiledExchangeId =
  | "upbit"
  | "bithumb"
  | "coinone"
  | "korbit"
  | "gopax"
  | "kr-other"
  | "kraken"
  | "coinbase"
  | "binance"
  | "intl-other";

export type ExchangeId = "unspecified" | ProfiledExchangeId;

// 어떤 제한을 받았는지에 따라 제출처와 기한이 먼저 갈립니다 (리서치 5-2)
//   internal = 거래소 내부 심사, sanction = 제재에 따른 자산 동결,
//   phishing = 보이스피싱 법정 지급정지, unknown = 아직 모름
export type RestrictionType = "internal" | "sanction" | "phishing" | "unknown";

// 어디까지 막혔는지
export type RestrictionScope = "deposit" | "withdraw" | "account" | "unknown";

// 무엇을 다시 봐 달라고 할지 (내부 심사 · 제재 동결)
//   account = 문제 입금 보류는 두고 기존 잔액과 계정 기능을 재검토, fund = 문제 입금 보류 해제
export type AppealRequestType = "account" | "fund";

// 보이스피싱 지급정지 이의 사유 (통신사기피해환급법, 리서치 5-2)
//   notUsed = 계정이 사기에 이용되지 않음, legitimate = 정당한 권원으로 받음
export type ObjectionGround = "notUsed" | "legitimate";

export interface SubmissionDetails {
  exchange: ExchangeId;
  restrictionType: RestrictionType;
  scope: RestrictionScope;
  noticeDate: string; // 제한 통지를 받은 날. YYYY-MM-DD, 모르면 ""
  // internal → 거래소 통지에 적힌 자료 제출 기한, phishing → 채권소멸절차 개시 공고일
  // 그 밖의 유형에서는 쓰지 않습니다. YYYY-MM-DD, 모르면 ""
  baseDate: string;
  requestText: string; // 거래소에서 받은 요청 문구 (선택)
  requestType: AppealRequestType;
  objectionGround: ObjectionGround;
  availableDocuments: AppealDocumentId[]; // 사용자가 준비했다고 표시한 자료 (파일은 올리지 않음)
}

// ── 거래소 프로필 (소명 절차) ─────────────────────────────────
// verified = 공개 자료로 칸을 채움, research = 아직 리서치 중(공통 칸만 적용),
// fallback = 프로필이 없는 거래소(그 외 국내 / 그 외 해외)
export type ProfileStatus = "verified" | "research" | "fallback";

// 칸 하나의 상태: verified = 공개 자료로 확인, check = 확인 필요, caution = 주의 안내
export type FieldStatus = "verified" | "check" | "caution";

export type DocumentLanguage = "ko" | "en";

export type AppealDocumentId =
  | "txHash"
  | "depositReason"
  | "bankRecords"
  | "otherExchangeRecords"
  | "exchangeRecords"
  | "counterpartyRecords";

export interface ProfileSource {
  label: string;
  url?: string;
}

export interface ProfileField {
  label: string;
  value: string;
  status: FieldStatus;
  source?: ProfileSource; // status가 verified면 필수
}

// 국내 · 해외 공통 칸. 거래소별 칸이 비어 있어도 이 칸은 적용됩니다.
export interface ExchangeGroupProfile {
  id: ExchangeGroup;
  name: string;
  language: DocumentLanguage;
  requestedDocuments: AppealDocumentId[];
  fields: ProfileField[];
}

export interface ExchangeProfile {
  id: ProfiledExchangeId;
  name: string;
  group: ExchangeGroup;
  status: ProfileStatus;
  language: DocumentLanguage; // 소명서 기본 언어
  channel: string; // 제출 창구
  reviewPeriod: string | null; // 거래소가 안내한 심사 기간 (제출 기한이 아님)
  requestedDocuments: AppealDocumentId[];
  fields: ProfileField[]; // 거래소별 칸
  checkedAt: string | null; // 마지막으로 공개 자료를 확인한 날
}

// 제한 유형 + 거래소 프로필 + 기준일로 계산한 제출 경로 (src/profiles/route.ts)
export type DeadlineStatus = "set" | "soon" | "passed" | "unknown";

export interface SubmissionRoute {
  submitTo: string;
  deadline: {
    text: string;
    date: string | null; // YYYY-MM-DD, 정할 수 없으면 null
    status: DeadlineStatus;
  };
  reviewPeriod: string | null;
  notes: string[];
}

// ── 보고서 ────────────────────────────────────────────────
// 제출 자료 목록의 상태
//   onchain = 이 자료의 온체인 기록과 원본 링크, statement = 사용자 설명,
//   ready = 사용자가 준비했다고 표시, needed = 아직 준비하지 않음
export type DocumentStatus = "onchain" | "statement" | "ready" | "needed";

export interface ReportDocument {
  id: AppealDocumentId;
  label: string;
  status: DocumentStatus;
  note: string; // 예: "업비트 요청 항목" (없으면 "")
}

export interface CaseReport {
  generatedAt: string;
  analysisVersion: string;
  title: string; // 제한 유형과 요청 유형에 따라 달라짐
  summary: string;
  request: string;
  documents: ReportDocument[];
  additionalDocuments: string[];
  route: SubmissionRoute; // 어디에, 언제까지 낼지
}
