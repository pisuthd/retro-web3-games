import { useState } from 'react'
import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AllItems from '@/components/allItems'

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
})

export default function Items() {

  const [filter, setFilter] = useState("all")

  return (
    <main
      className={`${quicksand.className}`}
    >
      <Header />

      <div class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between">
        <div className="w-full grid grid-cols-7 p-2 gap-5">
          <div className="col-span-1">
            <h1 class="text-3xl font-bold text-white">
              Filter
            </h1>
            <ul class="w-full mt-2 text-sm font-medium">
              <li class="w-full rounded-t-lg dark:border-gray-600">
                <div class="flex items-center pl-3">
                  <input onChange={(e) => setFilter(e.target.value)}  id="list-radio-license" type="radio" checked={filter === "all"} value="all" name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700   dark:bg-gray-600 dark:border-gray-500" />
                  <label for="list-radio-license" class="w-full py-2 ml-2 text-sm font-medium">All games </label>
                </div>
              </li>
              <li class="w-full rounded-t-lg dark:border-gray-600">
                <div class="flex items-center pl-3">
                  <input onChange={(e) => setFilter(e.target.value)} id="list-radio-pass" type="radio" checked={filter === "pass"} value="pass"  name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700   dark:bg-gray-600 dark:border-gray-500" />
                  <label for="list-radio-pass" class="w-full py-2 ml-2 text-sm font-medium  ">Magic Pass</label>
                </div>
              </li>
              <li class="w-full rounded-t-lg dark:border-gray-600">
                <div class="flex items-center pl-3">
                  <input onChange={(e) => setFilter(e.target.value)} id="list-radio-id" type="radio" checked={filter === "minesweeper"} value="minesweeper"  name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700   dark:bg-gray-600 dark:border-gray-500" />
                  <label for="list-radio-id" class="w-full py-2 ml-2 text-sm font-medium  ">Minesweeper</label>
                </div>
              </li>
              <li class="w-full   rounded-t-lg dark:border-gray-600">
                <div class="flex items-center pl-3">
                  <input onChange={(e) => setFilter(e.target.value)}  id="list-radio-millitary" type="radio" checked={filter === "blackjack"} value="blackjack"  name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700   dark:bg-gray-600 dark:border-gray-500" />
                  <label for="list-radio-millitary" class="w-full py-2 ml-2 text-sm font-medium ">Blackjack</label>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-span-6">
            <AllItems 
              filter={filter}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
