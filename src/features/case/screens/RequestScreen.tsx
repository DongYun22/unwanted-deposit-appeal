import type { RequestContext } from "@/types/case";

interface RequestScreenProps {
  value: RequestContext;
  onChange: (value: RequestContext) => void;
  onNext: () => void;
}

const exchanges = [
  { id: "upbit", label: "Upbit" },
  { id: "coinbase", label: "Coinbase" },
  { id: "binance", label: "Binance" },
  { id: "kraken", label: "Kraken" },
  { id: "other", label: "기타" },
] as const;

const requestTypes = [
  { id: "specific-deposit", label: "특정 입금의 경위", description: "누가 보냈고 왜 받았는지 설명해 달라는 요청" },
  { id: "suspicious-relation", label: "의심 주소와의 관계", description: "특정 주소 또는 거래와의 관련성을 묻는 요청" },
  { id: "source-of-funds", label: "전체 자금 출처", description: "자산을 처음 어떻게 취득했는지 묻는 요청" },
  { id: "wallet-ownership", label: "지갑 소유권", description: "해당 지갑이 본인 소유인지 확인하는 요청" },
  { id: "unknown", label: "잘 모르겠음", description: "받은 문구를 입력하고 다음 단계에서 확인" },
] as const;

export function RequestScreen({ value, onChange, onNext }: RequestScreenProps) {
  const isCoreRequest = value.requestType === "specific-deposit" || value.requestType === "suspicious-relation";

  return (
    <section className="screen-section request-screen" aria-labelledby="request-title">
      <div className="section-heading compact-heading">
        <h1 id="request-title">요청 확인</h1>
        <p>거래소와 받은 요청 유형을 선택하세요.</p>
      </div>

      <div className="request-layout">
        <div className="request-main">
          <fieldset className="field-group">
            <legend>거래소</legend>
            <div className="segmented-options">
              {exchanges.map((exchange) => (
                <button
                  key={exchange.id}
                  type="button"
                  className={value.exchange === exchange.id ? "segment-button is-selected" : "segment-button"}
                  onClick={() => onChange({ ...value, exchange: exchange.id })}
                >
                  {exchange.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group request-type-field">
            <legend>요청 유형</legend>
            <div className="choice-list">
              {requestTypes.map((type) => (
                <label key={type.id} className={value.requestType === type.id ? "choice-row is-selected" : "choice-row"}>
                  <input
                    type="radio"
                    name="request-type"
                    value={type.id}
                    checked={value.requestType === type.id}
                    onChange={() => onChange({ ...value, requestType: type.id })}
                  />
                  <span>
                    <b>{type.label}</b>
                    <small>{type.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="request-message">
          <label className="text-field">
            <span>받은 요청 내용 <small>선택</small></span>
            <textarea
              rows={12}
              placeholder="거래소에서 받은 문구를 붙여넣으세요."
              value={value.requestText}
              onChange={(event) => onChange({ ...value, requestText: event.target.value })}
            />
          </label>

          {!isCoreRequest && value.requestType !== "unknown" ? (
            <p className="scope-note">
              특정 입금과 의심 주소 관련 요청만 자동 분석합니다.
            </p>
          ) : null}
        </div>
      </div>

      <div className="screen-actions screen-actions-end">
        <button className="primary-button" type="button" onClick={onNext}>
          입금 조회
        </button>
      </div>
    </section>
  );
}
