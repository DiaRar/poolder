const million = require('million/compiler');
/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard',
          permanent: true,
        },
      ]
    },
  
  }
module.exports = million.next(
  nextConfig
, { auto: { rsc: true } }
)