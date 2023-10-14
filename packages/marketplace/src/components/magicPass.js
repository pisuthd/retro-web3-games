// import { useState } from "react"

import { ArrowRight } from "react-feather"
import { GAME_ITEMS } from "@/constants"
import Link from "next/link"
import { BalanceCard, Card } from "@/components/card"


const MagicPass = () => {

    // const [currentBatch, setCurrentBatch] = useState(1)

    return (
        <div class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between mb-8">
            <div className="w-full grid grid-cols-2 p-2">
                <div className="col-span-1">
                    <div className="text-sm flex flex-row justify-end items-center">
                        <Link href="/item/pass-magic-pass" className="hover:underline cursor-pointer flex flex-row">Trade<ArrowRight size={16} className="ml-1 mt-auto mb-auto" /></Link>
                    </div>
                    <h1 class="mb-4 text-4xl font-extrabold text-white">
                        {GAME_ITEMS[0].itemName}
                    </h1>
                    <p class="text-sm">
                        {GAME_ITEMS[0].description}
                    </p>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                        <Card
                            name={"Chain"}
                            value="Oasys L2"
                        />
                        <Card
                            name={"NFT Type"}
                            value="ERC-721"
                        />
                        <Card
                            name={"Total"}
                            value="1000"
                        />
                        <Card
                            name={"Price"}
                            value="Free"
                        />
                    </div>
                    <BalanceCard/>
                    <h1 class="mt-4 mb-2 text-2xl font-extrabold text-white">
                        Schedule
                    </h1>
                    <p class="text-sm">
                        A mint schedule divided into 4 batches ensures fair access and convenient distribution of NFTs to our community.
                    </p>
                    <div class="mt-2 relative overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs  uppercase border-b border-[#abd7ff]">
                                <tr>
                                    <th scope="col" class="px-6 py-1">
                                        Batch
                                    </th>
                                    <th scope="col" class="px-6 py-1">
                                        Available
                                    </th>
                                    <th scope="col" class="px-6 py-1">
                                        Total
                                    </th>
                                    <th scope="col" class="px-6 py-1">
                                        From
                                    </th>
                                    <th scope="col" class="px-6 py-1">

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-[#abd7ff]">
                                    <th scope="row" class="px-6 py-3 font-medium">
                                        #1
                                    </th>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        October 2023
                                    </td>
                                    <td class="px-6 py-2">
                                        <span
                                            class="  font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient"
                                        >
                                            {`Mint Now`}
                                        </span>
                                    </td>
                                </tr>
                                <tr class="border-b border-[#abd7ff]">
                                    <th scope="row" class="px-6 py-3 font-medium">
                                        #2
                                    </th>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        March 2024
                                    </td>
                                    <td class="px-6 py-2">
                                    </td>
                                </tr>
                                <tr class="border-b border-[#abd7ff]">
                                    <th scope="row" class="px-6 py-3 font-medium">
                                        #3
                                    </th>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        August 2024
                                    </td>
                                    <td class="px-6 py-2">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="px-6 py-3 font-medium">
                                        #4
                                    </th>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        250
                                    </td>
                                    <td class="px-6 py-2">
                                        December 2024
                                    </td>
                                    <td class="px-6 py-2">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-2 text-sm ">
                        <p>The first batch is available to mint without any conditions, while the latter may require completing a quest.</p>
                    </div>
                    <div className=" mt-4">
                        <button type="button" class="text-white w-full flex flex-row justify-center items-center bg-blue-700 hover:bg-blue-800  font-medium rounded  px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                            Next<ArrowRight className="ml-1" />
                        </button>
                    </div>
                    <div className="  text-xs text-white text-center">
                        <p>Only one NFT per wallet </p>
                    </div>
                </div>
                <div className="col-span-1 flex p-2">
                    <div class="bg-[#001237] w-[500px] h-[500px] m-auto bg-frame bg-no-repeat bg-cover flex">
                        <img src="./items/magic-pass.png" class="m-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MagicPass