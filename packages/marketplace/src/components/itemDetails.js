import { GAME_ITEMS } from '@/constants'
import { slugify } from "@/helpers"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "react-feather"
import { Card, BalanceCard } from "@/components/card"
import { useContext, useState } from 'react'
import { PanelContext } from '@/hooks/usePanel'

const Preview = ({ image }) => {
    return (
        <div class="bg-[#001237] w-[500px] h-[500px] m-auto bg-frame bg-no-repeat bg-cover flex">
            <img src={image} class="m-auto" />
        </div>
    )
}

const Details = ({ itemName, gameName, description, slug }) => {

    const [tab, setTab] = useState(1)

    const { showMintPanel } = useContext(PanelContext)

    return (
        <>
            <div className="w-full text-sm grid grid-cols-2 mb-1 gap-5">
                <div class="col-span-1 text-left">
                    <Link href="/items" className="hover:underline cursor-pointer flex flex-row">
                        <ArrowLeft size={16} className="mr-1 mt-auto mb-auto" />
                        All Items
                    </Link>
                </div>
                {gameName === "Pass" ? (
                    <div class="col-span-1 flex justify-end">
                        <Link href="/magic-pass" className="hover:underline cursor-pointer flex flex-row">Mint<ArrowRight size={16} className="ml-1 mt-auto mb-auto" /></Link>
                    </div>
                ) :
                    (
                        <div onClick={() => showMintPanel(slug)} class="col-span-1 flex justify-end">
                            <div className="hover:underline cursor-pointer flex flex-row">Mint<ArrowRight size={16} className="ml-1 mt-auto mb-auto" /></div>
                        </div>
                    )

                }
            </div>
            <h1 class="mb-2 text-4xl font-extrabold text-white">
                {itemName}
                <span class="bg-blue-100 ml-3 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ">{gameName}</span>
            </h1>
            <p class="text-sm">
                {description}
            </p>
            <div className="mt-4 grid grid-cols-4 gap-3">
                <Card
                    name={"Chain"}
                    value="Oasys L2"
                />
                <Card
                    name={"NFT Type"}
                    value="ERC-1155"
                />
                <Card
                    name={"Available"}
                    value="1000"
                />
                <Card
                    name={"Floor Price"}
                    value="Free"
                />
            </div>
            <BalanceCard />

            <ul class="text-sm  text-center mt-3 text-gray-500 divide-x divide-gray-200  font-bold   flex  ">
                <li class="w-full">
                    <div onClick={() => setTab(1)} class={`inline-block w-full p-4 text-white border border-r-0 cursor-pointer hover:underline ${tab === 1 && "active underline"}`} aria-current="page">Buy</div>
                </li>
                <li class="w-full">
                    <div onClick={() => setTab(2)} class={`inline-block w-full p-4 border border-l-0 text-white  cursor-pointer hover:underline ${tab === 2 && "active underline"}`}>Sell</div>
                </li>
            </ul>
            <div class="h-[200px] border border-t-0 p-2 overflow-x-auto">

            </div>
            <div className="mt-2 text-sm ">
                <p>The first batch is available to mint without any conditions, while the latter may require completing a quest.</p>
            </div>
            <div className=" mt-4">
                <button type="button" class="text-white w-full flex flex-row justify-center items-center bg-blue-700 hover:bg-blue-800  font-medium rounded  px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                    Create Order<ArrowRight className="ml-1" />
                </button>
            </div>
        </>
    )
}

const ItemDetails = ({ slug }) => {

    const data = GAME_ITEMS.find(item => slug === `${slugify(`${item.gameName}-${item.itemName}`)}`)

    return (
        <div class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between mb-8">
            {data && (
                <div className="w-full grid grid-cols-2 p-2">
                    <div className="col-span-1 flex p-2">
                        <Preview {...data} />
                    </div>
                    <div className="col-span-1">
                        <Details slug={slug} {...data} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemDetails