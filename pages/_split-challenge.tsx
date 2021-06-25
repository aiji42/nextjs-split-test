import { GetServerSideProps } from 'next'
import { VFC } from 'react'
import { setCookie } from 'nookies'

const branches: string[] = JSON.parse(process.env.SPLIT_TEST_BRANCHES ?? '[]')

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setCookie(
    ctx,
    'next-with-split',
    branches[Math.floor(Math.random() * branches.length)],
    { path: '/' }
  )
  ctx.res.writeHead(302, { Location: ctx.req.url ?? '/' })
  ctx.res.end()

  return {
    props: {}
  }
}

const SplitChallenge: VFC = () => {
  return null
}

export default SplitChallenge
