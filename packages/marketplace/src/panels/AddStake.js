import { MINT_ITEMS } from "@/constants"
import BasePanel from "./Base"
import { useEffect, useState } from "react"
import { slugify } from "@/helpers"
import { BalanceCard } from "@/components/card"

const AddStake = ({ visible, close, slug }) => {

    const data = MINT_ITEMS.find(item => `${slugify(`${item.gameName}-${item.itemName}`)}` === slug)

    const perEpoch = data ? data.perEpoch : 1

    let min = new Date();
    min.setSeconds(min.getSeconds() + Math.ceil(86400 / perEpoch));

    let fullEpoch = new Date()
    fullEpoch.setDate(fullEpoch.getDate() + 1);

    return (
        <BasePanel
            visible={visible}
            close={close}
        >
            {data && (
                <div>
                    <h2 class="text-3xl mb-2 mt-2 font-bold">
                        Mint {`${data.itemName}`}
                        <span class="bg-blue-100 ml-3 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ">{data.gameName}</span>
                    </h2>
                    <p className="mt-4  text-sm text-[#abd7ff]">
                        You need to have the Magic Pass NFT to mint in-game items by locking it in the smart contract for a specified period. Items will be minted at the rates specified below upon withdrawal.
                    </p>

                    <div class="bg-[#001237] mt-4 mb-4 p-2 border rounded-md border-transparent w-1/2 ml-auto mr-auto">
                        <div className="w-full grid grid-cols-2">
                            <div class="col-span-2 flex pt-2 pb-2">
                                <div class="w-[180px] h-[180px] m-auto bg-frame bg-no-repeat bg-cover flex">
                                    <img src={data.image} className="m-auto" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 mb-4 relative overflow-x-auto">
                        <table class="w-full text-sm text-left ">

                            <tbody>
                                <tr class=" border-b ">
                                    <th scope="row" class="px-6 py-4 font-medium  0 whitespace-nowrap ">
                                        Name
                                    </th>
                                    <td class="px-6 py-4">
                                        {data.itemName}
                                    </td>
                                </tr>
                                <tr class=" border-b ">
                                    <th scope="row" class="px-6 py-4 font-medium  0 whitespace-nowrap ">
                                        Type
                                    </th>
                                    <td class="px-6 py-4">
                                        ERC-1155
                                    </td>
                                </tr>
                                <tr class=" border-b">
                                    <th scope="row" class="px-6 py-4 font-medium   whitespace-nowrap">
                                        Per Epoch
                                    </th>
                                    <td class="px-6 py-4">
                                        {data.perEpoch} Units
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 mb-4 text-center text-xs">
                        Example Timeline
                    </div>
                    <ol
                        class="border-l border-neutral-300   md:flex md:justify-center md:gap-6 md:border-l-0 md:border-t">

                        <li class="flex-1">
                            <div class="flex-start flex items-center pt-2 md:block md:pt-0">
                                <div
                                    class="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500 md:-mt-[5px] md:ml-0 md:mr-0"></div>
                                <p class="mt-2 text-xs text-[#abd7ff]">
                                    {(new Date().toLocaleString())}
                                </p>
                            </div>
                            <div class="ml-4 mt-2 pb-5 md:ml-0">
                                <h4 class="mb-1.5 text-xl font-semibold">Start</h4>
                                <p class="mb-3   text-[#abd7ff] dark:text-neutral-300">
                                    When you withdraw your pass during this period, you will not receive any items.
                                </p>
                            </div>
                        </li>

                        <li class="flex-1">
                            <div class="flex-start flex items-center pt-2 md:block md:pt-0">
                                <div
                                    class="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500 md:-mt-[5px] md:ml-0 md:mr-0"></div>
                                <p class="mt-2 text-xs text-[#abd7ff] dark:text-neutral-300">
                                    {min.toLocaleString()}
                                </p>
                            </div>
                            <div class="ml-4 mt-2 pb-5 md:ml-0">
                                <h4 class="mb-1.5 text-xl font-semibold">Min. to Earn</h4>
                                <p class="mb-3 text-[#abd7ff] dark:text-neutral-300">
                                    Stake beyond this point, you will receive at least 1 in-game item.
                                </p>
                            </div>
                        </li>

                        <li class="flex-1">
                            <div class="flex-start flex items-center pt-2 md:block md:pt-0">
                                <div
                                    class="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500 md:-mt-[5px] md:ml-0 md:mr-0"></div>
                                <p class="mt-2 text-xs text-[#abd7ff] dark:text-neutral-300">
                                    {fullEpoch.toLocaleString()}
                                </p>
                            </div>
                            <div class="ml-4 mt-2 pb-5 md:ml-0">
                                <h4 class="mb-1.5 text-xl font-semibold">Full Epoch</h4>
                                <p class="mb-3 text-[#abd7ff] dark:text-neutral-300">
                                    Beyond this point, you will receive all items at the full epoch.
                                </p>
                            </div>
                        </li>
                    </ol>

                    <div class="mt-2 ">
                        <button class="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 w-full">
                            Stake Now
                        </button>
                        <div className="mt-2  text-[#abd7ff] text-center text-xs">
                        Your Pass : 0
                    </div>
                    </div>

                </div>
            )

            }
        </BasePanel>
    )
}

export default AddStake