import Link from "next/link"



export const MagicPassJumbotron = () => {
    return (
        <div class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between">

            <section class="bg-[#001237]  border rounded-md border-[#abd7ff]">
                <div class="py-8 px-4 mx-auto max-w-screen-xl  lg:py-16">
                    <div className="grid grid-cols-5 p-2 gap-5">
                        <div className="col-span-3">
                            <h1 class="mb-4 text-4xl font-extrabold    md:text-5xl lg:text-6xl  text-white">
                                MAGIC PASS NFT COLLECTIONS
                            </h1>
                            <p class="mb-4 text-lg font-normal text-[#abd7ff] lg:text-xl ">
                            A pass that is the gateway to the RetroWeb3.games platform enables you to stake to receive game items for playing or trading
                            </p>
                            <div class="flex flex-row mb-6 ">
                                <h2 class="text-2xl font-extrabold text-white mt-auto mb-auto">
                                    <span
                                        class="text-2xl font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient"
                                    >
                                        12
                                    </span> / 1000 MINTED
                                </h2> 
                            </div>

                            <div class=" mb-4 flex flex-row ">
                                <Link href="/magic-pass" class="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                                    Mint Now
                                </Link> 
                            </div> 
                        </div>
                        <div className="col-span-2">
                            <img src="./illustration-jumbotron-magic-pass.png" class="w-3/4 m-auto" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

