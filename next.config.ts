// next.config.ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
     //  / * output: 'export', */  commenting for dynamic node deploy.-To host in Node server, I am removing output: 'export', line in next.config.ts To allow the app to run as a Node.js server, please remove the line output: 'export' 
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Add this line to disable Image Optimization API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig
