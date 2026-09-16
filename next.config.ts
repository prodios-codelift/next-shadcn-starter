import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pg'],
  devIndicators: false,
}

export default nextConfig
