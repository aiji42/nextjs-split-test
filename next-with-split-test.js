const rule = (source, destination, additional = {}) => ({
  source,
  destination,
  ...additional
})
const has = (value = 'original') => [
  {
    type: 'cookie',
    key: 'branch',
    value
  }
]

const makeRewrites = (mappings, rootPage, active) => async () => {
  if (!active || Object.keys(mappings).length < 2)
    return [rule('/', `/${rootPage}`)]

  return {
    beforeFiles: [
      ...Object.entries(mappings)
        .map(([branch, origin]) => [
          rule('/', `${origin}/${rootPage}/`, { has: has(branch) }),
          rule('/:path*/', `${origin}/:path*`, { has: has(branch) })
        ])
        .flat(),
      rule('/:path*/', '/_split-test-challenge')
    ]
  }
}

const defaultOptions = {
  branchMappings: {},
  rootPage: 'top',
  mainBranch: 'main',
  active: process.env.VERCEL_ENV === 'production'
}

const nextWithSplitTest = (args) => {
  const { splitTest, ...nextConfig } = args
  const options = { ...defaultOptions, ...(splitTest ?? {}) }
  const mappings = { [options.mainBranch]: '', ...options.branchMappings }

  if (options.active && Object.keys(mappings).length > 1) {
    console.log('Split tests are active.')
    console.table(
      Object.entries(mappings).map(([branch, origin]) => ({
        branch,
        tergetOrigin: origin || 'original'
      }))
    )
  }

  return {
    ...nextConfig,
    env: {
      ...(nextConfig.env ?? {}),
      SPLIT_TEST_BRANCHES: JSON.stringify(Object.keys(mappings))
    },
    trailingSlash: true,
    assetPrefix: mappings[process.env.VERCEL_GIT_COMMIT_REF] ?? '',
    rewrites: makeRewrites(mappings, options.rootPage, options.active)
  }
}

module.exports = nextWithSplitTest
