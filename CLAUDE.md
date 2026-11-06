# Claude 작업 규칙

여러 사람이 나눠서 작업하는 저장소입니다. 협업 규칙의 원본은 CONTRIBUTING.md이고, 여기에는 Claude가 작업할 때 꼭 지킬 것만 모았습니다.

@AGENTS.md
@CONTRIBUTING.md

## 시작할 때

1. `git status --short --branch`로 브랜치를 봅니다. `develop`이나 `main`, 또는 다른 일의 브랜치라면, 파일을 고치기 전에 새 브랜치를 만듭니다: `git fetch origin && git switch -c <이름> origin/develop`. 이름은 CONTRIBUTING.md "브랜치" 표를 따릅니다.
2. 누구의 작업인지 봅니다. `gh api user --jq .login`이나 `git config user.name`으로 사용자를 찾아 CONTRIBUTING.md 담당 표와 맞춰 봅니다. 표에 없거나 헷갈리면 사용자에게 묻습니다.
3. 담당 파일만 고칩니다. 공용 파일이나 상대 담당의 파일을 고쳐야 하면 고치지 말고 멈춘 다음, 무엇을 왜 바꿔야 하는지와 함께 "`[공용]` PR로 따로 내야 한다"고 사용자에게 알립니다.

## 고칠 때

- 거래소 1곳은 브랜치 1개, PR 1개입니다. 다른 거래소 파일은 같은 브랜치에서 고치지 않습니다.
- 공개 문서로 확인한 칸만 `status: "verified"`로 쓰고, 출처 url을 붙입니다. 추측으로 채우지 않습니다. 찾지 못한 칸은 `status: "check"`로 남깁니다 (src/profiles/README.md).
- 화면과 소명서 문장은 docs/writing-rules.md를 따릅니다.
- 거래소만 따로 확인하는 테스트는 새 파일 `src/profiles/__tests__/<거래소>.test.ts`에 씁니다. `route.test.ts`는 공용입니다.

## 커밋, push, PR

- 사용자가 요청할 때만 합니다.
- `git add`에는 파일 경로를 하나씩 적습니다. `.omc/`, `.env*`, 개발 서버가 바꾼 `next-env.d.ts`는 넣지 않습니다.
- PR 전에 `npm run typecheck`, `npm test`, `npm run build`를 돌리고 결과를 PR 본문에 적습니다. 하나라도 실패하면 PR을 열지 않고 사용자에게 알립니다.
- push 전에 `git fetch origin && git rebase origin/develop`을 합니다. 내 담당 파일의 충돌은 풀어도 됩니다. 공용 파일이나 상대 담당 파일에서 충돌이 나면 임의로 풀지 말고 사용자에게 알립니다.
- PR은 `develop`으로 보냅니다: `gh pr create -R jaesimin0903/unwanted-deposit-appeal --base develop --head <브랜치>`. `-R`을 빼면 원본 저장소로 갈 수 있습니다. 원본 `main`으로 보내는 PR은 `jaesimin0903`이 요청할 때만 엽니다.
- PR 제목 앞에 `[국내]`, `[해외]`, `[공용]` 중 하나를 붙입니다. `src/types/case.ts`를 바꿨으면 `[계약 변경]`도 붙입니다.
- PR 본문은 `.github/pull_request_template.md`의 칸을 채웁니다.
- `develop`과 `main`에는 직접 push하지 않습니다. 내 브랜치가 아닌 곳에도 push하지 않습니다. 강제 push는 내 브랜치에만 `--force-with-lease`로 합니다.
