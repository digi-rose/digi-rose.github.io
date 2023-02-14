import { Fragment, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import useTokenContractReads from '../hooks/useTokenContractReads.js';
import useTokenContractCall from '../hooks/useTokenContractCall.js';

import contract from '../contract.js';
import useTimer from './UseTimer.js';

const CONTRACT_DATA_KEYS = ['totalSupply'];

const Main = () => {
    const [receiverAddress, setReceiverAddress] = useState("0x0000000000000000000000000000000000000000");
    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    const isWrongNetwork = isConnected && contract.chainId !== chain.id;
    
    const { contractData = {}, isLoading } = useTokenContractReads({
        variables: CONTRACT_DATA_KEYS,
        disabled: isWrongNetwork,
    });

    const {
        totalSupply = '--'
    } = contractData;

    const {
        contractCall: preMint,
        isDisabled: isPreMintDisabled,
        error: preMintError,
        isCalling: isCallingPreMint,
        isWaitSuccess: isPreMintSuccess
    } = useTokenContractCall({
        args: [receiverAddress, { value: '0', gasLimit: 200000 }],
        disabled: isWrongNetwork,
        functionName: 'mint',
    });

    console.log('QA: data', {totalSupply, preMintError});

    const { days, hours, minutes, seconds } = useTimer("2023-02-15T10:59:59+00:00");

    const renderMessage = () => {
        return (
            <Fragment>
                <div className='div'>
                    <h2>DigiRose - All for love</h2>
                </div>
                <div className='div'>
                    {`TIME LEFT: `}
                    <span className='emphasize'>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</span>
                </div>
                <div className='div'>
                    {`PRICE: `}
                    <span className='emphasize'>{`FREE`}</span>
                </div>
                <div className='div_bottom'>
                    {`TOTAL MINTED: `}
                    <span className='emphasize'>{`${totalSupply}`}</span>
                </div>
            </Fragment>
        );
    }

    const renderMintButton = () => {
        const mintFunc = preMint;        

        const isMinting = isCallingPreMint;
        const isSuccess = isPreMintSuccess;
        const error = preMintError;
        let errorMessage = '';
        if (error) {
            if (error.error) {
                errorMessage = error.error.data?.message || error.error.message;
            }
            if (!errorMessage && error.reason) errorMessage = error.reason;
            if (!errorMessage && error.data) errorMessage = error.data.message;

            if (errorMessage && errorMessage.indexOf(':') > 0) errorMessage = errorMessage.split(':')[1];
        }
        const isDisabled = isMinting || isPreMintDisabled;

        return (
            <div>
                <hr/>
                <div>
                    <h2 for="address">Enter Receiver's Wallet Address: </h2>
                    <span>*Cannot Be Your Own Wallet Address</span>
                    <input id="address" type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={e => setReceiverAddress(e.target.value)} />
                </div>
                <div
                    className={`mint-btn${isDisabled ? ' disabled' : ''}`}
                    onClick={mintFunc}
                >
                    {isMinting ? 'Minting' : 'Mint'}
                </div>
                <div className='mint-error'>{ errorMessage }</div>
                <div className='mint-success'>{ isSuccess && 'Success!!' }</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="main">
            <div className="mint-image">
                <img src="./logo.jpg" alt="DigiRose"/>
            </div>
            <div className="mint-stats">
                {renderMessage()}
            </div>
            {renderMintButton(preMintError)}
        </div>
    );
};

export default Main;