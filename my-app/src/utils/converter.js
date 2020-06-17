import Web3 from 'web3';

export const fromWei = (value) => {
    return Web3.utils.fromWei(value.toString(), 'ether');
};