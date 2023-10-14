import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import MagicPass from '@/components/magicPass'

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
})

export default function MagicPassPage() {
  return (
    <main
      className={`${quicksand.className}`}
    >
      <Header />
      <MagicPass/>
      <Footer/>
    </main>
  )
}
