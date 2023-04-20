/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
      },
      {
        source: '/completions',
        destination: '/api/completions',
      },
      {
        source: '/:path*',
        destination: '/api/proxy',
      },
    ]
  },
}

module.exports = nextConfig
