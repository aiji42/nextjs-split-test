const base = (destination) => [
  {
    source: '/',
    destination: `/${destination}`
  }
]

const makeRewrites = (abtests, rootPage) => async () => {
  if (process.env.VERCEL_ENV !== 'production') return base(rootPage)
  if (!abtests || !Object.keys(abtests).length) return base(rootPage)

  return {
    beforeFiles: [
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'original'
          }
        ],
        destination: `/${rootPage}`
      },
      {
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'original'
          }
        ],
        destination: '/:path*'
      },
      ...Object.entries(abtests).map(([branch, destination]) => ({
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: branch
          }
        ],
        destination: `${destination}/${rootPage}/`
      })),
      ...Object.entries(abtests).map(([branch, destination]) => ({
        source: '/:path*',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: branch
          }
        ],
        destination: `${destination}/:path*/`
      })),
      {
        source: '/:path*/',
        destination: '/_challenge'
      }
    ]
  }
}

const nextWithSplitTest = (abtests, rootPage, nextConfig = {}) => {
  return {
    ...nextConfig,
    env: {
      ...(nextConfig.env ?? {}),
      SPLIT_TESTS: JSON.stringify(['original', ...Object.keys(abtests ?? {})])
    },
    trailingSlash: true,
    assetPrefix: abtests[process.env.VERCEL_GIT_COMMIT_REF] ?? '',
    rewrites: makeRewrites(abtests, rootPage)
  }
}

module.exports = nextWithSplitTest