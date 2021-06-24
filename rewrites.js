const rewrites = async () => {
  return {
    beforeFiles: [
      {
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'challenger'
          }
        ],
        destination: '/challenger'
      },
      {
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'main'
          }
        ],
        destination: '/original'
      },
      {
        source: '/:path*/',
        destination: '/challenge'
      }
    ]
  }
}

module.exports = rewrites
