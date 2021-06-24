import { GetServerSideProps } from 'next'
import { VFC } from 'react'
import { setCookie } from 'nookies'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setCookie(
    ctx,
    'branch',
    Math.floor(Math.random() * 2) ? 'main' : 'challenger',
    { path: '/' }
  )
  ctx.res.writeHead(302, { Location: '/' })
  ctx.res.end()

  return {
    props: {}
  }
}

const Challenge: VFC = () => {
  return null
}

export default Challenge
