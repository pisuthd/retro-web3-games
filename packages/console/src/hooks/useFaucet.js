import { useWeb3React } from "@web3-react/core"
import { useContext } from "react";
import { ethers } from "ethers";
import FaucetABI from "../abi/Faucet.json"
import { host, faucetAddress } from "../constants"
import { useCallback } from "react";
import { AccountContext } from "./useAccount";
import axios from "axios"

const useFaucet = () => {

    const { account, library } = useWeb3React()
    const { corrected } = useContext(AccountContext)

    const getBalance = useCallback(async () => {

        if (!corrected) {
            return "N/A"
        }

        const contract = new ethers.Contract(faucetAddress, FaucetABI, library.getSigner());

        const total = await contract.total()

        return `${ethers.utils.formatEther(total)} OAS`
    }, [corrected, library])

    const claim = useCallback(async (address) => {

        await axios.post(`${host}/faucet` , {
            address
        })

    }, [])

    return {
        claim,
        getBalance
    }
}

export default useFaucet