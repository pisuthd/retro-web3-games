import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'

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

      <div className='text-center  p-6 text-4xl'>
         <h2>Will be available soon</h2>
      </div>

     
      <Footer/>
    </main>
  )
}
