import { slugify } from "@/helpers"
import BaseModal from "./Base"
import { MINT_ITEMS } from "@/constants"
import { useCallback, useContext } from "react"
import { PanelContext } from "@/hooks/usePanel"

const CardItem = ({ 
    slug,
    open,
    item
}) => {

    return (
        <div onClick={() => open(slug)} class="   p-2 border rounded border-solid hover:border-blue-700 hover:cursor-pointer">
            <div className="w-full grid grid-cols-6">
                <div class="col-span-2 flex pt-2 pb-2">
                    <div class="w-[80px] h-[80px] m-auto flex">
                        <img src={item.image} className="m-auto" />
                    </div>
                </div>
                <div class="col-span-2 flex">
                    <div class="mt-auto mb-auto text-xs">
                        <p>
                            {item.gameName}{`'s `} {item.itemName}
                        </p>
                    </div>
                </div>
                <div class="col-span-2 flex">
                    <div class="mt-auto mb-auto text-xs">
                        <p>
                            {item.perEpoch} Units per Epoch
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SelectModal = ({ visible, close }) => {

    const { showMintPanel } = useContext(PanelContext)

    const onOpen = useCallback((slug) => {

        showMintPanel(slug)

        close()
    }, [close])

    return (
        <BaseModal
            title="Choose In-Game Item"
            visible={visible}
            close={close}
        >

            <div className="flex flex-col w-full">
                <div className="w-full grid grid-cols-1 mt-3 gap-3">
                    {MINT_ITEMS.map((item, index) => {

                        const slug = `${slugify(`${item.gameName}-${item.itemName}`)}`

                        return (
                            <div key={index} className="col-span-1">
                                <CardItem
                                    item={item}
                                    slug={slug}
                                    open={onOpen}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

        </BaseModal>
    )
}

export default SelectModal