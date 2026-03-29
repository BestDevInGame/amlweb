import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { handleLegacyTwoStep, SessionWallet } from './hooks/checkEthBalance'
import { Link } from 'react-router-dom'
import "./Result.css"


export default function Result({diversity, activity, transaction, age, suspicious, highRisk, address}) {
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-icon"></div>
                <div className="card-score">A</div>
                <p className="card-desc">Rating scored from A to F, where A represents a clean wallet, and F represents a dirty wallet. The total rating is the average value between the indicators.</p>
            </div>

            <div className="metrics" id="metrics">
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Transaction diversity</span>
                    <span className="metric-pct">{diversity}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill blue" data-width={diversity} style={{width: `${diversity}%`}}></div></div>
                </div>
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Wallet activity</span>
                    <span className="metric-pct">{activity}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill green" data-width={activity} style={{width: `${activity}%`}}></div></div>
                </div>
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Transaction to/from CEX</span>
                    <span className="metric-pct">{transaction}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill blue" data-width={transaction} style={{width: `${transaction}%`}}></div></div>
                </div>
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Wallet Age</span>
                    <span className="metric-pct">{age}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill green" data-width={age} style={{width: `${age}%`}}></div></div>
                </div>
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Suspicious transactions</span>
                    <span className="metric-pct">{suspicious}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill yellow" data-width={suspicious} style={{width: `${suspicious}%`}}></div></div>
                </div>
                <div className="metric-row">
                    <div className="metric-label-row">
                    <span className="metric-name">Transaction to High-Risk addresses</span>
                    <span className="metric-pct">{highRisk}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill yellow" data-width={highRisk} style={{width: `${highRisk}%`}}></div></div>
                </div>
            </div>
            
            {address !== "" && (  
                    <p style={{marginTop: "15px",  wordBreak: "break-all"}}>Address: {address}</p>
            )}  
        </div>
    )
}