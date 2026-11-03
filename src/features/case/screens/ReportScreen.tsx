import { shortAddress } from "@/features/case/utils";
import type {
  CaseAnalysis,
  CaseReport,
  RequestContext,
  Transfer,
  UserStatement,
} from "@/types/case";

interface ReportScreenProps {
  context: RequestContext;
  walletAddress: string;
  transfer?: Transfer;
  analysis?: CaseAnalysis;
  statement: UserStatement;
  report?: CaseReport;
  includedEvidenceIds: string[];
  onBack: () => void;
  onRestart: () => void;
}

const exchangeLabels = {
  upbit: "Upbit",
  coinbase: "Coinbase",
  binance: "Binance",
  kraken: "Kraken",
  other: "기타 거래소",
} as const;

const statementLabel = (value: "no" | "yes" | "unknown") => {
  if (value === "no") return "아니요";
  if (value === "yes") return "예";
  return "잘 모름";
};

export function ReportScreen({
  context,
  walletAddress,
  transfer,
  analysis,
  statement,
  report,
  includedEvidenceIds,
  onBack,
  onRestart,
}: ReportScreenProps) {
  if (!transfer || !analysis || !report) return null;
  const includedEvidence = analysis.evidence.filter((item) => includedEvidenceIds.includes(item.id));

  return (
    <section className="screen-section report-screen" aria-labelledby="report-title">
      <div className="section-heading compact-heading report-page-heading">
        <div>
          <h1 id="report-title">소명 자료</h1>
          <p>제출 전 내용을 확인하세요.</p>
        </div>
        <span className="draft-mark">초안 · 검토 필요</span>
      </div>

      <div className="report-layout">
        <article className="report-paper">
          <header>
            <div>
              <p>거래 경위 소명 자료</p>
              <h2>원치 않은 의심 입금 관련 검토 요청</h2>
            </div>
            <span>{analysis.caseId}</span>
          </header>

          <dl className="report-metadata">
            <div><dt>제출 대상</dt><dd>{exchangeLabels[context.exchange]}</dd></div>
            <div><dt>대상 지갑</dt><dd>{shortAddress(walletAddress, 10, 8)}</dd></div>
            <div><dt>문제 거래</dt><dd>{shortAddress(transfer.txHash, 10, 8)}</dd></div>
            <div><dt>입금 금액</dt><dd>{transfer.amount} {transfer.asset}</dd></div>
          </dl>

          <section className="report-copy">
            <h3>요청 요약</h3>
            <p>{report.summary}</p>
          </section>

          <section className="report-copy">
            <h3>확인된 사실과 분석 정황</h3>
            <ol>
              {includedEvidence.map((item) => (
                <li key={item.id}>
                  <b>{item.title}</b>
                  <span>{item.description}</span>
                  <small>{item.sourceLabel}</small>
                </li>
              ))}
            </ol>
          </section>

          <section className="report-copy statement-box">
            <h3>사용자 진술</h3>
            <dl>
              <div><dt>입금 요청 여부</dt><dd>{statementLabel(statement.requestedTransfer)}</dd></div>
              <div><dt>발신자 인지 여부</dt><dd>{statementLabel(statement.knowsSender)}</dd></div>
              <div><dt>거래 목적 존재 여부</dt><dd>{statementLabel(statement.hadPurpose)}</dd></div>
              <div><dt>입금 확인일</dt><dd>{statement.discoveredAt}</dd></div>
            </dl>
            {statement.note ? <p>{statement.note}</p> : null}
            {statement.attachments.length > 0 ? (
              <div className="report-attachments">
                <b>첨부 자료</b>
                <ul>
                  {statement.attachments.map((attachment) => (
                    <li key={attachment.id}>{attachment.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="report-copy report-request">
            <h3>검토 요청</h3>
            <p>{report.request}</p>
          </section>

          <footer>
            <span>데이터 조회 시각: 2026-11-03 10:30 KST</span>
            <span>분석 버전: mock-0.1</span>
          </footer>
        </article>

        <aside className="submission-panel">
          <div>
            <h2>{exchangeLabels[context.exchange]} 추가 자료</h2>
            <p>요청받은 항목과 대조하세요.</p>
          </div>
          <ul>
            {report.additionalDocuments.map((document) => <li key={document}>{document}</li>)}
          </ul>
          <div className="submission-warning">
            <b>확인</b>
            <p>이 자료는 거래소의 제한 해제를 보장하지 않습니다.</p>
          </div>
          <button className="primary-button full-button" type="button" onClick={() => window.print()}>
            PDF로 저장
          </button>
          <button className="secondary-button full-button" type="button" onClick={() => navigator.clipboard?.writeText(report.request)}>
            제출 문안 복사
          </button>
        </aside>
      </div>

      <div className="screen-actions report-actions">
        <button className="secondary-button" type="button" onClick={onBack}>내용 수정</button>
        <button className="secondary-button" type="button" onClick={onRestart}>처음부터</button>
      </div>
    </section>
  );
}
