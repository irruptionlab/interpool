// import WCMatchLists from "../components/WCMatchLists";
import WCMatchListsClosed from "../components/WCMatchListsClosed";
import BannerCountdown from "../components/home/BannerCountdown";
import BannerNoTicket from "../components/home/BannerNoTicket";
import BannerTickets from "../components/home/BannerTickets";
import { useAccount, useContractRead, erc20ABI } from "wagmi";
import { useAddressNetwork } from '../utils/useAddressNetwork'
import { ethers } from 'ethers'
import { useState } from "react";
import { players } from '../utils/manualResult'

function SectionHome() {
    const addressNetwork = useAddressNetwork()
    const [ticket, setTicket] = useState(0)
    const { isConnected, address }: { isConnected: boolean, address: any } = useAccount()
    useContractRead({
        address: addressNetwork.interPoolTicketContract,
        abi: erc20ABI,
        functionName: 'balanceOf',
        watch: true,
        args: [isConnected ? address : "0x000000000000000000000000000000000000dEaD"],
        onSuccess(data: any) {
            setTicket(parseInt(ethers.utils.formatUnits(data._hex, 0)))
        },
    })

    const found = players.find(element => element.player === address);
    console.log(found)

    return (
        <section id="home" data-w-id="67ad9710-d385-0ebf-87e3-5d5f429160e0" className="section-home wf-section">
            <div className="container w-container">
                <BannerCountdown />
                {(ticket === 0) && <BannerNoTicket />}
                {(ticket > 0) && <BannerTickets ticket={ticket} />}
                <h1 className="heading-5">QATAR WORLD CUP 2022 <br />~ Prediction Game ~</h1>
                <h1 className="heading-2">If you wanna win big, just be better than the others!</h1>
                <div className="div-block-54">
                    <div className="div-block-51">
                        <img src="images/arrow2-white.svg" loading="lazy" width="45" alt="" className="arrow-prediction" />
                        <h1 className="heading-10">Your predictions</h1>
                        <img src="images/arrow2-white.svg" loading="lazy" width="45" alt="" className="image-21 arrow-prediction" />
                    </div>
                    <div className="w-layout-grid grid-10">
                        <div className="div-block-52">
                            <h1 className="heading-10 heading-10-variation">Current rank:</h1>
                            <h1 className="heading-10 heading-10-variation-2"> {found?.rank}/20</h1>
                        </div>
                        <div className="div-block-52 div-block-52-color-variation">
                            <h1 className="heading-10 heading-10-variation">Current score:</h1>
                            <h1 className="heading-10 heading-10-variation-2">{found?.points}</h1>
                        </div>
                    </div>
                    <div className="div-block-53">

                    </div>
                </div>
                {/* <WCMatchLists ticket={ticket} /> */}
                <WCMatchListsClosed ticket={ticket} />
                <div className="div-block-7">
                    <div className="text-block-5">You have 100% chance to win *</div>
                    <div className="text-block-6">* This is actually true <a href="https://irruption-lab.gitbook.io/interpool/welcome/frequently-asked-questions#prizes-and-winning" target="_blank" rel="noreferrer" className="link-4">(see details)</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default SectionHome;