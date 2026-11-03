export function shortAddress(value: string, left = 6, right = 4) {
  if (value.length <= left + right + 1) return value;
  return `${value.slice(0, left)}…${value.slice(-right)}`;
}

export function formatKoreanDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
