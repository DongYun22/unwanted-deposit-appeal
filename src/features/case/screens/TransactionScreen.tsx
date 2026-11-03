import { formatKoreanDate, shortAddress } from "@/features/case/utils";
import type { Transfer } from "@/types/case";

interface TransactionScreenProps {
  walletAddress: string;
  transfers: Transfer[];
  selectedTransferId?: string;
  loading: boolean;
  error?: string;
  onAddressChange: (value: string) => void;
  onSearch: () => void;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TransactionScreen({
  walletAddress,
  transfers,
  selectedTransferId,
  loading,
  error,
  onAddressChange,
  onSearch,
  onSelect,
  onBack,
  onNext,
}: TransactionScreenProps) {
  return (
    <section className="screen-section transaction-screen" aria-labelledby="transaction-title">
      <div className="section-heading compact-heading">
        <h1 id="transaction-title">입금 조회</h1>
        <p>공개 지갑 주소만 사용합니다.</p>
      </div>

      <div className="address-search">
        <label>
          <span>Ethereum 지갑 주소</span>
          <input
            value={walletAddress}
            onChange={(event) => onAddressChange(event.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        <button type="button" className="secondary-button" onClick={onSearch} disabled={loading}>
          {loading ? "조회 중" : "입금 내역 조회"}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="transaction-panel">
        <div className="panel-heading">
          <div>
            <h2>최근 수신 거래</h2>
            <p>문제 거래 한 건을 선택하세요.</p>
          </div>
          <span>{transfers.length}건</span>
        </div>

        {loading ? (
          <div className="loading-list" aria-label="입금 내역을 불러오는 중">
            <i /><i /><i />
          </div>
        ) : (
          <div className="transaction-list">
            {transfers.map((transfer) => {
              const selected = selectedTransferId === transfer.id;
              return (
                <button
                  type="button"
                  className={selected ? "transaction-row is-selected" : "transaction-row"}
                  key={transfer.id}
                  onClick={() => onSelect(transfer.id)}
                >
                  <span className="radio-mark" aria-hidden="true" />
                  <span className="transaction-direction">받음</span>
                  <span className="transaction-main">
                    <b>{transfer.amount} {transfer.asset}</b>
                    <small>{shortAddress(transfer.from, 8, 6)}에서 수신</small>
                  </span>
                  <span className="transaction-meta">
                    <time>{formatKoreanDate(transfer.timestamp)}</time>
                    {transfer.reviewReason ? <em>{transfer.reviewReason}</em> : <small>정상 수신 기록</small>}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="screen-actions">
        <button className="secondary-button" type="button" onClick={onBack}>이전</button>
        <button className="primary-button" type="button" onClick={onNext} disabled={!selectedTransferId || loading}>
          거래 분석
        </button>
      </div>
    </section>
  );
}
