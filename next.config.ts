import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // HSTS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Content Type Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Frame Options
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  images: {
    remotePatterns: [
      // API Services - проверенные и необходимые домены
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/**'
      },
      {
        protocol: 'https',
        hostname: 'api.color.pizza',
      },
      {
        protocol: 'https',
        hostname: 'singlecolorimage.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      
      // GitHub - надежный источник
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      
      // Media APIs - проверенные источники
      {
        protocol: 'https',
        hostname: 'i4.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
      },
      {
        protocol: 'https',
        hostname: 'www.thecocktaildb.com',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      
      // Demo APIs
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'www.course-api.com',
      },
      
      // Supabase
      {
        protocol: 'https',
        hostname: 'supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ysrdrujxsfpufabyawwj.supabase.co',
      },
      
      // CDN
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
    // Добавляем дополнительные настройки безопасности для изображений
    domains: [],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Включаем проверки безопасности
  eslint: {
    ignoreDuringBuilds: false, // Включаем проверки ESLint
  },
  typescript: {
    ignoreBuildErrors: false, // Включаем проверки TypeScript
  },

  // External packages для server components
  serverExternalPackages: [],

  // Настройки сборки для production
  poweredByHeader: false, // Скрываем X-Powered-By заголовок
  reactStrictMode: true,
  
  // Redirect и rewrite настройки
  async redirects() {
    return [];
  },
  
  async rewrites() {
    return [];
  },
};

export default nextConfig;
