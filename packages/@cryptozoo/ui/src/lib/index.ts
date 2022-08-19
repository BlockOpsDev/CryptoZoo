import { ethers } from 'ethers';

export const humanizeEther = (amount: string): string => {
    const val = ethers.utils.commify(ethers.utils.formatEther(amount))
    return val.slice(0, val.indexOf('.'));
}

export const tryParseEther = (ether: string): string => {
    try {
        return humanizeEther(ethers.utils.parseEther(ether).toString());
    } catch (e) {
        return 'Invalid';
    }
}

export const shortAddress = (address: string): string => {
    return address.slice(0, 5) + '...' + address.slice(-4, address.length);
}
