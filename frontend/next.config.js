/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://100.117.111.36:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig