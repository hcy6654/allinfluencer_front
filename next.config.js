/** @type {import('next').NextConfig} */
// 로컬 개발에서 `env.local`(docker-compose용)도 함께 읽어 API_URL 등을 주입합니다.
// Next 기본 규칙은 `.env.local`인데, 이 프로젝트는 `env.local`을 사용하고 있어 별도 처리합니다.
const fs = require('fs');
const path = require('path');

function loadEnvLocalIfPresent() {
  try {
    const envPath = path.join(__dirname, 'env.local');
    if (!fs.existsSync(envPath)) return;

    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();

      // 이미 외부에서 주입된 값이 있으면 덮어쓰지 않음
      if (key && process.env[key] == null) {
        process.env[key] = value;
      }
    }
  } catch {
    // 환경파일 파싱 실패는 dev 편의 기능이므로 조용히 무시
  }
}

loadEnvLocalIfPresent();

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8080'}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

