const rewrites = async () => {
  return {
    beforeFiles: [
      {
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'main'
          }
        ],
        destination: '/:path*'
      },
      {
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'abtest_*'
          }
        ],
        destination: 'https://hogehoge.com/:path*'
      },
      {
        source: '/:path*/',
        destination: '/challenge'
      }
    ]
  }
}

module.exports = rewrites
