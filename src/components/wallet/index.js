import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import * as Actions from './../../actions'
import { timeStampToHR } from './../../utils/secsToHMS'

import CurrencyBox from './CurrencyBox'

const {clipboard } = window.electron

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addressCopied: false
        }
    }

    componentWillUnmount() {
        if(this.copyTimeout){
            clearTimeout(this.copyTimeout)
        }
    }

    _handleExpandWallet(){
    	const element = document.getElementById("sectionWallet");
    	const expandButton = document.getElementById("expandWalletButton");
   		element.classList.toggle("expand__wallet");
   		expandButton.classList.toggle("icon-arrow-down");
   		expandButton.classList.toggle("icon-arrow-up");
    }

    _handleCopyToClipboard(_publicKey, evt) {
        if (_publicKey) {
            clipboard.writeText(_publicKey)
            this.setState({
                addressCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        addressCopied: false
                    })
                }, 5000)
            })
        }
    }

    _handleWithdrawModal(_suffix, _currency, _balance){
        this.props.actions.callWithdrawModal(true, {
            suffix: _suffix,
            currency: _currency,
            balance: _balance
        })
    }

    render() {
        const { publicKey, balance, currency} = this.props
        const { addressCopied } = this.state
        return (
        	<div id="sectionWallet" className="section__wallet">
	            <div className="content__wallet">
	                <div className="panel_box">
	                	<CurrencyBox balance={balance[0]} currency={currency} suffix="GNT" description="Test tooltip for GNT" clickHandler={::this._handleWithdrawModal}/>
	                	<CurrencyBox balance={balance[1]} currency={currency} suffix="ETH" description="Test tooltip for ETH" clickHandler={::this._handleWithdrawModal}/>
	                </div>
	                <span id="expandWalletButton" className="icon-arrow-down" onClick={::this._handleExpandWallet}/>
	            </div>
	            <div className="address-box__wallet">
		            <div>
		            	<span>Your address - </span>
		            	<span>send GNT and ETH to this address to top up your account</span>
		            </div>
		            <div>
		            	<input className="input__public-key" type="text" value={publicKey} readOnly/>
	                	<span className={`icon-${addressCopied ? "checkmark" : "copy"}`} onClick={this._handleCopyToClipboard.bind(this, publicKey)}/>
                        {addressCopied && <span className="status-copy_address">address copied</span>}
		            </div>
	            </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
