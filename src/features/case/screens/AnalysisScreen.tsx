import { EvidenceGraph } from "@/features/case/EvidenceGraph";
import { shortAddress } from "@/features/case/utils";
import type { CaseAnalysis, Transfer } from "@/types/case";

interface AnalysisScreenProps {
  transfer?: Transfer;
  analysis?: CaseAnalysis;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

const kindLabels = {
  verified: "온체인 확인",
  derived: "분석 정황",
  unknown: "확인 필요",
} as const;

export function AnalysisScreen({ transfer, analysis, loading, onBack, onNext }: AnalysisScreenProps) {
  if (loading || !transfer || !analysis) {
    return (
      <section className="analysis-loading" aria-live="polite">
        <div className="analysis-pulse" />
        <h1>거래 분석 중</h1>
        <p>이전 거래와 유사 송금 기록을 확인합니다.</p>
      </section>
    );
  }

  return (
    <section className="screen-section analysis-screen" aria-labelledby="analysis-title">
      <div className="section-heading compact-heading">
        <h1 id="analysis-title">거래 분석</h1>
        <p>문제 입금과 직접 관련된 기록입니다.</p>
      </div>

      <div className="case-strip">
        <span>
          <small>문제 거래</small>
          <b>{transfer.amount} {transfer.asset}</b>
        </span>
        <span>
          <small>발신 주소</small>
          <b>{shortAddress(transfer.from, 9, 7)}</b>
        </span>
        <span>
          <small>분석 범위</small>
          <b>{analysis.windowLabel}</b>
        </span>
        <button type="button" className="source-button">거래 원문 보기</button>
      </div>

      <div className="analysis-layout">
        <div className="analysis-primary">
          <div className="panel-heading simple-panel-heading">
            <div>
              <h2>거래 관계</h2>
              <p>문제 거래와 유사 송금 주소만 표시합니다.</p>
            </div>
          </div>
          <EvidenceGraph analysis={analysis} />

          <div className="fact-table" aria-label="분석 요약">
            <div><span>이전 직접 거래</span><b>{analysis.priorDirectTransactions}건</b></div>
            <div><span>발신자의 고유 수신 주소</span><b>{analysis.senderRecipientCount}개</b></div>
            <div><span>유사 금액 송금</span><b>{analysis.similarAmountCount}건</b></div>
            <div><span>발신자에게 직접 회신</span><b>{analysis.returnedToSender ? "확인됨" : "확인되지 않음"}</b></div>
          </div>
        </div>

        <aside className="evidence-panel">
          <div className="panel-heading simple-panel-heading">
            <div>
              <h2>조사 결과</h2>
              <p>{analysis.evidence.length}개 항목</p>
            </div>
          </div>
          <div className="evidence-list">
            {analysis.evidence.map((item) => (
              <article key={item.id} className={`evidence-item evidence-${item.kind}`}>
                <span>{kindLabels[item.kind]}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button type="button">{item.sourceLabel}</button>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <div className="screen-actions">
        <button className="secondary-button" type="button" onClick={onBack}>이전</button>
        <button className="primary-button" type="button" onClick={onNext}>내 설명</button>
      </div>
    </section>
  );
}
