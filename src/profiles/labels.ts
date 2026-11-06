import type {
  AppealRequestType,
  DocumentStatus,
  ObjectionGround,
  RestrictionScope,
  RestrictionType,
} from "@/types/case";

// 화면과 보고서가 같이 쓰는 이름

export const RESTRICTION_LABELS: Record<RestrictionType, string> = {
  internal: "거래소 내부 심사",
  sanction: "제재에 따른 자산 동결",
  phishing: "보이스피싱 법정 지급정지",
  unknown: "아직 모름",
};

export const RESTRICTION_DESCRIPTIONS: Record<RestrictionType, string> = {
  internal: "거래소가 자체 기준으로 입출금이나 계정을 막고 자료를 요청한 경우",
  sanction: "제재 대상과 연결된 자금이라 법에 따라 동결한 경우",
  phishing: "피해 신고가 들어와 법에 따라 지급정지된 경우",
  unknown: "통지에 유형이 없거나 무슨 제한인지 알기 어려운 경우",
};

export const SCOPE_LABELS: Record<RestrictionScope, string> = {
  deposit: "문제 입금만 반영 안 됨",
  withdraw: "출금 제한",
  account: "계정 전체 제한",
  unknown: "모름",
};

export const REQUEST_TYPE_LABELS: Record<AppealRequestType, { label: string; description: string }> = {
  account: {
    label: "계정 · 기존 잔액 재검토",
    description: "문제 입금 보류는 그대로 두고, 기존 잔액과 계정 기능을 다시 봐 달라고 요청합니다. 대부분 이쪽이 현실적입니다.",
  },
  fund: {
    label: "문제 입금 보류 해제",
    description: "문제 입금을 보류한 근거를 묻고, 근거에 오류가 있으면 해제를 요청합니다.",
  },
};

export const OBJECTION_LABELS: Record<ObjectionGround, { label: string; description: string }> = {
  notUsed: {
    label: "계정이 사기에 이용되지 않음",
    description: "요청하지 않은 입금이라면 보통 이쪽입니다. 보낸 사람과 거래 관계가 없었다는 자료가 중요합니다.",
  },
  legitimate: {
    label: "정당한 권원으로 받음",
    description:
      "정상적인 거래대금처럼 정당하게 받은 돈인 경우입니다. 명의인이 사기 이용 사실을 알았거나 중대한 과실로 몰랐다고 인정되면 이 사유는 제한됩니다.",
  },
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  onchain: "온체인 기록",
  statement: "사용자 설명",
  ready: "준비함",
  needed: "준비 필요",
};
