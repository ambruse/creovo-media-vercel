/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  experimental: { globalNotFound: true },
};

export default nextConfig;
