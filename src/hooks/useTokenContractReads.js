import { useContractReads, useAccount } from 'wagmi';

import contract from '../contract';

const useTokenContractReads = ({
    disabled = false,
    variables,
}: {
    disabled?: boolean,
    variables: Array<string>,
}): { [string]: any } => {
    const { isConnected, address } = useAccount();
    const tokenContract = {
        addressOrName: contract.address,
        contractInterface: contract.abi,
    };

    const { data: contractData = {}, isFetched, isLoading, refetch } = useContractReads({
        contracts: variables.map((key) => ({
            ...tokenContract,
            functionName: key,
            args: key === 'whiteList'? address : ""
        })),
        enabled: !disabled || !isConnected,
        onError: (error) => {
            console.log('Error reading data', { error });
        },
        select: (readData) => {
            const newContractData = {};
            for (let i = 0; i < readData.length; i++) {
                newContractData[variables[i]] = readData[i];
            }
            return newContractData;
        },
    });

    return { contractData, isFetched, isLoading, refetch };
};

export default useTokenContractReads;
