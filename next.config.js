/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Prevents ESLint from blocking Vercel deployments
  },
  typescript: {
    ignoreBuildErrors: true, // Prevents TypeScript from blocking Vercel deployments
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
    turbopack: {} // Silences the turbopack/webpack compatibility warning
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'three', '@react-three/drei', '@react-three/fiber']
    }
    return config
  },
}
module.exports = nextConfig
