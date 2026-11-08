// Coinbase 프로필 테스트
// 실행: npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coinbase } from "@/profiles/exchanges/coinbase";

describe("Coinbase 프로필", () => {
  it("확인한 칸의 출처는 Coinbase 공식 도움말 링크다", () => {
    for (const field of coinbase.fields.filter((item) => item.status === "verified")) {
      assert.match(field.source?.url ?? "", /^https:\/\/help\.coinbase\.com\/en\//, field.label);
    }
  });

  it("공개 자료에서 심사 기간을 찾지 못했으면 심사 기간을 비워 둔다", () => {
    assert.equal(coinbase.fields.find((field) => field.label === "심사 기간")?.status, "check");
    assert.equal(coinbase.reviewPeriod, null);
  });

  it("제재 주소 동결 칸은 Coinbase OFAC 안내를 출처로 쓴다", () => {
    for (const label of ["제재 주소에서 온 요청하지 않은 입금", "제재 주소 거래 동결", "동결 해제 절차", "허가서 제출"]) {
      const field = coinbase.fields.find((item) => item.label === label);
      assert.equal(field?.status, "verified", label);
      assert.match(field?.source?.url ?? "", /legal-policies\/ofac$/, label);
    }
  });

  it("공개 자료에서 찾지 못한 칸에는 출처를 붙이지 않는다", () => {
    for (const field of coinbase.fields.filter((item) => item.status === "check")) {
      assert.equal(field.source, undefined, field.label);
    }
  });
});
