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
  if (active) return [rule('/', `/${rootPage}`)]
  if (!mappings || !Object.keys(mappings).length)
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

const nextWithSplitTest = (options, nextConfig = {}) => {
  const opt = { ...defaultOptions, ...options }
  const mappings = { [opt.mainBranch]: '', ...opt.branchMappings }
  return {
    ...nextConfig,
    env: {
      ...(nextConfig.env ?? {}),
      SPLIT_TEST_BRANCHES: JSON.stringify(Object.keys(mappings))
    },
    trailingSlash: true,
    assetPrefix: mappings[process.env.VERCEL_GIT_COMMIT_REF] ?? '',
    rewrites: makeRewrites(mappings, opt.rootPage, opt.active)
  }
}

module.exports = nextWithSplitTest
