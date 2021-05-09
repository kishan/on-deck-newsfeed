import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>On Deck Newsfeed</title>
      </Head>
      <h1>On Deck Newsfeed</h1>
      <span>Select fellowship:</span>
      <Link href="/newsfeed/founders">
        <button>Founders</button>
      </Link>
      <Link href="/newsfeed/angels">
        <button>Angels</button>
      </Link>
      <Link href="/newsfeed/writers">
        <button>Writers</button>
      </Link>
    </Layout>
  )
}