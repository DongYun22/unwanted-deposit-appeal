// Binance 프로필 테스트
// 실행: npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { binance } from "@/profiles/exchanges/binance";

describe("Binance 프로필", () => {
  it("확인한 칸의 출처는 Binance 공식 FAQ 링크다", () => {
    for (const field of binance.fields.filter((item) => item.status === "verified")) {
      assert.match(field.source?.url ?? "", /^https:\/\/www\.binance\.com\/en\/support\/faq\//, field.label);
    }
  });

  it("공개 자료에서 심사 기간을 찾지 못했으면 심사 기간을 비워 둔다", () => {
    const review = binance.fields.find((field) => field.label === "심사 기간");
    assert.equal(review?.status, "check");
    assert.equal(binance.reviewPeriod, null);
  });

  it("공개 자료에서 찾지 못한 칸에는 출처를 붙이지 않는다", () => {
    for (const field of binance.fields.filter((item) => item.status === "check")) {
      assert.equal(field.source, undefined, field.label);
    }
  });
});
