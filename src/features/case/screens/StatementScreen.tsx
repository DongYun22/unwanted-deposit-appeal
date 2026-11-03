import type {
  CaseAnalysis,
  SubmissionDetails,
  UserStatement,
} from "@/types/case";

interface StatementScreenProps {
  statement: UserStatement;
  analysis?: CaseAnalysis;
  submission: SubmissionDetails;
  includedEvidenceIds: string[];
  onStatementChange: (statement: UserStatement) => void;
  onSubmissionChange: (submission: SubmissionDetails) => void;
  onEvidenceToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}

const answerOptions = [
  { id: "no", label: "아니요" },
  { id: "yes", label: "예" },
  { id: "unknown", label: "잘 모르겠어요" },
] as const;

const exchanges = [
  { id: "unspecified", label: "선택하지 않음" },
  { id: "upbit", label: "Upbit" },
  { id: "coinbase", label: "Coinbase" },
  { id: "binance", label: "Binance" },
  { id: "kraken", label: "Kraken" },
  { id: "other", label: "기타" },
] as const;

interface QuestionProps {
  number: string;
  label: string;
  name: string;
  value: "no" | "yes" | "unknown";
  onChange: (value: "no" | "yes" | "unknown") => void;
}

function Question({ number, label, name, value, onChange }: QuestionProps) {
  return (
    <fieldset className="statement-question">
      <legend><span>{number}</span>{label}</legend>
      <div className="answer-options">
        {answerOptions.map((option) => (
          <label key={option.id} className={value === option.id ? "answer-option is-selected" : "answer-option"}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function StatementScreen({
  statement,
  analysis,
  submission,
  includedEvidenceIds,
  onStatementChange,
  onSubmissionChange,
  onEvidenceToggle,
  onBack,
  onNext,
  loading,
}: StatementScreenProps) {
  const addAttachments = (files: FileList | null) => {
    if (!files) return;

    const nextAttachments = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    }));

    onStatementChange({
      ...statement,
      attachments: [
        ...statement.attachments,
        ...nextAttachments.filter(
          (next) => !statement.attachments.some((current) => current.id === next.id),
        ),
      ],
    });
  };

  const removeAttachment = (id: string) => {
    onStatementChange({
      ...statement,
      attachments: statement.attachments.filter((attachment) => attachment.id !== id),
    });
  };

  return (
    <section className="screen-section" aria-labelledby="statement-title">
      <div className="section-heading compact-heading">
        <h1 id="statement-title">내 설명</h1>
        <p>입금 당시 상황을 확인하세요.</p>
      </div>

      <div className="statement-layout">
        <div className="statement-form">
          <Question
            number="01"
            label="이 입금을 요청하셨나요?"
            name="requested"
            value={statement.requestedTransfer}
            onChange={(value) => onStatementChange({ ...statement, requestedTransfer: value })}
          />
          <Question
            number="02"
            label="발신자를 알고 계신가요?"
            name="sender"
            value={statement.knowsSender}
            onChange={(value) => onStatementChange({ ...statement, knowsSender: value })}
          />
          <Question
            number="03"
            label="이 입금과 관련된 거래 목적이 있었나요?"
            name="purpose"
            value={statement.hadPurpose}
            onChange={(value) => onStatementChange({ ...statement, hadPurpose: value })}
          />

          <label className="text-field compact-field statement-date-field">
            <span>입금 확인일</span>
            <input
              type="date"
              value={statement.discoveredAt}
              onChange={(event) => onStatementChange({ ...statement, discoveredAt: event.target.value })}
            />
          </label>

          <label className="text-field compact-field">
            <span>추가 설명 <small>선택</small></span>
            <textarea
              rows={5}
              placeholder="거래소 담당자가 알아야 할 사실만 간결하게 적어주세요."
              value={statement.note}
              onChange={(event) => onStatementChange({ ...statement, note: event.target.value })}
            />
          </label>

          <div className="attachment-field">
            <div>
              <b>관련 자료</b>
              <small>선택 · PDF, JPG, PNG</small>
            </div>
            <label className="attachment-button">
              파일 선택
              <input
                type="file"
                multiple
                accept=".pdf,image/jpeg,image/png"
                onChange={(event) => {
                  addAttachments(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            {statement.attachments.length > 0 ? (
              <ul className="attachment-list">
                {statement.attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <span>
                      <b>{attachment.name}</b>
                      <small>{Math.max(1, Math.round(attachment.size / 1024))} KB</small>
                    </span>
                    <button type="button" onClick={() => removeAttachment(attachment.id)}>
                      제외
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>거래소 요청 원문이나 본인 확인 자료가 있을 때만 추가하세요.</p>
            )}
          </div>

          <div className="submission-details">
            <label className="select-field">
              <span>제출 대상 <small>선택</small></span>
              <select
                value={submission.exchange}
                onChange={(event) =>
                  onSubmissionChange({
                    ...submission,
                    exchange: event.target.value as SubmissionDetails["exchange"],
                  })
                }
              >
                {exchanges.map((exchange) => (
                  <option key={exchange.id} value={exchange.id}>
                    {exchange.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-field compact-field submission-request-field">
              <span>거래소 요청 내용 <small>선택</small></span>
              <textarea
                rows={3}
                placeholder="받은 문구가 있다면 붙여넣으세요."
                value={submission.requestText}
                onChange={(event) =>
                  onSubmissionChange({ ...submission, requestText: event.target.value })
                }
              />
            </label>
          </div>
        </div>

        <aside className="report-selection">
          <div className="panel-heading simple-panel-heading">
            <div>
              <h2>포함할 근거</h2>
              <p>소명 자료에 넣을 항목을 선택하세요.</p>
            </div>
          </div>
          <div className="evidence-checklist">
            {analysis?.evidence.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={includedEvidenceIds.includes(item.id)}
                  onChange={() => onEvidenceToggle(item.id)}
                />
                <span>
                  <b>{item.title}</b>
                  <small>{item.sourceLabel}</small>
                </span>
              </label>
            ))}
          </div>
          <p className="selection-note">선택하지 않은 항목은 PDF에 포함되지 않습니다.</p>
        </aside>
      </div>

      <div className="screen-actions">
        <button className="secondary-button" type="button" onClick={onBack}>이전</button>
        <button className="primary-button" type="button" onClick={onNext} disabled={loading || includedEvidenceIds.length === 0}>
          {loading ? "초안 생성 중" : "소명 자료 만들기"}
        </button>
      </div>
    </section>
  );
}
