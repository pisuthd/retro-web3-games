import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { MagicPassJumbotron } from '@/components/jumbotron'
import MyStaking from '@/components/myStaking'
import AllItems from '@/components/allItems'
import HowToStake from '@/components/howToStake'
import RecentListing from '@/components/recentListing'

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <main
      className={`${quicksand.className}`}
    >
      <Header />

      <MagicPassJumbotron/>
      <MyStaking/>
      {/* <HowToStake/> */}
     
      <RecentListing/>

     

      <Footer/>
    </main>
  )
}
