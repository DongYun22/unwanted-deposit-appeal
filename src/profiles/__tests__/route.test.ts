// 제출 경로 계산 테스트. 오늘 날짜를 고정해서 확인합니다.
// 실행: npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PROFILE_ORDER, PROFILES } from "@/profiles";
import { deadlineStatus, getSubmissionRoute, objectionDeadline, todayInSeoul } from "@/profiles/route";

const TODAY = "2026-11-05";

describe("보이스피싱 지급정지 이의제기 기한", () => {
  it("공고일과 같은 날짜로 2개월 뒤", () => {
    assert.equal(objectionDeadline("2026-10-20"), "2026-12-20");
  });

  it("마지막 달에 같은 날이 없으면 그 달 말일", () => {
    assert.equal(objectionDeadline("2026-12-31"), "2027-02-28");
    assert.equal(objectionDeadline("2027-12-30"), "2028-02-29");
  });

  it("국내 거래소에서 공고일을 넣으면 날짜가 나온다", () => {
    const route = getSubmissionRoute({ exchange: "kr-other", restrictionType: "phishing", baseDate: "2026-10-20" }, TODAY);
    assert.equal(route.deadline.date, "2026-12-20");
    assert.equal(route.deadline.status, "set");
  });

  it("공고일이 없으면 기한을 정하지 않는다", () => {
    const route = getSubmissionRoute({ exchange: "upbit", restrictionType: "phishing", baseDate: "" }, TODAY);
    assert.equal(route.deadline.status, "unknown");
    assert.equal(route.deadline.date, null);
  });

  it("해외 거래소에는 한국 절차를 그대로 안내하지 않는다", () => {
    const route = getSubmissionRoute({ exchange: "kraken", restrictionType: "phishing", baseDate: "2026-10-20" }, TODAY);
    assert.equal(route.deadline.status, "unknown");
    assert.match(route.submitTo, /한국 법 절차/);
  });
});

describe("거래소 내부 심사", () => {
  it("통지된 기한이 지났으면 passed, 3일 안이면 soon", () => {
    assert.equal(deadlineStatus("2026-11-01", TODAY), "passed");
    assert.equal(deadlineStatus("2026-11-08", TODAY), "soon");
    assert.equal(deadlineStatus("2026-11-12", TODAY), "set");
  });

  // 아래 두 테스트는 특정 거래소 이름을 쓰지 않습니다.
  // 국내 · 해외 담당이 프로필을 채워도 이 공용 파일을 고칠 일이 없게 하려는 것입니다 (CONTRIBUTING.md).
  it("심사 기간이 있는 거래소는 심사 기간을 기한과 따로 보여준다", () => {
    for (const profile of Object.values(PROFILES).filter((item) => item.reviewPeriod)) {
      const route = getSubmissionRoute({ exchange: profile.id, restrictionType: "internal", baseDate: "" }, TODAY);
      assert.equal(route.deadline.status, "unknown", profile.name);
      assert.equal(route.reviewPeriod, profile.reviewPeriod, profile.name);
    }
  });

  it("리서치 중인 거래소는 공통 기준이라고 알린다", () => {
    for (const profile of Object.values(PROFILES).filter((item) => item.status === "research")) {
      const route = getSubmissionRoute({ exchange: profile.id, restrictionType: "internal", baseDate: "" }, TODAY);
      assert.ok(route.notes.some((note) => note.includes("공통 기준")), profile.name);
    }
  });

  it("모르는 거래소 값은 미지정으로 본다", () => {
    const route = getSubmissionRoute(
      { exchange: "other" as never, restrictionType: "internal", baseDate: "" },
      TODAY,
    );
    assert.ok(route.notes.some((note) => note.includes("거래소를 고르면")));
  });
});

describe("프로필 데이터", () => {
  it("화면 순서에 있는 거래소는 모두 프로필이 있다", () => {
    for (const id of [...PROFILE_ORDER.kr, ...PROFILE_ORDER.intl]) {
      assert.ok(PROFILES[id], id);
    }
  });

  it("공개 자료로 확인했다고 표시한 칸에는 출처가 있다", () => {
    for (const profile of Object.values(PROFILES)) {
      for (const field of profile.fields) {
        if (field.status === "verified") assert.ok(field.source, `${profile.name} · ${field.label}`);
      }
    }
  });
});

describe("오늘 날짜", () => {
  it("한국 시간 기준", () => {
    assert.equal(todayInSeoul(new Date("2026-11-04T16:00:00Z")), "2026-11-05");
  });
});
