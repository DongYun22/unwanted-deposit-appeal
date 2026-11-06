# 협업 규칙

## 저장소와 브랜치 흐름

작업은 `jaesimin0903/unwanted-deposit-appeal`에서 합니다. 기본 브랜치는 `develop`입니다.

```text
기능 브랜치  ──PR──▶  develop  ──PR──▶  원본 main
(실제 작업)          (작업이 모이는 곳)    (sungjae0309/unwanted-deposit-appeal)
                     jaesimin0903이 합침   jaesimin0903이 모아서 보냄
```

| 브랜치 | 있는 곳 | 쓰임 |
|---|---|---|
| 기능 브랜치 | `jaesimin0903/unwanted-deposit-appeal` | 실제 작업. `develop`에서 만들고 `develop`으로 PR |
| `develop` | `jaesimin0903/unwanted-deposit-appeal` (기본 브랜치) | 작업이 모이는 곳. 직접 push하지 않고 PR로만 합침 |
| `main` | `sungjae0309/unwanted-deposit-appeal` (원본) | 최종본. `develop`이 모이면 `jaesimin0903`이 원본 `main`으로 PR |

처음 한 번만 합니다.

```bash
git clone https://github.com/jaesimin0903/unwanted-deposit-appeal.git
cd unwanted-deposit-appeal
git switch develop
```

브랜치를 올리려면 이 저장소의 collaborator 초대를 받아야 합니다. `jaesimin0903`에게 GitHub 아이디를 알려 주세요.

## 담당 나누기: 거래소 프로필

국내와 해외를 나눠서 맡습니다. **자기 담당 파일만 고치면** 두 사람의 PR이 부딪히지 않습니다.

| 담당 | GitHub | 거래소 | 고치는 파일 |
|---|---|---|---|
| 거래소 프로필 · 국내 | `jaesimin0903` | 업비트, 빗썸, 코인원, 코빗, 고팍스 | `src/profiles/exchanges/` 안의 `upbit.ts` `bithumb.ts` `coinone.ts` `korbit.ts` `gopax.ts`, `groups.ts`의 `kr` 칸 |
| 거래소 프로필 · 해외 | (해외 담당 GitHub 아이디) | Kraken, Coinbase, Binance | `src/profiles/exchanges/` 안의 `kraken.ts` `coinbase.ts` `binance.ts`, `groups.ts`의 `intl` 칸 |

- 거래소만 따로 확인하는 테스트는 새 파일 `src/profiles/__tests__/<거래소>.test.ts`에 씁니다. 그 파일도 담당자 것입니다.
- `groups.ts`의 법 조항 요약은 리서치 담당 확인을 받고 고칩니다 ([src/profiles/README.md](src/profiles/README.md)).
- 각 파일 맨 위의 `담당:` 주석과 `TODO(거래소 프로필 · 국내/해외)`가 이 표와 같습니다.

### 공용 파일

아래 파일은 국내 · 해외가 같이 씁니다. 거래소 프로필 PR에서는 고치지 않습니다.

| 파일 | 공용인 이유 |
|---|---|
| `src/types/case.ts` | 화면과 서버의 약속. 거래소 id나 자료 종류(`AppealDocumentId`)를 늘리면 여기가 바뀜 |
| `src/profiles/registry.ts` | 거래소 목록과 화면 순서. 거래소를 추가할 때만 바뀜 |
| `src/profiles/` 안의 `documents.ts` `labels.ts` `build.ts` `route.ts` `index.ts` | 국내 · 해외가 같이 씀 |
| `src/profiles/__tests__/route.test.ts` | 공통 테스트. 특정 거래소 이름을 쓰지 않게 만들어 둠 |
| `src/profiles/README.md`, 이 문서, `CLAUDE.md`, `.github/` | 규칙 |

공용 파일을 바꿔야 하면 이렇게 합니다.

1. 공용 파일만 바꾸는 작은 PR을 `develop`으로 따로 엽니다. 제목은 `[공용] …`로 시작합니다.
2. 두 담당이 모두 확인한 뒤 합칩니다.
3. 합쳐지면 각자 자기 브랜치를 `origin/develop` 위로 다시 올립니다 (아래 "PR 보내기"의 rebase).
4. 그 PR이 합쳐지기 전에는 그 위에 다른 작업을 쌓지 않습니다. 기다리거나, 먼저 합쳐 달라고 말합니다.

## 브랜치

`develop`에는 직접 push하지 않습니다. 브랜치는 항상 최신 `develop`(`origin/develop`)에서 새로 만듭니다.

| 이름 | 언제 | 예시 |
|---|---|---|
| `feat/profile-kr-<거래소>` | 국내 거래소 프로필 | `feat/profile-kr-bithumb` |
| `feat/profile-intl-<거래소>` | 해외 거래소 프로필 | `feat/profile-intl-coinbase` |
| `feat/…` | 기능 추가 | `feat/alchemy-provider` |
| `fix/…` | 고치기 | `fix/spray-window` |
| `docs/…` | 문서만 | `docs/api-contract` |
| `chore/…` | 원본과 맞추기 같은 정리 | `chore/sync-upstream` |

충돌을 줄이는 습관입니다.

