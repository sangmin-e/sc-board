# SC-Board

Next.js, Supabase, Vercel 기반의 간단한 공유 메모 보드입니다. 섹션·컬럼·카테고리 없이 메모 카드만 자유롭게 쌓입니다.

## 로컬 실행

1. Supabase SQL Editor에서 `schema.sql`을 실행합니다.
2. `.env.local.example`을 `.env.local`로 복사하고 값을 채웁니다.
3. 관리자 비밀번호 해시는 아래처럼 생성합니다.

```bash
node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "원하는-관리자-비밀번호"
```

4. `ADMIN_SESSION_SECRET`에는 길고 무작위인 문자열을 넣습니다.

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

5. 개발 서버를 실행합니다.

```bash
npm run dev
```

## Vercel 배포

GitHub 저장소를 Vercel에 연결한 뒤 Project Settings → Environment Variables에 `.env.local.example`의 다섯 값을 등록하고 배포합니다. `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`에는 절대 `NEXT_PUBLIC_` 접두사를 붙이지 마세요. 코드에서는 새 publishable/secret 키도 보조 방식으로 지원하지만, 기본 설정은 레거시 anon/service-role 키를 사용합니다.

## 보안 구조

- 브라우저는 공개 URL/anon key로 공개 메모 컬럼만 조회합니다.
- 메모 생성 시 4자리 비밀번호 해시는 서버 API에서 bcrypt로 만듭니다.
- 생성과 일반 삭제는 검증을 거친 서버 API에서 service role key로만 수행합니다.
- 관리자 인증과 삭제는 HttpOnly 세션 쿠키를 검증하는 서버 API에서만 수행합니다.
- `schema.sql`은 비밀번호 해시 컬럼을 공개하지 않으며 명시적 `GRANT`와 RLS 정책을 함께 적용합니다.
