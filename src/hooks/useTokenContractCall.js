import React from 'react';
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
    useAccount,
} from 'wagmi';

import contract from '../contract';

const { useCallback }: ReactHooks = (React: any);

const useTokenContractCall = ({
    args,
    disabled = false,
    onSettled,
    contractNode,
    functionName,
}: {
    args?: Array<any>,
    disabled?: boolean,
    functionName: string,
    onSettled?: (data: any, error: Error) => void,
    contractNode: GraphNode,
}): { [string]: any } => {
    const { isConnected } = useAccount();
    const contractAddress = contract.address;
    const contractAbi = contract.abi;

    const { config, error: prepareError } = usePrepareContractWrite({
        addressOrName: contractAddress,
        args,
        enabled: !disabled && isConnected,
        contractInterface: contractAbi,
        functionName,
    });

    const {
        data: transactionResponse,
        error: sendError,
        isLoading: isSending,
        isSuccess: isSendSuccess,
        write: invokeCall,
    } = useContractWrite(config);

    const {
        data: transactionReceipt,
        error: waitError,
        isLoading: isWaiting,
        isSuccess: isWaitSuccess,
    } = useWaitForTransaction({
        hash: transactionResponse?.hash,
        onSettled:
            onSettled ||
            ((txReceipt, error) => {
                if (error) {
                    console.log('Error waiting transaction', { error });
                } else {
                    console.log(
                        `Transaction ${functionName} complete with ${
                            txReceipt.confirmations
                        } confirmations.`,
                    );
                }
            }),
    });

    const contractCall = useCallback(() => {
        if (disabled || !invokeCall) {
            return;
        }

        invokeCall();
    }, [disabled, invokeCall]);

    if (prepareError) {
        console.log('Error preparing contract call', { functionName, prepareError });
    }

    return {
        contractCall,
        invokeCall,
        isDisabled: !invokeCall,
        isSendSuccess,
        isSending,
        isWaitSuccess,
        isWaiting,
        prepareError,
        sendError,
        transactionReceipt,
        transactionResponse,
        waitError,
        error: prepareError || sendError || waitError,
        isCalling: isSending || isWaiting,
    };
};

export default useTokenContractCall;
