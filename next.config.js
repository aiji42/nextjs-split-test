const { withSplit } = require('next-with-split')

module.exports = withSplit({
  reactStrictMode: true,
  rewrites: async () => ([
    {
      source: '/foo/:path*',
      destination: '/foo/bar'
    }
  ])
})
