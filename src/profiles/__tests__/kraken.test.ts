// Kraken 프로필 테스트
// 실행: npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { kraken } from "@/profiles/exchanges/kraken";

describe("Kraken 프로필", () => {
  it("확인한 칸의 출처는 Kraken 공식 지원 문서 링크다", () => {
    for (const field of kraken.fields.filter((item) => item.status === "verified")) {
      assert.match(field.source?.url ?? "", /^https:\/\/support\.kraken\.com\/articles\//, field.label);
    }
  });

  it("심사 기간과 제출 기한을 따로 적는다", () => {
    assert.ok(kraken.reviewPeriod?.includes("심사 기간"));
    assert.ok(kraken.fields.some((field) => field.label === "제출 기한"));
  });

  it("공개 자료에서 찾지 못한 칸은 확인 필요로 남긴다", () => {
    const unsolicited = kraken.fields.find((field) => field.label === "요청하지 않은 입금");
    assert.equal(unsolicited?.status, "check");
    assert.equal(unsolicited?.source, undefined);
  });
});
