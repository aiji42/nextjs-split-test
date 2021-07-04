const { withSplit } = require('next-with-split')

module.exports = withSplit({
  splits: {
    test1: {
      path: '/foo/abtest/:path*',
      hosts: {
        original: 'https://nextjs-split-test-git-abtest-original-2021-07-04-aiji42.vercel.app',
        challenger: 'https://nextjs-split-test-git-abtest-example-2021-07-04-aiji42.vercel.app'
      }
    },
    test2: {
      path: '/',
      hosts: {
        original: 'https://nextjs-split-test-git-abtest-original-2021-07-04-aiji42.vercel.app',
        challenger: 'https://nextjs-split-test-git-abtest-example-2021-07-04-aiji42.vercel.app'
      }
    }
  },
  reactStrictMode: true,
  rewrites: async () => ([
    {
      source: '/foo/:path*',
      destination: '/foo/bar'
    }
  ])
})
