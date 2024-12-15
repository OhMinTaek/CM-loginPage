/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ESLint 검사 무시
  },
  typescript: {
    ignoreBuildErrors: true,   // TypeScript 오류 무시
  },
}

export default nextConfig;