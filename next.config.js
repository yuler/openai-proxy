/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
      },
      {
        source: '/:path*',
        destination: '/api/proxy',
      },
    ]
  },
}

module.exports = nextConfig
