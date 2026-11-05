import { fallbackProfile } from "@/profiles/build";
import { binance } from "@/profiles/exchanges/binance";
import { bithumb } from "@/profiles/exchanges/bithumb";
import { coinbase } from "@/profiles/exchanges/coinbase";
import { coinone } from "@/profiles/exchanges/coinone";
import { gopax } from "@/profiles/exchanges/gopax";
import { korbit } from "@/profiles/exchanges/korbit";
import { kraken } from "@/profiles/exchanges/kraken";
import { upbit } from "@/profiles/exchanges/upbit";
import type { ExchangeGroup, ExchangeId, ExchangeProfile, ProfiledExchangeId } from "@/types/case";

// 거래소를 추가할 때는 exchanges/에 파일을 만들고 아래 두 곳에 넣습니다.
export const PROFILES: Record<ProfiledExchangeId, ExchangeProfile> = {
  upbit,
  bithumb,
  coinone,
  korbit,
  gopax,
  "kr-other": fallbackProfile("kr-other", "kr"),
  kraken,
  coinbase,
  binance,
  "intl-other": fallbackProfile("intl-other", "intl"),
};

// 화면에 보여주는 순서
export const PROFILE_ORDER: Record<ExchangeGroup, ProfiledExchangeId[]> = {
  kr: ["upbit", "bithumb", "coinone", "korbit", "gopax", "kr-other"],
  intl: ["kraken", "coinbase", "binance", "intl-other"],
};

// 모르는 값(예전 화면이 보낸 "other" 등)은 미지정으로 봅니다.
export function getProfile(id: ExchangeId | string | undefined): ExchangeProfile | null {
  if (!id || id === "unspecified") return null;
  return Object.prototype.hasOwnProperty.call(PROFILES, id) ? PROFILES[id as ProfiledExchangeId] : null;
}

export function exchangeLabel(id: ExchangeId): string {
  return getProfile(id)?.name ?? "미지정";
}
