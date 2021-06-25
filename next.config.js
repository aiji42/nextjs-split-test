const withSplitTest = require('./next-with-split-test')

module.exports = withSplitTest({ challenger: 'https://nextjs-split-test-git-abtestchallenger-aiji42.vercel.app' }, 'top', {
  reactStrictMode: true
})
