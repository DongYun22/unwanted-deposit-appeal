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

  it("심사 기간은 정해진 날수가 없다고 적고, 제출 기한과 따로 둔다", () => {
    assert.equal(coinbase.fields.find((field) => field.label === "심사 기간")?.status, "verified");
    assert.ok(coinbase.reviewPeriod?.includes("정해진 기간 없음"));
    assert.ok(coinbase.reviewPeriod?.includes("제출 기한이 아니라 심사 기간"));
    assert.equal(coinbase.fields.find((field) => field.label === "제출 기한")?.status, "check");
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
