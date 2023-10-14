
import { GAME_ITEMS } from "@/constants"
import { useMemo } from "react"
import Link from "next/link"
import { slugify } from "@/helpers"

const CardItem = ({ 
    item
}) => {

    return (
            <Link href={`/item/${slugify(`${item.gameName}-${item.itemName}`)}`}>
                <div class="bg-[#001237] p-2 border rounded-md border-transparent hover:cursor-pointer hover:border-white">
                    <div className="w-full grid grid-cols-3">
                        <div class="col-span-2 flex pt-2 pb-2">
                            <div class="w-[180px] h-[180px] m-auto bg-frame bg-no-repeat bg-cover flex">
                                <img src={item.image} className="m-auto" />
                            </div>
                        </div>
                        <div class="col-span-1 flex">
                            <div class="mt-auto mb-auto text-sm">
                                <h2 class="text-white">
                                    Item
                                </h2>
                                <p>
                                    {item.itemName}
                                </p>
                                <h2 class="text-white">
                                    Available
                                </h2>
                                <p>
                                    10
                                </p>
                                <h2 class="text-white">
                                    Floor Price
                                </h2>
                                <p>
                                    1 OAS
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </Link>
    )
}

const AllItems = ({ filter = "all" }) => {

    const filtered = useMemo(() => {
        if (filter !== "all") {
            return GAME_ITEMS.filter(item => item.gameName.toLowerCase() === filter.toLowerCase())
        }
        return GAME_ITEMS
    }, [filter])

    return (
        <div className="flex flex-col w-full">
            <h1 class="text-3xl mb-2 font-bold text-white">
                All Items
            </h1>
            <div className="w-full grid grid-cols-3 mt-3 gap-3">
                {filtered.map((item, index) => {
                    return (
                        <div key={index} className="col-span-1">
                            <CardItem 
                                item={item}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllItems