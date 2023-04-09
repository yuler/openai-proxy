/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/api/proxy',
      },
    ]
  },
}

module.exports = nextConfig
