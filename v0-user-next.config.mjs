/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // For Netlify deployment
  output: 'export',
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Transpile specific modules
  transpilePackages: ['firebase'],
  // Disable server components
  serverComponents: false,
}

export default nextConfig

