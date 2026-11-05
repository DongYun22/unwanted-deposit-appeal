import { researchProfile } from "@/profiles/build";

// Coinbase 소명 절차
// 담당: 거래소 프로필 · 해외
// TODO(거래소 프로필 · 해외): Coinbase 공개 자료 확인
//   제출 창구, 요청 자료, 심사 기간을 공개 문서에서 찾아 채우고 status를 "verified"로 바꿉니다.
//   채우는 방법은 src/profiles/README.md를 보세요. 그전까지는 공통 칸 기준으로 안내합니다.

export const coinbase = researchProfile("coinbase", "Coinbase", "intl");
