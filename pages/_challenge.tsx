import { GetServerSideProps } from 'next'
import { VFC } from 'react'
import { setCookie } from 'nookies'

const splitTests: string[] = JSON.parse(process.env.SPLIT_TESTS ?? '[]')

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setCookie(
    ctx,
    'branch',
    splitTests[Math.floor(Math.random() * splitTests.length)],
    { path: '/' }
  )
  ctx.res.writeHead(302, { Location: ctx.req.url ?? '/' })
  ctx.res.end()

  return {
    props: {}
  }
}

const _challenge: VFC = () => {
  return null
}

export default _challenge
