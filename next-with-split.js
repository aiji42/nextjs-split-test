const { findPageFile } = require('next/dist/server/lib/find-page-file')
const { findPagesDir } = require('next/dist/lib/find-pages-dir')

const chalk  = require('chalk')

const prefixes = {
  wait: chalk.cyan('wait') + '  -',
  error: chalk.red('error') + ' -',
  warn: chalk.yellow('warn') + '  -',
  ready: chalk.green('ready') + ' -',
  info: chalk.cyan('info') + '  -',
  event: chalk.magenta('event') + ' -'
}

function error(...message) {
  console.error(prefixes.error, ...message)
}

function warn(...message) {
  console.warn(prefixes.warn, ...message)
}

function info(...message) {
  console.log(prefixes.info, ...message)
}

const rule = (source, destination, additional = {}) => ({
  source,
  destination,
  ...additional
})
const has = (value = 'original') => [
  {
    type: 'cookie',
    key: 'next-with-split',
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
      rule('/:path*/', '/_split-challenge')
    ]
  }
}

const defaultOptions = {
  branchMappings: {},
  rootPage: 'top',
  mainBranch: 'main',
  active: process.env.VERCEL_ENV === 'production'
}

const nextWithSplit = (args) => {
  const { splits, ...nextConfig } = args
  const options = { ...defaultOptions, ...(splits ?? {}) }
  const mappings = { [options.mainBranch]: '', ...options.branchMappings }

  const pagesDir = findPagesDir('')
  findPageFile(findPagesDir(''), 'index', ['tsx', 'jsx', 'js', 'ts']).then((res) => {
    if (!res) return
    error(
      `You cannot use ${pagesDir}/${res} when using \`next-with-split\`. Please rename it to something else, such as ${pagesDir}/top.tsx.`
    )
    console.log(
      `1. Rename ${pagesDir}/${res} (Example: ${pagesDir}/root${res.slice(
        res.lastIndexOf('.')
      )}).`
    )
    console.log(`2. Use the \`rootPage\` property of nextWithSplit.`)
    console.log(`
    withSplit({
      splits: {
        rootPage: 'root', // default value is 'top'
        branchMappings: {...}
      }
    }`)
    process.exit(1)
  })

  if ('trailingSlash' in nextConfig && !nextConfig.trailingSlash) {
    warn(
      'You cannot use `trailingSlash: false` when using `next-with-split`. Force override to true.'
    )
  }

  if (options.active && Object.keys(mappings).length > 1) {
    info('Split tests are active.')
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
    assetPrefix: mappings[process.env.VERCEL_GIT_COMMIT_REF ?? ''] ?? '',
    rewrites: makeRewrites(mappings, options.rootPage, options.active)
  }
}

module.exports = nextWithSplit
