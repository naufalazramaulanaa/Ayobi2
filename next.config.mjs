import nextI18NextConfig from './next-i18next.config.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // i18n: nextI18NextConfig.i18n, // 👈 Tambahkan ini untuk i18n
}

export default nextConfig