| 습관 | 이유 |
|---|---|
| 거래소 1곳 = 브랜치 1개 = PR 1개 | 한 PR이 늦어져도 다른 거래소 작업이 막히지 않음 |
| 브랜치는 짧게. 며칠씩 쌓지 않기 | 오래될수록 `develop`과 멀어짐 |
| PR을 열기 전, 그리고 `develop`이 바뀌면 rebase | 충돌을 내 브랜치에서 먼저 풀어 둠 |
| 남의 브랜치에 push하지 않기. 강제 push는 내 브랜치에만 `--force-with-lease`로 | 남의 작업을 덮어쓰지 않음 |
| 상태 표처럼 PR마다 같은 줄을 고치는 표를 만들지 않기 | 같은 줄을 고치면 반드시 충돌남. 상태는 각 프로필 파일의 `status`가 기준 |

## PR 보내기

```bash
# 1. 최신 develop에서 브랜치 만들기
git fetch origin
git switch -c feat/profile-intl-coinbase origin/develop

# 2. 작업하고 커밋 (파일은 하나씩 적어서 add)
git add src/profiles/exchanges/coinbase.ts
git commit -m "Coinbase 프로필: 제출 창구와 요청 자료"

# 3. 셋 다 통과해야 올립니다
npm run typecheck
npm test
npm run build

# 4. 그사이 develop이 바뀌었으면 내 브랜치를 그 위로 다시 올리기
git fetch origin
git rebase origin/develop

# 5. 올리고 develop으로 PR 열기
git push -u origin feat/profile-intl-coinbase
gh pr create -R jaesimin0903/unwanted-deposit-appeal --base develop \
  --head feat/profile-intl-coinbase \
  --title "[해외] Coinbase 프로필"
```

- `-R jaesimin0903/unwanted-deposit-appeal`을 꼭 붙입니다. 이 저장소는 원본의 fork라서, 빼면 `gh`가 원본 저장소로 PR을 보내려 할 수 있습니다.
- 리뷰를 받는 동안 `develop`이 바뀌었으면 4번을 다시 하고 `git push --force-with-lease`로 올립니다.

## PR 규칙

- 기능 PR은 모두 `develop`으로 보냅니다. 원본 `main`으로 바로 보내지 않습니다.
- PR 하나에 한 가지 일만 담습니다.
- 제목 앞에 `[국내]`, `[해외]`, `[공용]` 중 하나를 붙입니다. 거래소 프로필이 아닌 일은 붙이지 않아도 됩니다.
- 본문은 [PR 양식](.github/pull_request_template.md) 칸을 채웁니다. 거래소 프로필 PR에는 확인한 공개 자료 링크와 확인한 날을 적습니다.
- 다른 사람 1명이 확인한 뒤 합칩니다. 국내 PR은 해외 담당이, 해외 PR은 국내 담당이 봅니다. 공용 PR은 두 담당이 모두 봅니다.
- `develop`에 합치는 사람은 `jaesimin0903`입니다.
- `src/types/case.ts`를 바꿨으면 PR 제목에 **[계약 변경]**을 붙이고 `docs/api.md`도 같이 고칩니다. 다른 사람 코드에 영향이 가기 때문입니다.
- 화면 문장을 바꿨으면 [docs/writing-rules.md](docs/writing-rules.md)를 지켰는지 확인합니다.

## 원본 main으로 보내기 (`jaesimin0903`만)

원본 저장소를 `upstream`으로 붙여 둔 상태에서 합니다.

```bash
# 원본 main이 바뀌었으면 먼저 develop에 반영 (이것도 develop으로 PR)
git fetch upstream origin
git switch -c chore/sync-upstream origin/develop
git merge upstream/main
git push -u origin chore/sync-upstream
gh pr create -R jaesimin0903/unwanted-deposit-appeal --base develop --head chore/sync-upstream --title "[공용] 원본 main 반영"

# develop을 원본 main으로
gh pr create -R sungjae0309/unwanted-deposit-appeal --base main --head jaesimin0903:develop
```

원본 `main`에 합치는 사람은 원본 저장소 주인(`sungjae0309`)입니다.

## 지킬 것

| 규칙 | 이유 |
|---|---|
| API 키는 `.env.local`에만. 커밋하지 않기 | 공개 저장소 |
| 서버 전용 값에 `NEXT_PUBLIC_`을 붙이지 않기 | 붙이면 브라우저로 나감 |
| 사용자의 거래소 키를 저장·로그에 남기지 않기 | 남의 계정 열쇠 |
| 서명, 개인 키, 시드 문구를 요청하지 않기 | 도구 원칙 |
| 데모 데이터에는 가짜 주소나 공개 보도된 주소만 | 실제 개인을 범죄자로 오해하게 만들지 않기 |
| 금액 계산은 `rawValue`로 | `displayValue`는 반올림된 표시용 |
| `.omc/`, `.env*`, 개발 서버가 바꾼 `next-env.d.ts`는 커밋하지 않기 | 개인 작업 파일 |

## 할 일 찾기

각 파일 맨 위에 `TODO(역할)`로 적어뒀습니다.

```bash
grep -rn "TODO(" src
grep -rn "TODO(거래소 프로필 · 해외)" src   # 내 담당만
```
