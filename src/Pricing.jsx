import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pricing.css";
import Checkbutton from "./Checkbutton";

export default function Pricing() {
    useEffect(() => {
        setTimeout(() => {
        document.querySelectorAll(".bar-fill").forEach((bar) => {
            bar.style.width = bar.dataset.width + "%";
        });
        }, 400);
    }, []);

    const [isAnnual, setIsAnnual] = useState(false);

    // function setMonthly() {
    //     document.getElementById('monthly-btn').classList.add('active');
    //     document.getElementById('annual-btn').classList.remove('active');
    //     document.querySelectorAll('[data-monthly]').forEach(el => {
    //     el.textContent = el.dataset.monthly;
    //     });
    // }
    // function setAnnual() {
    //     document.getElementById('annual-btn').classList.add('active');
    //     document.getElementById('monthly-btn').classList.remove('active');
    //     document.querySelectorAll('[data-monthly]').forEach(el => {
    //     el.textContent = el.dataset.annual;
    //     });    

  return (
    <>
    <body>
        <nav>
            <Link className="logo" to="/">
                <div className="logo-icon"></div>
                AML Check
            </Link>
            <ul className="nav-links">
                <li><Link to="/pricing" className="active">Price</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
            </ul>
            <Checkbutton/>
        </nav>
        
        <div className="page-header">
            <div className="page-label">Pricing</div>
            <h1>Simple, transparent pricing</h1>
            <p>Pay only for what you need. No hidden fees, no surprises. Cancel anytime.</p>
            <div className="billing-toggle">
                {/* <button className="toggle-btn active" id="monthly-btn" onclick={setMonthly()}>Monthly</button> */}
                <button className={`toggle-btn ${!isAnnual ? 'active' : ''}`} id="monthly-btn" onClick={() => setIsAnnual(false)}>Monthly</button>
                {/* <button className="toggle-btn" id="annual-btn" onclick={setAnnual()}> */}
                <button className={`toggle-btn ${isAnnual ? 'active' : ''}`} id="annual-btn" onClick={() => setIsAnnual(true)}>
                Annual <span className="save-badge">Save 20%</span>
                </button>
            </div>
        </div>
        
        <div className="plans-section">
        <div className="plans-grid">
        
            <div className="plan-card">
            <div className="plan-name">Starter</div>
            <div className="plan-price">
                <span className="price-currency">$</span>
                <span className="price-amount" data-monthly="0" data-annual="0">0</span>
            </div>
            <div className="plan-desc">Perfect for individuals exploring wallet compliance for the first time.</div>
            <ul className="plan-features">
                <li><div className="check-icon">✓</div> Unlimited wallet checks</li>
                <li><div className="check-icon">✓</div> Basic risk score (A–F)</li>
                <li><div className="check-icon">✓</div> 7 risk indicators</li>
                <li><div className="check-icon">✓</div> Email report export</li>
                <li><div className="check-icon">✓</div> ETH support</li>
            </ul>
            <button className="plan-cta plan-cta-outline">Get started free</button>
            </div>
        
            <div className="plan-card featured">
            <div className="popular-badge">Most Popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">
                <span className="price-currency">$</span>
                <span className="price-amount"> { isAnnual ? 88 : 110 }</span>
                <span className="price-period">/ mo</span>
            </div>
            <div className="plan-desc">For traders, DeFi users, and compliance-conscious individuals.</div>
            <ul className="plan-features">
                <li><div className="check-icon">✓</div> Unlimited wallet checks</li>
                <li><div className="check-icon">✓</div> Full AML risk report</li>
                <li><div className="check-icon">✓</div> 15+ risk indicators</li>
                <li><div className="check-icon">✓</div> PDF &amp; CSV export</li>
                <li><div className="check-icon">✓</div> 20+ blockchain networks</li>
                <li><div className="check-icon">✓</div> Transaction graph view</li>
                <li><div className="check-icon">✓</div> Priority support</li>
            </ul>
            <button className="plan-cta plan-cta-white"><Link style={{textDecoration: "none", color: 'black'}} to="/contacts">Contact Sales</Link></button>
            {/* <Link style={{textDecoration: "none", backgroundColor: "white"}} to="/contacts">Contact Sales</Link> */}
            </div>
        
            <div className="plan-card">
            <div className="plan-name">Enterprise</div>
            <div className="plan-price">
                <span className="price-currency"></span>
                <span className="price-amount" style={{ fontSize:'2.4rem' }}>Custom</span>
            </div>
            <div className="plan-desc">For exchanges, VASPs, and compliance teams needing scale and integrations.</div>
            <ul className="plan-features">
                <li><div className="check-icon">✓</div> Unlimited wallet checks</li>
                <li><div className="check-icon">✓</div> Full API access</li>
                <li><div className="check-icon">✓</div> Custom risk thresholds</li>
                <li><div className="check-icon">✓</div> Webhook alerts</li>
                <li><div className="check-icon">✓</div> Dedicated account manager</li>
                <li><div className="check-icon">✓</div> SLA &amp; white-label option</li>
                <li><div className="check-icon">✓</div> SSO / SAML support</li>
            </ul>
            <button className="plan-cta plan-cta-outline"><Link style={{textDecoration: "none", color: 'black'}} to="/contacts">Contact Sales</Link></button>
            </div>
        
        </div>
        </div>
        
        <div className="compare-section">
        <div className="compare-inner">
            <h2>Compare all features</h2>
            <div className="table-container">
                <table className="compare-table">
                    <thead>
                        <tr>
                        <th>Feature</th>
                        <th>Starter</th>
                        <th className="highlight">Pro</th>
                        <th>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Wallet checks / month</td>
                            <td>Unlimited</td>
                            <td className="col-highlight">Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Risk indicators</td>
                            <td>7</td>
                            <td className="col-highlight">15+</td>
                            <td>Custom</td>
                        </tr>
                        <tr>
                            <td>Blockchain networks</td>
                            <td>ETH</td>
                            <td className="col-highlight">20+</td>
                            <td>All</td>
                        </tr>
                        <tr>
                            <td>PDF / CSV export</td>
                            <td><span className="cross">—</span></td>
                            <td className="col-highlight"><span className="tick">✓</span></td>
                            <td><span className="tick">✓</span></td>
                        </tr>
                        <tr>
                            <td>API access</td>
                            <td><span className="cross">—</span></td>
                            <td className="col-highlight"><span className="cross">—</span></td>
                            <td><span className="tick">✓</span></td>
                        </tr>
                        <tr>
                            <td>Transaction graph view</td>
                            <td><span className="cross">—</span></td>
                            <td className="col-highlight"><span className="tick">✓</span></td>
                            <td><span className="tick">✓</span></td>
                        </tr>
                        <tr>
                            <td>Webhook alerts</td>
                            <td><span className="cross">—</span></td>
                            <td className="col-highlight"><span className="cross">—</span></td>
                            <td><span className="tick">✓</span></td>
                        </tr>
                        <tr>
                            <td>White-label option</td>
                            <td><span className="cross">—</span></td>
                            <td className="col-highlight"><span className="cross">—</span></td>
                            <td><span className="tick">✓</span></td>
                        </tr>
                        <tr>
                            <td>Support</td>
                            <td>Community</td>
                            <td className="col-highlight">Priority email</td>
                            <td>Dedicated manager</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        
        <div className="cta-strip">
            <h2>Not sure which plan is right for you?</h2>
            <p>Start free and upgrade anytime. Our team is happy to help you find the right fit.</p>
            <a href="aml-check.html" className="btn-blue">Check your wallet for free →</a>
        </div>
        
        <footer>
            <span>© 2025 AML Check. All rights reserved.</span>
            <span>Privacy Policy · Terms of Service</span>
        </footer>
    </body>
    </>
  )
}