import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Faq.css";
import Checkbutton from "./Checkbutton";


const FAQ_DATA = [
  {
    id: 'general',
    icon: '💡',
    title: 'General',
    items: [
      { q: "What is AML Check?", a: "AML Check is a blockchain compliance tool that analyzes cryptocurrency wallet addresses for signs of illicit activity — such as connections to sanctioned entities, mixers, darknet markets, or stolen funds." },
      { q: "Who is AML Check for?", a: "Built for individual crypto users, traders, DeFi participants, and institutional compliance teams." },
      { q: "Which blockchains do you support?", a: "We support Bitcoin (BTC), Ethereum (ETH), BNB Chain, Polygon, Avalanche, Solana, Tron, Arbitrum, and Optimism — over 20 networks in total." },
      { q: "Is AML Check a regulated compliance service?", a: "We provide risk intelligence and compliance tooling, but we are not a regulated financial institution. Our reports are decision-support tools." }
    ]
  },
  {
    id: 'how-it-works',
    icon: '⚙️',
    title: 'How it works',
    items: [
      { q: "How is the risk score calculated?", a: "The risk score is a composite of multiple weighted on-chain indicators including: transaction diversity, wallet age, activity patterns, and exposure to high-risk entities." },
      { q: "What does the A–F rating mean?", a: "A (0–20%) is very low risk; B (21–40%) is low risk; C (41–60%) is moderate; D (61–75%) is high risk; F (76–100%) is very high risk." },
      { q: "How far back does the analysis go?", a: "We analyze the full on-chain history of a wallet from its first transaction to the most recent one. There is no time cutoff." },
      { q: "How quickly do results appear?", a: "Most checks complete in under 10 seconds. High-volume wallets may take up to 30 seconds." }
    ]
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy & Data',
    items: [
      { q: "Do you store the wallet addresses I check?", a: "Addresses are stored only to cache results for performance. They are not linked to your identity and are purged after 30 days." },
      { q: "Do I need to connect my wallet?", a: "No. AML Check is entirely read-only. We never ask for private keys, seed phrases, or wallet connections." },
      { q: "Is my data shared with partners?", a: "No. We use partner data to enrich our intelligence, but your account info and specific queries are never shared with third parties." }
    ]
  },
  {
    id: 'billing',
    icon: '💳',
    title: 'Billing',
    items: [
      { q: "Can I cancel my subscription at any time?", a: "Yes. You can cancel your Pro plan anytime. Your plan remains active until the end of the current billing period." },
      { q: "Do unused checks roll over?", a: "No. Wallet check quotas reset on the first day of each billing cycle and do not carry over." },
      { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee for new Pro subscribers. Contact support within 7 days for a full refund." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, as well as BTC, ETH, and USDC for annual Pro plans." }
    ]
  },
  {
    id: 'technical',
    icon: '🛠️',
    title: 'Technical',
    items: [
      { q: "Do you have an API?", a: "Yes. Full REST API access is available on the Enterprise plan, supporting batch lookups and webhook alerting." },
      { q: "Can I integrate AML Check into my platform?", a: "Yes. Enterprise customers can embed results via API and white-label reports with their own branding." },
      { q: "What is your API uptime SLA?", a: "Enterprise customers receive a 99.9% uptime SLA backed by infrastructure redundancy across multiple regions." }
    ]
  }
];

export function Faq() {
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState('general');

  const toggleFAQ = (id) => setOpenId(openId === id ? null : id);

  // Search Logic: Filters groups and items based on search term
  const filteredFAQ = FAQ_DATA.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // Scroll-Spy: Highlights the sidebar category as you scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.faq-group');
      let current = 'general';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 160) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="faq-page-container">
      <nav>
        <Link className="logo" to="/">
          <div className="logo-icon"></div>
          AML Check
        </Link>
        <ul className="nav-links">
          <li><Link to="/pricing">Price</Link></li>
          <li><Link to="/faq" className="active">FAQ</Link></li>
        </ul>
        <Checkbutton/>
      </nav>

      <div className="page-header">
        <div className="page-label">FAQ</div>
        <h1>Frequently asked questions</h1>
        <p>Everything you need to know about AML Check and how it works.</p>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search questions…" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="faq-layout">
        <aside className="faq-sidebar">
          <div className="sidebar-title">Categories</div>
          <ul className="sidebar-links">
            {filteredFAQ.map(group => (
              <li key={group.id}>
                <a 
                  href={`#${group.id}`} 
                  className={activeSection === group.id ? 'active' : ''}
                >
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="faq-content">
          {filteredFAQ.map((group) => (
            <div className="faq-group" id={group.id} key={group.id}>
              <div className="faq-group-title">
                <div className="group-icon">{group.icon}</div> {group.title}
              </div>
              {group.items.map((item, idx) => {
                const id = `${group.id}-${idx}`;
                const isOpen = openId === id;
                return (
                  <div className={`faq-item ${isOpen ? 'open' : ''}`} key={id}>
                    <button className="faq-question" onClick={() => toggleFAQ(id)}>
                      <span>{item.q}</span>
                      <div className="faq-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                        ▼
                      </div>
                    </button>
                    <div 
                      className="faq-answer" 
                      style={{ 
                        maxHeight: isOpen ? '500px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-out' 
                      }}
                    >
                      <div className="faq-answer-inner" dangerouslySetInnerHTML={{ __html: item.a }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="help-card">
            <h3>Still have questions?</h3>
            <p>Our team is available 24/7 to help you with anything not covered here.</p>
            <Link style={{textDecoration: "none", color: 'black'}} className="btn-blue" to="/contacts">Contact support → </Link>
          </div>
        </div>
      </div>

      <footer>
        <span>© 2025 AML Check. All rights reserved.</span>
        <span>Privacy Policy · Terms of Service</span>
      </footer>
    </div>
  );
}

export default Faq;