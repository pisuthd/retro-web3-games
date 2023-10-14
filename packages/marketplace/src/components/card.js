

export const Card = ({ name, value }) => {
    return (
        <div class="border border-white text-sm col-span-1 p-2">
            <p>{name}</p>
            <div class="text-white font-semibold">
                {value}
            </div>
        </div>
    )
}

export const BalanceCard = () => {
    return (
        <div className="mt-4 text-white text-sm font-bold">
            <div className="w-full grid grid-cols-3">
                <div class="col-span-2 flex">
                    You Owned : 0
                </div>
                <div class="col-span-1 flex">
                    
                </div>
            </div>

        </div>
    )
}