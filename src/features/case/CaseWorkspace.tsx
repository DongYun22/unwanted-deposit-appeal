"use client";

import { useMemo, useState } from "react";
import { analyzeCase, createReport, getInboundTransfers } from "@/lib/api/cases";
import { DEMO_WALLET } from "@/mocks/case";
import { AnalysisScreen } from "@/features/case/screens/AnalysisScreen";
import { ReportScreen } from "@/features/case/screens/ReportScreen";
import { StatementScreen } from "@/features/case/screens/StatementScreen";
import { TransactionScreen } from "@/features/case/screens/TransactionScreen";
import type {
  CaseAnalysis,
  CaseReport,
  CaseStep,
  SubmissionDetails,
  Transfer,
  UserStatement,
} from "@/types/case";

const steps: Array<{ id: CaseStep; label: string }> = [
  { id: "transaction", label: "입금 조회" },
  { id: "analysis", label: "온체인 조사" },
  { id: "statement", label: "내 설명" },
  { id: "report", label: "자료 생성" },
];

const initialSubmission: SubmissionDetails = {
  exchange: "unspecified",
  requestText: "",
};

const initialStatement: UserStatement = {
  requestedTransfer: "no",
  knowsSender: "no",
  hadPurpose: "no",
  discoveredAt: "2026-10-28",
  note: "해당 입금을 요청한 사실이 없으며 발신자와 별도로 연락하거나 거래한 적이 없습니다.",
  attachments: [],
};

export function CaseWorkspace() {
  const [step, setStep] = useState<CaseStep>("transaction");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submission, setSubmission] = useState<SubmissionDetails>(initialSubmission);
  const [walletAddress, setWalletAddress] = useState(DEMO_WALLET);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [selectedTransferId, setSelectedTransferId] = useState<string>();
  const [analysis, setAnalysis] = useState<CaseAnalysis>();
  const [statement, setStatement] = useState<UserStatement>(initialStatement);
  const [includedEvidenceIds, setIncludedEvidenceIds] = useState<string[]>([]);
  const [report, setReport] = useState<CaseReport>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const currentIndex = steps.findIndex((item) => item.id === step);
  const selectedTransfer = useMemo(
    () => transfers.find((transfer) => transfer.id === selectedTransferId),
    [selectedTransferId, transfers],
  );

  const searchTransfers = async () => {
    setError(undefined);
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError("42자리 Ethereum 주소를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const nextTransfers = await getInboundTransfers(walletAddress);
      setTransfers(nextTransfers);
      setSelectedTransferId(nextTransfers[0]?.id);
    } catch {
      setError("입금 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedTransfer) return;
    setLoading(true);
    setStep("analysis");
    try {
      const nextAnalysis = await analyzeCase({ walletAddress, transfer: selectedTransfer });
      setAnalysis(nextAnalysis);
      setIncludedEvidenceIds(nextAnalysis.evidence.map((item) => item.id));
    } finally {
      setLoading(false);
    }
  };

  const buildReport = async () => {
    if (!selectedTransfer || !analysis) return;
    setLoading(true);
    try {
      const nextReport = await createReport({
        submission,
        walletAddress,
        transfer: selectedTransfer,
        analysis,
        statement,
        includedEvidenceIds,
      });
      setReport(nextReport);
      setStep("report");
    } finally {
      setLoading(false);
    }
  };

  const toggleEvidence = (id: string) => {
    setIncludedEvidenceIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const restart = () => {
    setStep("transaction");
    setSubmission(initialSubmission);
    setWalletAddress(DEMO_WALLET);
    setTransfers([]);
    setSelectedTransferId(undefined);
    setAnalysis(undefined);
    setStatement(initialStatement);
    setIncludedEvidenceIds([]);
    setReport(undefined);
    setError(undefined);
  };

  return (
    <div className={sidebarOpen ? "app-shell" : "app-shell is-sidebar-collapsed"}>
      <aside className="workflow-sidebar">
        <div className="sidebar-header">
          <strong>I를가져가</strong>
          <button
            type="button"
            className="sidebar-toggle"
            aria-label={sidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((current) => !current)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="4" width="17" height="16" rx="3" />
              <path d="M9 4v16" />
              <path d={sidebarOpen ? "m15 9-3 3 3 3" : "m13 9 3 3-3 3"} />
            </svg>
          </button>
        </div>
        <nav className="step-navigation" aria-label="진행 단계">
          <ol>
            {steps.map((item, index) => {
              const isCurrent = index === currentIndex;
              const isComplete = index < currentIndex;

              return (
                <li key={item.id} className={isCurrent ? "is-current" : isComplete ? "is-complete" : ""}>
                  <button
                    type="button"
                    aria-current={isCurrent ? "step" : undefined}
                    disabled={index > currentIndex}
                    onClick={() => setStep(item.id)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item.label}</b>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <main className="workspace">
        {step === "transaction" ? (
          <TransactionScreen
            walletAddress={walletAddress}
            transfers={transfers}
            selectedTransferId={selectedTransferId}
            loading={loading}
            error={error}
            onAddressChange={setWalletAddress}
            onSearch={searchTransfers}
            onSelect={setSelectedTransferId}
            onNext={runAnalysis}
          />
        ) : null}
        {step === "analysis" ? (
          <AnalysisScreen
            transfer={selectedTransfer}
            analysis={analysis}
            loading={loading}
            onBack={() => setStep("transaction")}
            onNext={() => setStep("statement")}
          />
        ) : null}
        {step === "statement" ? (
          <StatementScreen
            statement={statement}
            analysis={analysis}
            submission={submission}
            includedEvidenceIds={includedEvidenceIds}
            onStatementChange={setStatement}
            onSubmissionChange={setSubmission}
            onEvidenceToggle={toggleEvidence}
            onBack={() => setStep("analysis")}
            onNext={buildReport}
            loading={loading}
          />
        ) : null}
        {step === "report" ? (
          <ReportScreen
            submission={submission}
            walletAddress={walletAddress}
            transfer={selectedTransfer}
            analysis={analysis}
            statement={statement}
            report={report}
            includedEvidenceIds={includedEvidenceIds}
            onBack={() => setStep("statement")}
            onRestart={restart}
          />
        ) : null}
      </main>
    </div>
  );
}
