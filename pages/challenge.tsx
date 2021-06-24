import { GetServerSideProps } from 'next'
import { VFC } from 'react'
import { setCookie, parseCookies } from 'nookies'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(parseCookies(ctx))
  setCookie(ctx, 'branch', 'main', { path: '/' })
  ctx.res.writeHead(302, { Location: '/' })
  ctx.res.end()

  return {
    props: {}
  }
}

const Challenge: VFC = () => {
  return <div>aaaaaaaaaaaaaaaa</div>
}

export default Challenge
