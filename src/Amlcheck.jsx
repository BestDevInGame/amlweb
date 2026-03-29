import { useEffect, useMemo, useState } from "react"; 
import "./Amlcheck.css";
import { Link } from "react-router-dom";
import Checkbutton from "./Checkbutton";
import Result from "./Result";


export default function AMLCheck() {
  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width + "%";
      });
    }, 400);
  }, []);

  return (
    <>
        <body>
            <nav>
                <a className="logo" href="#">
                    <div className="logo-icon"></div>
                    AML Check
                </a>
                <ul className="nav-links">
                    <li><Link to="/pricing">Price</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                </ul>
                {/* <a href="#" className="btn-primary">Check your wallet</a> */}
                <Checkbutton/>
            </nav>

            <section className="hero">
                <div className="hero-text">
                    <h1 className="hero-title">Checking cryptocurrency wallets for dirty money</h1>
                    <p className="hero-sub">By checking your wallets, you protect yourself from scammers and stolen coins.</p>
                    <Link to="/check" className="btn-blue">Check your wallet</Link>
                </div>

                <Result diversity={20} activity={70} age={60} highRisk={55} suspicious={55} transaction={20} address={""}/>
                {/* <div className="card">
                    <div className="card-header">
                        <div className="card-icon"></div>
                        <div className="card-score">12.55%</div>
                        <p className="card-desc">Rating scored from A to F, where A represents a clean wallet, and F represents a dirty wallet. The total rating is the average value between the indicators.</p>
                    </div>

                    <div className="metrics" id="metrics">
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Transaction diversity</span>
                        <span className="metric-pct">20%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill blue" data-width="20"></div></div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Wallet activity</span>
                        <span className="metric-pct">70%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill green" data-width="70"></div></div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Transaction to/from CEX</span>
                        <span className="metric-pct">20%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill blue" data-width="20"></div></div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Wallet Age</span>
                        <span className="metric-pct">60%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill green" data-width="60"></div></div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Suspicious transactions</span>
                        <span className="metric-pct">55%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill yellow" data-width="55"></div></div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-label-row">
                        <span className="metric-name">Transaction to High-Risk addresses</span>
                        <span className="metric-pct">55%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill yellow" data-width="55"></div></div>
                    </div>
                    </div>
                </div> */}
            </section>

            <section className="partners-section">
                <div className="partners-header">
                    <p>Trusted & integrated with industry leaders</p>
                </div>
                <div className="marquee-wrapper">
                    <div className="marquee-track" id="marquee">
                
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#0500ff', color:'#fff', fontWeight:'800', fontSize:'0.65rem', letterSpacing:'-0.03em' }}>TW</div> */}
                            <div className="partner-logo">
                                <img src="../public/trust.webp" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Trust Wallet</div><div className="partner-type">Wallet Provider</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#e2761b', color:'#fff', fontWeight:'800', fontSize:'0.65rem' }}>MM</div> */}
                            <div className="partner-logo">
                                <img src="../public/metamask.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">MetaMask</div><div className="partner-type">Web3 Wallet</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#f0b90b', color:'#fff', fontWeight:'800', fontSize:'0.65rem' }}>BNB</div> */}
                            <div className="partner-logo">
                                <img src="../public/binance.svg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Binance</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#f7a600', color:'#fff', fontWeight:'800', fontSize:'0.75rem' }}>B</div> */}
                            <div className="partner-logo">
                                <img src="../public/bybit.png" alt="Partner Logo" style={{ width: '60px' }} />
                            </div>
                            <div><div className="partner-name">Bybit</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#1a1a2e', color:'#00d4ff', fontWeight:'800', fontSize:'0.65rem' }}>CA</div> */}
                            <div className="partner-logo">
                                <img src="../public/blockchainanalysis.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Chainalysis</div><div className="partner-type">Blockchain Analytics</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#1c1c3a', color:'#e040fb', fontWeight:'800', fontSize:'0.7rem' }}>EL</div> */}
                            <div className="partner-logo">
                                <img src="../public/elliptic.jpg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Elliptic</div><div className="partner-type">Compliance</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#000', color:'#fff', fontWeight:'800', fontSize:'0.7rem' }}>L</div> */}
                            <div className="partner-logo">
                                <img src="../public/ledger.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Ledger</div><div className="partner-type">Hardware Wallet</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#0052ff', color:'#fff', fontWeight:'800', fontSize:'0.75rem' }}>CB</div> */}
                            <div className="partner-logo">
                                <img src="../public/coinbase.svg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Coinbase</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#000', color:'#fff', fontWeight:'800', fontSize:'0.7rem' }}>OKX</div> */}
                            <div className="partner-logo">
                                <img src="../public/okx.svg" alt="Partner Logo" style={{ width: '50px' }} />
                            </div>
                            <div><div className="partner-name">OKX</div><div className="partner-type">Exchange</div></div>
                        </div>
                    
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#0500ff', color:'#fff', fontWeight:'800', fontSize:'0.65rem', letterSpacing:'-0.03em' }}>TW</div> */}
                            <div className="partner-logo">
                                <img src="../public/trust.webp" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Trust Wallet</div><div className="partner-type">Wallet Provider</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#e2761b', color:'#fff', fontWeight:'800', fontSize:'0.65rem' }}>MM</div> */}
                            <div className="partner-logo">
                                <img src="../public/metamask.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">MetaMask</div><div className="partner-type">Web3 Wallet</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{background:'#f0b90b', color:'#fff', fontWeight:'800', fontSize:'0.65rem' }}>BNB</div> */}
                            <div className="partner-logo">
                                <img src="../public/binance.svg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Binance</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#f7a600', color:'#fff', fontWeight:'800', fontSize:'0.75rem' }}>B</div> */}
                            <div className="partner-logo">
                                <img src="../public/bybit.png" alt="Partner Logo" style={{ width: '60px' }} />
                            </div>
                            <div><div className="partner-name">Bybit</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#1a1a2e', color:'#00d4ff', fontWeight:'800', fontSize:'0.65rem' }}>CA</div> */}
                            <div className="partner-logo">
                                <img src="../public/blockchainanalysis.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Chainalysis</div><div className="partner-type">Blockchain Analytics</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#1c1c3a', color:'#e040fb', fontWeight:'800', fontSize:'0.7rem' }}>EL</div> */}
                            <div className="partner-logo">
                                <img src="../public/elliptic.jpg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Elliptic</div><div className="partner-type">Compliance</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#000', color:'#fff', fontWeight:'800', fontSize:'0.7rem' }}>L</div> */}
                            <div className="partner-logo">
                                <img src="../public/ledger.png" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Ledger</div><div className="partner-type">Hardware Wallet</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#0052ff', color:'#fff', fontWeight:'800', fontSize:'0.75rem' }}>CB</div> */}
                            <div className="partner-logo">
                                <img src="../public/coinbase.svg" alt="Partner Logo" style={{ width: '40px' }} />
                            </div>
                            <div><div className="partner-name">Coinbase</div><div className="partner-type">Exchange</div></div>
                        </div>
                        <div className="partner-item">
                            {/* <div className="partner-logo" style={{ background:'#000', color:'#fff', fontWeight:'800', fontSize:'0.7rem' }}>OKX</div> */}
                            <div className="partner-logo">
                                <img src="../public/okx.svg" alt="Partner Logo" style={{ width: '50px' }} />
                            </div>
                            <div><div className="partner-name">OKX</div><div className="partner-type">Exchange</div></div>
                        </div>
                
                    </div>
                </div>
            </section>


            <section className="features">
            <div className="features-inner">
                <p className="section-label">Why AML Check</p>
                <h2 className="section-title">Comprehensive wallet risk analysis</h2>
                <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Deep Transaction Analysis</h3>
                    <p>Analyze transaction history, patterns, and connections to identify potentially suspicious activity across the blockchain.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>Risk Scoring A–F</h3>
                    <p>Get a clear A-to-F risk rating based on multiple weighted indicators so you can make informed decisions instantly.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Instant Results</h3>
                    <p>Receive a full compliance report in seconds. No waiting — protect yourself from scammers before it's too late.</p>
                </div>
                </div>
            </div>
            </section>

            <section className="cta-section">
                <h2>Ready to check your wallet?</h2>
                <p>Join thousands of users who protect their assets with Checkyourcrypto.com</p>
                <a href="#" className="btn-blue">Check your wallet →</a>
            </section>

            <footer>
                <span>© 2025 AML Check. All rights reserved.</span>
                <span>Privacy Policy · Terms of Service</span>
            </footer>
        </body>
    </>
  )
}