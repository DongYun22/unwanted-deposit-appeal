import { useState } from "react";
import { SourceLinks } from "@/features/case/SourceLinks";
import { DOCUMENT_STATUS_LABELS, RESTRICTION_LABELS, SCOPE_LABELS, exchangeLabel } from "@/profiles";
import {
  answerLabel,
  categoryLabels,
  formatKoreanDateTime,
  providerLabels,
  shortAddress,
} from "@/features/case/utils";
import type {
  CaseAnalysis,
  CaseReport,
  EvidenceCategory,
  SubmissionDetails,
  UserStatement,
} from "@/types/case";

interface ReportScreenProps {
  submission: SubmissionDetails;
  analysis?: CaseAnalysis;
  statement: UserStatement;
  report?: CaseReport;
  onBack: () => void;
  onRestart: () => void;
}

// "제출 문안 복사"용 글자 버전. 화면의 소명서와 같은 순서로 씁니다.
function reportText(report: CaseReport, analysis: CaseAnalysis, statement: UserStatement, submission: SubmissionDetails) {
  const lines = [
    report.title,
    `${RESTRICTION_LABELS[submission.restrictionType]} · ${SCOPE_LABELS[submission.scope]}`,
    `제출처: ${report.route.submitTo}`,
    `기한: ${report.route.deadline.text}`,
    `대상 지갑: ${analysis.walletAddress}`,
    `문제 거래: ${analysis.transfer.txHash}`,
    "",
    "요약",
    report.summary,
  ];
  for (const category of ["verified", "derived", "unverifiable"] as const) {
    const items = analysis.evidence.filter((item) => item.category === category);
    if (items.length === 0) continue;
    lines.push("", categoryLabels[category]);
    for (const item of items) {
      const link = item.sources.find((source) => source.url)?.url;
      lines.push(`- ${item.title}. ${item.description}${link ? ` (${link})` : ""}`);
    }
  }
  lines.push(
    "",
    "사용자 설명 (온체인 기록으로 확인한 사실이 아님)",
    `- 입금을 요청했나: ${answerLabel(statement.requestedTransfer)}`,
    `- 보낸 사람을 아나: ${answerLabel(statement.knowsSender)}`,
    `- 거래 목적이 있었나: ${answerLabel(statement.hadPurpose)}`,
    `- 처음 알게 된 날: ${statement.discoveredAt || "미확인"}`,
  );
  if (statement.note.trim()) lines.push(`- ${statement.note.trim()}`);
  lines.push("", "제출 자료");
  for (const document of report.documents) {
    lines.push(`- ${document.label}: ${DOCUMENT_STATUS_LABELS[document.status]}${document.note ? ` · ${document.note}` : ""}`);
  }
  lines.push("", "요청 사항", report.request);
  return lines.join("\n");
}

