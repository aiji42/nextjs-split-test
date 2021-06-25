const execSync = require('child_process').execSync

const rewrites = async () => {
  if (process.env.VERCEL_ENV !== 'production') return {}

  // git branch -r --no-merge
  // const res = execSync('git branch -r')
  // const challengers = res.toString().match(/abtest_(.+)/g)
  const challengers = ['abtest_challenger']
  if (!challengers) return {}

  console.log(challengers)

  return {
    beforeFiles: [
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: 'main'
          }
        ],
        destination: '/top'
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
        destination: '/:path*'
      },
      ...challengers.map((challenger) => ({
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: challenger
          }
        ],
        destination: `https://nextjs-split-test-git-abtestchallenger-aiji42.vercel.app/top/`
      })),
      ...challengers.map((challenger) => ({
        source: '/:path*/',
        has: [
          {
            type: 'cookie',
            key: 'branch',
            value: challenger
          }
        ],
        destination: `https://nextjs-split-test-git-abtestchallenger-aiji42.vercel.app/:path*/`
      })),
      {
        source: '/:path*/',
        destination: '/challenge'
      }
    ]
  }
}

module.exports = rewrites
