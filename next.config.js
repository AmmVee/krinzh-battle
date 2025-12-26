// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDocumentPreloading: true,
  },
  images: {
    unoptimized: true, // если будешь деплоить на Vercel — можно убрать
  },
}

module.exports = nextConfig