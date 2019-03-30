/**
 * @file setNewPermission.js
 * @author zhouminghui
*/

import {message} from 'antd';
import config from '../../config/config';
export default function setNewPermission(payload) {
    const {
        appName,
        address
    } = payload;
    window.NightElf.api({
        appName,
        method: 'OPEN_PROMPT',
        chainId: 'AELF',
        hostname: 'aelf.io',
        payload: {
            // 在中间层会补齐
            // appName: 'hzzTest',
            // method 使用payload的
            // chainId: 'AELF',
            // hostname: 'aelf.io',
            payload: {
                method: 'SET_CONTRACT_PERMISSION',
                address,
                contracts: [{
                    chainId: 'AELF',
                    contractAddress: config.multiToken,
                    contractName: 'Token',
                    description: 'contract Token'
                }, {
                    chainId: 'AELF',
                    contractAddress: config.dividends,
                    contractName: 'Dividend',
                    description: 'contract Dividend'
                }, {
                    chainId: 'AELF',
                    contractAddress: config.consensusDPoS,
                    contractName: 'Consensus.Dpos',
                    description: 'contract Consensus'
                },
                {
                    chainId: 'AELF',
                    contractAddress: config.resource,
                    contractName: 'Resource',
                    description: 'contract Resource'
                }]
            }
        }
    }).then(result => {
        if (result && result.error === 0) {
            message.success('Update Permission success!!', 3);
        }
        else {
            message.error(result.errorMessage.message, 3);
        }
    });
}

