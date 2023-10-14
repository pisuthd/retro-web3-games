import { useState } from 'react'
import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useRouter } from 'next/router'
import ItemDetails from '@/components/itemDetails'
import { GAME_ITEMS } from '@/constants'
import { slugify } from "@/helpers"

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
})

export default function ItemDetailsPage(props) {

  return (
    <main
      className={`${quicksand.className}`}
    >
      <Header />
      <ItemDetails
        {...props}
      />
      <Footer />
    </main>
  )
}

export async function getStaticProps( { params }) {

  const { slug } = params

  return {
    props: {
      slug
    }
  };
}

export async function getStaticPaths() {

  return {
    paths: GAME_ITEMS.map((item) => { 
      return {
        params: {
          slug: `${slugify(`${item.gameName}-${item.itemName}`)}`
        }
      }
    }),
    fallback: false,
  };
}