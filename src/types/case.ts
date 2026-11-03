export type ExchangeId = "upbit" | "coinbase" | "binance" | "kraken" | "other";

export type RequestType =
  | "specific-deposit"
  | "suspicious-relation"
  | "source-of-funds"
  | "wallet-ownership"
  | "unknown";

export type CaseStep = "request" | "transaction" | "analysis" | "statement" | "report";

export interface RequestContext {
  exchange: ExchangeId;
  requestType: RequestType;
  requestText: string;
}

export interface Transfer {
  id: string;
  txHash: string;
  from: string;
  to: string;
  asset: string;
  amount: string;
  timestamp: string;
  direction: "in" | "out";
  reviewReason?: string;
}

export type EvidenceKind = "verified" | "derived" | "unknown";

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  title: string;
  description: string;
  sourceLabel: string;
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
  windowLabel: string;
  priorDirectTransactions: number;
  senderRecipientCount: number;
  similarAmountCount: number;
  returnedToSender: boolean;
  evidence: EvidenceItem[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface UserStatement {
  requestedTransfer: "no" | "yes" | "unknown";
  knowsSender: "no" | "yes" | "unknown";
  hadPurpose: "no" | "yes" | "unknown";
  discoveredAt: string;
  note: string;
  attachments: StatementAttachment[];
}

export interface StatementAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface CaseReport {
  generatedAt: string;
  summary: string;
  request: string;
  additionalDocuments: string[];
}
