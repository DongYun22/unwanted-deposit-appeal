import type { AppealDocumentId } from "@/types/case";

// 소명할 때 낼 수 있는 자료 이름. 프로필의 requestedDocuments가 이 키를 씁니다.
export const DOCUMENT_LABELS: Record<AppealDocumentId, string> = {
  txHash: "문제 입금 거래 해시(TxID)",
  depositReason: "입금 경위 설명",
  bankRecords: "금융기관 거래내역 · 이체확인증",
  otherExchangeRecords: "다른 가상자산거래소 거래내역",
  exchangeRecords: "이 거래소의 입출금 · 거래내역",
  counterpartyRecords: "상대방 연락 기록 · 주문 내역",
};