function EvidenceSection({ analysis, category }: { analysis: CaseAnalysis; category: EvidenceCategory }) {
  const items = analysis.evidence.filter((item) => item.category === category);
  if (items.length === 0) return null;

  return (
    <section className={`report-copy report-${category}`}>
      <h3>{categoryLabels[category]}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <b>{item.title}</b>
            <span>{item.description}</span>
            <SourceLinks sources={item.sources} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ReportScreen({ submission, analysis, statement, report, onBack, onRestart }: ReportScreenProps) {
  const [copyState, setCopyState] = useState<string>();
  if (!analysis || !report) return null;
  const { transfer, scope, walletAddress } = analysis;
  const hasExchange = submission.exchange !== "unspecified";

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(reportText(report, analysis, statement, submission));
      setCopyState("소명서 전체를 복사했습니다.");
    } catch {
      setCopyState("이 브라우저에서는 복사가 막혀 있습니다. PDF로 저장해 주세요.");
    }
  };

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
              <p>{RESTRICTION_LABELS[submission.restrictionType]} · {SCOPE_LABELS[submission.scope]}</p>
              <h2>{report.title}</h2>
            </div>
            <span>{analysis.caseId}</span>
          </header>

          <dl className={hasExchange ? "report-metadata" : "report-metadata is-three-columns"}>
            {hasExchange ? (
              <div><dt>제출 대상</dt><dd>{exchangeLabel(submission.exchange)}</dd></div>
            ) : null}
            <div><dt>대상 지갑</dt><dd>{shortAddress(walletAddress, 10, 8)}</dd></div>
            <div><dt>문제 거래</dt><dd>{shortAddress(transfer.txHash, 10, 8)}</dd></div>
            <div><dt>입금 금액</dt><dd>{transfer.displayValue} {transfer.asset}</dd></div>
          </dl>

          <section className="report-copy">
            <h3>요약</h3>
            <p>{report.summary}</p>
          </section>

          {submission.requestText.trim() ? (
            <section className="report-copy request-source">
              <h3>거래소 요청 내용</h3>
              <p>{submission.requestText}</p>
            </section>
          ) : null}

          <EvidenceSection analysis={analysis} category="verified" />
          <EvidenceSection analysis={analysis} category="derived" />

          <section className="report-copy statement-box">
            <h3>사용자 설명</h3>
            <p className="statement-caption">아래는 사용자가 직접 답한 내용이며, 온체인 기록으로 확인한 사실이 아닙니다.</p>
            <dl>
              <div><dt>입금을 요청했나</dt><dd>{answerLabel(statement.requestedTransfer)}</dd></div>
              <div><dt>보낸 사람을 아나</dt><dd>{answerLabel(statement.knowsSender)}</dd></div>
              <div><dt>거래 목적이 있었나</dt><dd>{answerLabel(statement.hadPurpose)}</dd></div>
              <div><dt>처음 알게 된 날</dt><dd>{statement.discoveredAt || "미확인"}</dd></div>
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

          <EvidenceSection analysis={analysis} category="unverifiable" />

          <section className="report-copy">
            <h3>조사 범위</h3>
            <dl className="scope-box report-scope">
              <div><dt>조사 기간</dt><dd>{scope.windowLabel} ({formatKoreanDateTime(scope.windowStart)} ~ {formatKoreanDateTime(scope.windowEnd)})</dd></div>
              <div>
                <dt>조회 건수</dt>
                <dd>
                  {scope.fetchedTransfers.toLocaleString("en-US")}건 (상한 {scope.maxTransfers.toLocaleString("en-US")}건)
                  {scope.complete ? "" : " · 상한에 걸려 일부만 조회"}
                </dd>
              </div>
              <div><dt>제재 목록</dt><dd>{analysis.sanctions.listName} ({analysis.sanctions.listUpdatedAt} 기준)</dd></div>
              <div><dt>조회 실패</dt><dd>{scope.failures.length === 0 ? "없음" : scope.failures.join(", ")}</dd></div>
            </dl>
          </section>

          <section className="report-copy">
            <h3>제출 자료</h3>
            <ul className="report-documents">
              {report.documents.map((document) => (
                <li key={document.id}>
                  <span>{document.label}</span>
                  <span className={`document-status is-${document.status}`}>{DOCUMENT_STATUS_LABELS[document.status]}</span>
                  {document.note ? <small>{document.note}</small> : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="report-copy report-request">
            <h3>요청 사항</h3>
            <p>{report.request}</p>
          </section>

          <footer>
            <span>데이터: {providerLabels[scope.provider]} · {formatKoreanDateTime(scope.fetchedAt)} 조회</span>
            <span>분석 버전 {report.analysisVersion} · 생성 {formatKoreanDateTime(report.generatedAt)}</span>
          </footer>
        </article>

        <aside className="submission-panel">
          <dl className={`submission-route deadline-${report.route.deadline.status}`}>
            <div><dt>제출처</dt><dd>{report.route.submitTo}</dd></div>
            <div><dt>기한</dt><dd className="route-deadline">{report.route.deadline.text}</dd></div>
            {report.route.reviewPeriod ? (
              <div><dt>심사 기간</dt><dd>{report.route.reviewPeriod}</dd></div>
            ) : null}
            {report.route.notes.map((note) => (
              <div key={note}><dt>참고</dt><dd>{note}</dd></div>
            ))}
          </dl>
          <div>
            <h2>{hasExchange ? `${exchangeLabel(submission.exchange)} 추가 자료` : "추가 확인 자료"}</h2>
            <p>{submission.requestText.trim() ? "받은 요청과 대조하세요." : "필요한 경우에만 추가하세요."}</p>
          </div>
          <ul>
            {report.additionalDocuments.map((document) => <li key={document}>{document}</li>)}
          </ul>
          <div className="submission-warning">
            <b>확인</b>
            <p>이 자료는 결백을 증명하지 않으며, 거래소의 제한 해제를 보장하지 않습니다.</p>
          </div>
          <button className="primary-button full-button" type="button" onClick={() => window.print()}>
            PDF로 저장
          </button>
          <button className="secondary-button full-button" type="button" onClick={copyText}>
            제출 문안 복사
          </button>
          {copyState ? <p className="copy-state" role="status">{copyState}</p> : null}
        </aside>
      </div>

      <div className="screen-actions report-actions">
        <button className="secondary-button" type="button" onClick={onBack}>내용 수정</button>
        <button className="secondary-button" type="button" onClick={onRestart}>처음부터</button>
      </div>
    </section>
  );
}
