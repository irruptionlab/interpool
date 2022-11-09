import { ethers } from 'ethers'
import { useState } from 'react'
import { useAccount, usePrepareContractWrite, useContractWrite, useContractReads } from 'wagmi'
import { erc20ABI } from 'wagmi'
import { ABI_Interpool } from '../../utils/ABI_Interpool'
import Faucet from '../../utils/Faucet'
import { useAddressNetwork } from '../../utils/useAddressNetwork'
import { ToastContainer, toast } from 'react-toastify';

function Approve({ amount }: { amount: number }) {
    const addressNetwork: any = useAddressNetwork()

    const { config } = usePrepareContractWrite({
        address: addressNetwork.usdcContract,
        abi: erc20ABI,
        functionName: 'approve',
        args: [addressNetwork.interPoolContract, ethers.BigNumber.from(amount * 10 ** 6)],
    })
    const { write } = useContractWrite({
        ...config,
        onSuccess(data) {
            toast("⚽ Approve Request Submitted!");
        },
    })

    return (
        <a href="/" className="hollow-button white" onClick={(e) => {
            e.preventDefault()
            write?.()
        }}>Approve USDC Amount</a>
    )
}

function Deposit({ amount, setModalDeposit }: { amount: number, setModalDeposit: React.Dispatch<React.SetStateAction<boolean>> }) {
    const addressNetwork: any = useAddressNetwork()

    const { config }: { config: any } = usePrepareContractWrite({
        address: addressNetwork.interPoolContract,
        abi: ABI_Interpool,
        functionName: 'depositOnAave',
        args: [ethers.BigNumber.from(amount)]
    })
    const { write } = useContractWrite({
        ...config,
        onSuccess(data) {
            toast("⚽ Deposit Request Submitted!")
            setTimeout(function () { setModalDeposit(false) }, 3000)
        },
    })
    return (
        <a href="/" className="hollow-button white" onClick={(e) => {
            e.preventDefault()
            write?.()
        }}>Confirm Deposit</a>
    )
}

function ModalDeposit({ nbTickets, setModalDeposit }: { nbTickets: number, setModalDeposit: React.Dispatch<React.SetStateAction<boolean>> }) {
    const addressNetwork: any = useAddressNetwork()
    const [balance, setBalance] = useState(0)
    const [amountApproved, setAmountApproved] = useState(0)
    const { address }: { address: any } = useAccount()
    useContractReads({
        contracts: [
            {
                address: addressNetwork.usdcContract,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: addressNetwork.usdcContract,
                abi: erc20ABI,
                functionName: 'allowance',
                args: [address, addressNetwork.interPoolContract],
            },
        ],
        watch: true,
        onSuccess(data) {
            setBalance(parseFloat(ethers.utils.formatUnits(data[0]._hex, 6)))
            setAmountApproved(parseFloat(ethers.utils.formatUnits(data[1]._hex, 0)))
        }
    })

    return (
        <div className="modal-wrapper">
            <div data-w-id="17b55dba-8acd-ac79-4b99-88a555b29f51" className="modal-outside-trigger" onClick={(e) => { setModalDeposit(false) }}></div>
            <div className="modal-inner-wrapper">
                <div className="div-block-41"><img src="images/close.png" loading="lazy" width="20" height="20" data-w-id="17b55dba-8acd-ac79-4b99-88a555b29f54" alt="" className="image-18" onClick={(e) => { setModalDeposit(false) }} /></div>
                <h2 className="heading-7">Deposit Confirmation</h2>
                <p className="paragraph">Once you have your ticket(s) you become eligible to enter the prediction game. More tickets you own, higher are your rewards (more info <a href="https://app.gitbook.com/o/esvKHPPOt4LZoy42lERC/s/9TtqoT2sXyCd3aHeyycM/welcome/frequently-asked-questions#prizes-and-winning">here</a>)<br /></p>
                <div className="div-block-50">
                    <div className="text-block-45">Wallet balance:</div>
                    <div className="text-block-44">{balance}</div>
                </div>
                <div className="div-block-39 div-block-39-variation">
                    <div className="div-block-36">
                        <div className="div-block-37"><img src="images/usd-coin-usdc-logo.png" loading="lazy" srcSet="images/usd-coin-usdc-logo-p-500.png 500w, images/usd-coin-usdc-logo-p-800.png 800w, images/usd-coin-usdc-logo-p-2000.png 2000w, images/usd-coin-usdc-logo.png 2000w" sizes="100vw" alt="" className="image-16" />
                            <div className="text-block-43">{nbTickets * 50}</div>
                        </div>
                        <div className="text-block-41">USDC*</div>
                    </div>
                    <div className="div-block-38"><img src="images/next.png" loading="lazy" alt="" className="image-17" /></div>
                    <div className="div-block-36">
                        <div className="div-block-37"><img src="images/ticket-2.png" loading="lazy" alt="" className="image-16" />
                            <div className="text-block-43">{nbTickets}</div>
                        </div>
                        <div className="text-block-41">x Ticket(s)</div>
                    </div>
                </div>
                {balance >= 50 && amountApproved < nbTickets * 50 && <Approve amount={nbTickets * 50} />}
                {balance >= 50 && amountApproved >= nbTickets * 50 && <Deposit amount={nbTickets * 50} setModalDeposit={setModalDeposit} />}
                {balance < 50 && <Faucet />}
                <p className="paragraph-2">*Get your Deposit back anytime after the game completion.</p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ModalDeposit;