


const Header = () => {
    return (
        <nav class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between">
            <div class=" flex flex-wrap items-center justify-between mx-auto p-2 w-full">
                <div class="flex items-center">
                    <a href="https://retroweb3.games">
                        <img src="./logo.png" class="mr-3" style={{ width: "225px" }} alt="Logo" />
                    </a>

                    <a href="#"  class="self-center hover:text-white whitespace-nowrap">Marketplace</a>
                </div>

                <div class="  w-auto" id="navbar-default">
                    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border  rounded-lg   md:flex-row md:space-x-8 md:mt-0 md:border-0   ">
                    <li>
                            <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Explore</a>
                        </li>
                        <li>
                            <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Stake</a>
                        </li>
                        <li>
                            <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Magic Pass</a>
                        </li> 
                        <li>
                            <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Console</a>
                        </li>
                    </ul>
                </div>
            </div>

        </nav>
    )
}

export default Header