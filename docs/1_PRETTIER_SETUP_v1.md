# Prettier 설정 가이드

## 📋 목차
1. [Prettier란?](#prettier란)
2. [설치 방법](#설치-방법)
3. [IDE별 설정](#ide별-설정)
   - [VSCode](#vscode-설정)
   - [IntelliJ / WebStorm](#intellij--webstorm-설정)
4. [사용 방법](#사용-방법)
5. [코딩 스타일](#코딩-스타일)
6. [문제 해결](#문제-해결)
7. [참고 자료](#참고-자료)

---

## Prettier란?

Prettier는 코드 포맷터로, 팀 전체가 일관된 코드 스타일을 유지할 수 있도록 도와줍니다.

**주요 장점:**
- 코드 리뷰 시 스타일 논쟁 제거
- 저장 시 자동 포맷팅
- 일관된 코드 스타일 유지

---

## 설치 방법

### 프로젝트 의존성 설치

프로젝트를 클론한 후, 다음 명령어를 실행하세요:

```bash
npm install
```

> Prettier는 이미 `package.json`에 포함되어 있어 자동으로 설치됩니다.

---

## IDE별 설정

### VSCode 설정

#### 1. 확장 프로그램 설치

VSCode에서 다음 확장 프로그램을 설치해야 합니다:

1. **Prettier - Code formatter** (필수)
   - Extension ID: `esbenp.prettier-vscode`
   - VSCode에서 `Ctrl/Cmd + P` → `ext install esbenp.prettier-vscode`

2. **ESLint** (권장)
   - Extension ID: `dbaeumer.vscode-eslint`
   - VSCode에서 `Ctrl/Cmd + P` → `ext install dbaeumer.vscode-eslint`

> 💡 **팁:** 프로젝트를 열면 VSCode가 자동으로 권장 확장 프로그램 설치를 제안합니다. (`.vscode/extensions.json`에 정의됨)

#### 2. 자동 적용되는 설정

프로젝트에는 이미 팀 공유 설정이 포함되어 있습니다 (`.vscode/settings.json`).

- ✅ 파일 저장 시 자동 포맷팅
- ✅ JS, JSX, TS, TSX, JSON, CSS 파일 자동 포맷팅
- ✅ 줄 끝 공백 제거
- ✅ 파일 끝에 빈 줄 추가

#### 3. 설정 확인 방법

1. VSCode에서 `Ctrl/Cmd + ,` 로 설정 열기
2. 다음 항목들이 활성화되어 있는지 확인:
   - `Format On Save`: ✅ 체크
   - `Default Formatter`: Prettier - Code formatter

#### 4. 단축키

| 기능 | Windows/Linux | Mac |
|------|---------------|-----|
| 자동 포맷팅 | `Shift + Alt + F` | `Shift + Option + F` |
| 저장 | `Ctrl + S` | `Cmd + S` |

---

### IntelliJ / WebStorm 설정

#### 1. Prettier 플러그인 설치

**방법 1: IDE에서 직접 설치**

1. **Settings/Preferences 열기**
   - Windows/Linux: `Ctrl + Alt + S`
   - Mac: `Cmd + ,`

2. **플러그인 검색**
   - `Plugins` → `Marketplace` 탭
   - 검색창에 "Prettier" 입력
   - **Prettier** 플러그인 찾기 (JetBrains 공식)

3. **설치**
   - `Install` 버튼 클릭
   - IDE 재시작

**방법 2: 프로젝트에서 자동 인식**

프로젝트에 `prettier`가 이미 설치되어 있으므로, IntelliJ가 자동으로 인식합니다.

#### 2. Prettier 활성화

1. **Settings/Preferences** 열기
   - `Ctrl + Alt + S` (Windows/Linux)
   - `Cmd + ,` (Mac)

2. **Languages & Frameworks → JavaScript → Prettier** 로 이동

3. **설정 항목:**
   ```
   ✅ Enable automatic Prettier configuration

   Prettier package:
   [프로젝트경로]/node_modules/prettier

   Run for files:
   {**/*,*}.{js,ts,jsx,tsx,css,json}

   ✅ On 'Reformat Code' action
   ✅ On save
   ```

**설정 경로:**
```
Settings
  └── Languages & Frameworks
       └── JavaScript
            └── Prettier
                 ├── [✅] Automatic Prettier configuration
                 ├── Prettier package: .../node_modules/prettier
                 ├── Run for files: {**/*,*}.{js,ts,jsx,tsx,css,json}
                 ├── [✅] On 'Reformat Code' action
                 └── [✅] On save
```

#### 3. 저장 시 자동 포맷팅 (핵심!)

1. **Settings** → **Tools** → **Actions on Save**

2. **다음 항목 체크:**
   ```
   ✅ Reformat code
   ✅ Run Prettier
   ✅ Optimize imports (선택사항)
   ```

3. **File types 설정:**
   - `All file types` 또는
   - `JavaScript, TypeScript, CSS, JSON` 선택

**설정 경로:**
```
Settings
  └── Tools
       └── Actions on Save
            ├── [✅] Reformat code
            ├── [✅] Run Prettier
            └── [✅] Optimize imports
```

#### 4. 단축키

| 기능 | Windows/Linux | Mac |
|------|---------------|-----|
| Reformat Code | `Ctrl + Alt + L` | `Cmd + Option + L` |
| Reformat File | `Ctrl + Alt + Shift + L` | `Cmd + Option + Shift + L` |
| 저장 | `Ctrl + S` | `Cmd + S` |

**커스텀 단축키 (선택사항):**

1. **Settings** → **Keymap**
2. 검색: "Prettier"
3. `Reformat with Prettier` 우클릭 → `Add Keyboard Shortcut`
4. 원하는 단축키 설정 (예: `Ctrl + Alt + P`)

#### 5. IntelliJ 체크리스트

- [ ] Prettier 플러그인 설치됨
- [ ] `Languages & Frameworks → Prettier` 설정 완료
- [ ] Prettier package 경로 올바름
- [ ] `Run for files` 패턴 설정됨
- [ ] `Tools → Actions on Save → Run Prettier` 체크됨
- [ ] 테스트 파일로 동작 확인 완료

---

## 사용 방법

### 1. 자동 포맷팅 (권장)

파일을 수정한 후 **저장만 하면** 자동으로 포맷팅됩니다.

```
파일 수정 → Ctrl/Cmd + S → 자동 포맷팅 ✨
```

### 2. CLI로 포맷팅

전체 프로젝트를 포맷팅하려면:

```bash
# 모든 파일 포맷팅
npm run format

# 포맷팅 확인 (변경 없이)
npm run format:check

# 또는 npx 사용
npx prettier --write .
npx prettier --check .
```

---

## 코딩 스타일

프로젝트에 적용된 Prettier 규칙 (`.prettierrc`):

```json
{
  "semi": true,                    // 세미콜론 사용 ✅
  "trailingComma": "es5",          // ES5 호환 trailing comma
  "singleQuote": true,             // 싱글 쿼트 사용 'text'
  "printWidth": 100,               // 한 줄 최대 100자
  "tabWidth": 4,                   // 들여쓰기 4칸
  "useTabs": false,                // 탭 대신 스페이스 사용
  "arrowParens": "always",         // 화살표 함수 항상 괄호 (x) => x
  "endOfLine": "lf",               // 줄바꿈 LF (\n)
  "bracketSpacing": true,          // 객체 괄호 공백 { foo: bar }
  "jsxSingleQuote": false,         // JSX는 더블 쿼트 사용
  "jsxBracketSameLine": false      // JSX 닫는 괄호 다음 줄
}
```

### Before / After 예시

**Before (포맷팅 전):**
```javascript
const user={name:"John",age:30}
function greet(name){console.log("Hello "+name)}
```

**After (포맷팅 후):**
```javascript
const user = { name: 'John', age: 30 };
function greet(name) {
    console.log('Hello ' + name);
}
```

---

## 문제 해결

### 공통 문제

#### ❌ 특정 파일이 포맷팅되지 않아요

`.prettierignore` 파일에 해당 파일이 제외되어 있을 수 있습니다.

**확인 방법:**
```bash
cat .prettierignore
```

#### ❌ 팀원과 포맷팅 결과가 달라요

1. 모두 같은 Prettier 버전을 사용하는지 확인
   ```bash
   npm ls prettier
   ```

2. `.prettierrc` 파일이 최신인지 확인
   ```bash
   git pull origin main
   ```

3. `node_modules` 재설치
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### ❌ Git에서 줄바꿈 관련 경고가 나와요

Windows 사용자의 경우:

```bash
# Git 설정 변경
git config --global core.autocrlf input

# 이미 추가된 파일 재포맷
git rm --cached -r .
git reset --hard
```

---

### VSCode 문제

#### ❌ 저장해도 포맷팅이 안 돼요

**해결 방법:**

1. Prettier 확장 프로그램이 설치되어 있는지 확인
   ```
   VSCode 확장 → "Prettier" 검색 → 설치 확인
   ```

2. Default Formatter가 Prettier로 설정되어 있는지 확인
   ```
   Ctrl/Cmd + Shift + P → "Format Document With..." → "Prettier" 선택
   ```

3. VSCode 재시작
   ```
   VSCode 완전히 종료 후 다시 열기
   ```

---

### IntelliJ 문제

#### ❌ 저장해도 포맷팅이 안 돼요

**해결 방법:**

1. **Prettier 패키지 경로 확인**
   ```
   Settings → Languages & Frameworks → Prettier
   → Prettier package 경로가 올바른지 확인
   ```

2. **On save 체크박스 확인**
   ```
   Settings → Tools → Actions on Save
   → [✅] Run Prettier 체크 확인
   ```

3. **node_modules 재설치**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **IntelliJ 캐시 삭제**
   ```
   File → Invalidate Caches... → Invalidate and Restart
   ```

#### ❌ "Prettier package not found" 오류

**해결 방법:**

1. 프로젝트 루트에서 Prettier 설치 확인
   ```bash
   npm list prettier
   ```

2. 없다면 설치
   ```bash
   npm install --save-dev prettier
   ```

3. IntelliJ 재시작

#### ❌ IntelliJ 포맷팅과 Prettier가 충돌해요

**해결 방법:**

1. **Prettier만 사용하기 (권장)**
   ```
   Settings → Tools → Actions on Save
   → [✅] Run Prettier만 체크
   → [ ] Reformat code 체크 해제
   ```

2. **또는 Prettier를 기본 포맷터로 설정**
   ```
   Settings → Editor → Code Style → JavaScript
   → Scheme 옆 톱니바퀴 → Import Scheme → Prettier
   ```

---

## 동작 확인

### 테스트 방법:

1. **테스트 파일 생성** (src/test-prettier.js)
```javascript
const user={name:"John",age:30}
function greet(name){console.log("Hello "+name)}
```

2. **저장** (`Ctrl + S` / `Cmd + S`)

3. **자동 포맷팅 확인**
```javascript
const user = { name: 'John', age: 30 };
function greet(name) {
    console.log('Hello ' + name);
}
```

4. **포맷팅이 적용되면 성공!** ✅

---

## 추가 팁

### IntelliJ 프로젝트 전체 포맷팅

처음 설정 후 전체 프로젝트를 포맷팅하려면:

```
1. 프로젝트 루트 우클릭
2. Reformat Code (Ctrl + Alt + L)
3. [✅] Whole file 선택
4. [✅] Include subdirectories
5. Run
```

또는 터미널에서:
```bash
npm run format
```

### IntelliJ 파일 감시 (File Watcher) - 고급

더 세밀한 제어가 필요하다면:

```
Settings → Tools → File Watchers
→ [+] 버튼 → Prettier

Program: $ProjectFileDir$/node_modules/.bin/prettier
Arguments: --write $FilePath$
Output paths to refresh: $FilePath$
```

---

## 📚 참고 자료

- [Prettier 공식 문서](https://prettier.io/docs/en/index.html)
- [Prettier Playground](https://prettier.io/playground/) - 온라인에서 테스트
- [VSCode Prettier 확장](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [JetBrains Prettier 문서](https://www.jetbrains.com/help/webstorm/prettier.html)

---

## 💬 문의

Prettier 설정 관련 문의사항은 팀 채널에 올려주세요!
