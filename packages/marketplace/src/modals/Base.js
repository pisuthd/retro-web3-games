import { X } from "react-feather"



const BaseModal = ({
    visible,
    title,
    close,
    children
}) => {
    return (
        <>
            {visible && (
                <div class="fixed inset-0 flex items-center justify-center z-50">
                    <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div class="relative bg-[#001237] p-6 w-full max-w-xl text-white rounded-lg">
                        <h5 class="text-xl font-bold mb-2">{title}</h5>
                        <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-400" onClick={close}>
                            <X />
                        </button>
                        {children} 
                    </div>
                </div>
            )}
        </>
    )
}

export default BaseModal