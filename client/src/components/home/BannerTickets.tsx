import Countdown from '../../utils/Countdown'
import PrizePool from '../../utils/PrizePool'
import { useAccount, useContractReads } from 'wagmi'
import { useAddressNetwork } from '../../utils/useAddressNetwork'
import { ABI_Interpool } from '../../utils/ABI_Interpool'
import { ethers } from 'ethers'
import { useState } from 'react'
import { contestId } from '../../utils/contractAddress'

function BannerTickets({ ticket }: { ticket: number }) {
    const [rank, setRank] = useState('0');
    const [nbPlayers, setNbPlayers] = useState('0');
    const { address } = useAccount();
    const addressNetwork = useAddressNetwork();
    const interPoolContract = {
        address: addressNetwork.interPoolContract,
        abi: ABI_Interpool,
    }
    useContractReads({
        contracts: [
            {
                ...interPoolContract,
                functionName: 'getPlayerRank',
                args: [contestId, address],
            },
            {
                address: addressNetwork.interPoolContract,
                abi: ABI_Interpool,
                functionName: 'getNumberOfPlayers',
                args: [contestId],
            },
        ],
        watch: true,
        onSuccess(data: any) {
            setRank(ethers.utils.formatUnits(data[0]._hex, 0))
            setNbPlayers(ethers.utils.formatUnits(data[1]._hex, 0))
        },
    })



    return (
        <div className="w-layout-grid grid grid-with-ticket">
            <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217044-3d3dc5f0" className="div-block">
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217045-3d3dc5f0" className="div-block-2"><img src="images/ticket-2-blanc.png" loading="lazy" width="35" alt="" className="image" /></div>
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217047-3d3dc5f0" className="div-block-info">
                    <div className="div-block-13">
                        <div className="text-block-3">{ticket}</div>
                        <div className="text-block-3">x Tickets</div>
                    </div>
                    <div className="text-block">$ {ticket * 50}</div>
                </div>
            </div>
            <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb21704f-3d3dc5f0" className="div-block color-variation-1">
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217050-3d3dc5f0" className="div-block-2"><img src="images/ranking-blanc.png" loading="lazy" width="40" alt="" className="image" /></div>
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217052-3d3dc5f0" className="div-block-info">
                    <div className="text-block-3">Current Rank</div>
                    <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217055-3d3dc5f0" className="text-block">{rank} / {nbPlayers}</div>
                </div>
            </div>
            <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217057-3d3dc5f0" className="div-block colorvariation-2">
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217058-3d3dc5f0" className="div-block-2"><img src="images/piggy-bank-blanc.png" loading="lazy" width="40" alt="" className="image" /></div>
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb21705a-3d3dc5f0" className="div-block-info">
                    <div className="text-block-3">Prize Pool</div>
                    <PrizePool />
                </div>
            </div>
            <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb21705f-3d3dc5f0" className="div-block colorvariation-3">
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217060-3d3dc5f0" className="div-block-2"><img src="images/time-blanc.png" loading="lazy" width="40" alt="" className="image" /></div>
                <div id="w-node-_32c4b166-8f61-2091-35f0-1c2fdb217062-3d3dc5f0" className="div-block-info">
                    <div className="text-block-3">Prediction period</div>
                    <Countdown />
                </div>
            </div>
        </div>
    )
}
export default BannerTickets;