/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Spin,
  Button,
  Icon,
  Divider
} from 'antd';
import {ADDRESS_INFO} from '../../../../../config/config';
import { SYMBOL, ELF_DECIMAL } from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import './ResourceAElfWallet.less';

export default class ResourceAElfWallet extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      defaultWallet: {
        name: '-',
        address: '-'
      },
      balance: '-',
      RAM: '-',
      CPU: '-',
      NET: '-',
      STO: '-',
      loading: true
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    this.refreshWalletInfo();
  }

  // TODO: 组件要尽量无状态，这是个反模式
  // 数据都从父组件传递进来。
  componentDidUpdate(prevProps, prevState, snapshot) {
    const preIsNotNull = prevProps.currentWallet !== null;
    let canBeRefresh = false;
    if (preIsNotNull) {
      if (prevProps.currentWallet.address !== this.props.currentWallet.address) {
        canBeRefresh = true;
      }
    }
    else if (this.props.currentWallet && this.props.currentWallet.address) {
      canBeRefresh = true;
    }
    if (this.props.tokenContract) {
      canBeRefresh = true;
    }

    if (canBeRefresh) {
      this.refreshWalletInfo();
    }
  }

  refreshWalletInfo() {
    const {
      tokenContract,
      currentWallet
    } = this.props;
    if (tokenContract && currentWallet) {
      Promise.all([
        this.getCurrentWalletBalance(),
        this.getCurrentWalletResource()
      ]).then(() => {
        this.setState({
          loading: false
        })
      }).catch(() => {
        this.setState({
          loading: false
        })
      });
    }
  }

  getCurrentWalletBalance = async () => {
    const {
      tokenContract,
      currentWallet,
      getCurrentBalance
    } = this.props;
    const payload = {
      symbol: SYMBOL,
      owner: currentWallet.address || currentWallet
    };
    const result = await tokenContract.GetBalance.call(payload);
    const balance = parseInt(result.balance || 0, 10) / ELF_DECIMAL;
    this.setState({
      balance
    });
    getCurrentBalance(balance);
  };

  // 获取资源币数量
  getCurrentWalletResource = () => {
    const {
      tokenContract,
      currentWallet,
      getResource
    } = this.props;
    const owner = currentWallet.address || currentWallet;
    const symbols = ['RAM', 'CPU', 'NET', 'STO'];
    return Promise.all(symbols.map(symbol => {
      return tokenContract.GetBalance.call({
        symbol,
        owner
      });
    })).then(results => {
      const newState = results.reduce((acc, v) => {
        const balance = parseInt(v.balance || 0, 10) / ELF_DECIMAL;
        return {
          ...acc,
          [v.symbol]: balance
        }
      }, {});
      this.setState(newState);
      getResource(newState);
    });
  };

  onRefresh() {
    this.setState({
      loading: true
    });
    Promise.all([
      this.getCurrentWalletBalance(),
      this.getCurrentWalletResource()
    ]).then(() => {
      this.setState({
        loading: false
      })
    }).catch(() => {
      this.setState({
        loading: false
      })
    });
  }

  render() {
    const {
      title,
      currentWallet,
    } = this.props;
    const {
      balance,
      RAM,
      CPU,
      NET,
      STO,
      loading,
      defaultWallet,
    } = this.state;

    const propsTile = title || '-';
    const wallet = (currentWallet && currentWallet.address) ?  currentWallet : defaultWallet;

    return (
      <div className='resource-wallet resource-block'>
        <Spin tip='loading....' size='large' spinning={loading}>
          <div className='resource-wallet-header resource-header'>
            <Icon type="wallet" className="resource-icon" />
            <span className="resource-title">{propsTile}</span>
          </div>
          <div className="resource-sub-container">
            <div className="resource-wallet-address">
              <span className='resource-wallet-address-name'>
                {wallet.name}
                &nbsp;&nbsp;&nbsp;
                {ADDRESS_INFO.PREFIX + '_' + wallet.address + '_' + ADDRESS_INFO.CURRENT_CHAIN_ID}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                { wallet.address !== '-' && <Link to={`/resourceDetail/${wallet.address}`}>
                  Transaction Details
                </Link> }
              </span>
              <Button
                  className='resource-wallet-address-update update-btn'
                  onClick={this.onRefresh}
              >
                <Icon type='sync' spin={loading} />
              </Button>
            </div>

            <div className='resource-wallet-info'>
              <Row type="flex" align="middle">
                <Col span={24}>
                  <span className="resource-wallet-info-name balance">Balance:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(balance)} ELF</span>
                </Col>
                <Col
                    lg={12}
                    xs={24}
                    sm={12}
                >
                  <span className="resource-wallet-info-name">RAM Quantity:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(RAM)}</span>
                </Col>
                <Col
                    lg={12}
                    xs={24}
                    sm={12}
                >
                  <span className="resource-wallet-info-name">NET Quantity:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(NET)}</span>
                </Col>
                <Col
                    lg={12}
                    xs={24}
                    sm={12}
                >
                  <span className="resource-wallet-info-name">CPU Quantity:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(CPU)}</span>
                </Col>
                <Col
                    lg={12}
                    xs={24}
                    sm={12}
                >
                  <span className="resource-wallet-info-name">STO Quantity:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(STO)}</span>
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
