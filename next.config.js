/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.aurascore.app',
          },
        ],
        destination: 'https://aurascore.app',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.aurascore.app',
          },
        ],
        destination: 'https://aurascore.app/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// #const nextConfig = {
//  reactStrictMode: true,
//  swcMinify: true,
//}

// module.exports = nextConfig
