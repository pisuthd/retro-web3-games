import { Plus } from "react-feather"
import SelectModal from "@/modals/Select"
import { useState } from "react"


const Thumbnail = ({ trigger }) => {
    return (
        <div className="m-auto">
            <div onClick={trigger} className="border-2 flex items-center justify-center border-[#abd7ff] border-dashed hover:cursor-pointer   rounded-lg w-[80px] h-[80px]">
                <Plus
                    size="36"
                />
            </div>
        </div>
    )
}

const MyStaking = () => {

    const [visible, setVisible] = useState(false)

    return (
        <>
            <SelectModal
                visible={visible}
                close={() => setVisible(false)}
            />
            <div class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between">
                <div className="flex flex-col w-full">
                    <h1 class="mb-4 mt-4 text-3xl font-bold text-white">
                        My Staking
                    </h1>
                    <div class="h-40 w-full rounded-md bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 p-[2px]">
                        <div class="flex h-full w-full  bg-[#001237] back ">
                            <div className="w-full grid grid-cols-10 p-2 gap-1">
                                <div className="col-span-2 flex">
                                    <Thumbnail
                                        trigger={() => setVisible(true)}
                                    />
                                </div>
                                <div className="col-span-4 flex">
                                    <div className="m-auto text-sm p-1 ml-0">
                                        <h2 class="text-white text-lg">No items being minted</h2>
                                        Acquire the Magic Pass NFT and stake for in-game items
                                    </div>

                                </div>
                                <div className="col-span-4">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default MyStaking