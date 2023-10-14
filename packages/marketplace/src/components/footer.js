


const Footer = () => {
    return (
        <footer class="m-2">
            <div class="w-full mx-auto max-w-screen-xl text-white p-4 pb-1 md:flex md:items-center md:justify-between">
                <span class="text-sm">© 2023 <a href="https://tamago.finance" class="hover:underline">Tamago Blockchain Labs KK</a>. All Rights Reserved.
                </span>
                <ul class="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
                    <li>
                        <a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
                    </li>
                    <li>
                        <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" class="mr-4 hover:underline md:mr-6">Term of Service</a>
                    </li> 
                </ul>
            </div>
        </footer>

    )
}

export default Footer