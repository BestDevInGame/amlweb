import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Faq.css";

export default function Faq() {
    useEffect(() => {
        setTimeout(() => {
        document.querySelectorAll(".bar-fill").forEach((bar) => {
            bar.style.width = bar.dataset.width + "%";
        });
        }, 400);
    }, []);

    const FAQ_GROUPS = [
    {
        id: 'general',
        icon: '💡',
        title: 'General',
        items: [
        { q: "What is AML Check?", a: "AML Check is a blockchain compliance tool..." },
        { q: "Who is AML Check for?", a: "AML Check is built for individual crypto users..." },
        { q: "Which blockchains do you support?", a: "We currently support Bitcoin (BTC), Ethereum (ETH)..." },
        { q: "Is AML Check a regulated compliance service?", a: "AML Check provides risk intelligence..." }
        ]
    },
    {
        id: 'how-it-works',
        icon: '⚙️',
        title: 'How it works',
        items: [
        { q: "How is the risk score calculated?", a: "The risk score is an averaged composite..." },
        { q: "What does the A–F rating mean?", a: "The letter rating maps to risk level..." }
        ]
    },
    // ... Add your other groups (Privacy, Billing, Technical) here following the same pattern
    ];

    const [openId, setOpenId] = useState(null); // Tracks which FAQ item is expanded
    const [activeSection, setActiveSection] = useState('general'); // Tracks sidebar highlight

    // 1. Toggle Function
    const toggleFAQ = (id) => {
        setOpenId(openId === id ? null : id);
    };

    // 2. Scroll-Spy Logic
    useEffect(() => {
        const handleScroll = () => {
        const sections = document.querySelectorAll('.faq-group');
        let current = 'general';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
            }
        });
        setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <>
            <body>
                <nav>
                    <Link className="logo" to="/">
                        <div className="logo-icon"></div>
                        AML Check
                    </Link>
                    <ul className="nav-links">
                        <li><a href="pricing.html">Price</a></li>
                        <li><a href="faq.html" className="active">FAQ</a></li>
                    </ul>
                    <Link to="/" className="btn-primary">Check your wallet</Link>
                </nav>
                
                <div className="page-header">
                    <div className="page-label">FAQ</div>
                    <h1>Frequently asked questions</h1>
                    <p>Everything you need to know about AML Check and how it works.</p>
                    <div className="search-wrap">
                        <span className="search-icon">🔍</span>
                        <input type="text" id="faq-search" placeholder="Search questions…" oninput="filterFAQ(this.value)" />
                    </div>
                </div>
                
                <div className="faq-layout">
                    {/* Sidebar Navigation */}
                    <aside className="faq-sidebar">
                        <div className="sidebar-title">Categories</div>
                        <ul className="sidebar-links">
                        {FAQ_GROUPS.map((group) => (
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

                    {/* Main FAQ Content */}
                    <div className="faq-content">
                        {FAQ_GROUPS.map((group) => (
                        <div className="faq-group" id={group.id} key={group.id}>
                            <div className="faq-group-title">
                            <div className="group-icon">{group.icon}</div> {group.title}
                            </div>

                            {group.items.map((item, index) => {
                            const itemId = `${group.id}-${index}`;
                            const isOpen = openId === itemId;

                            return (
                                <div className={`faq-item ${isOpen ? 'open' : ''}`} key={itemId}>
                                <button className="faq-question" onClick={() => toggleFAQ(itemId)}>
                                    <span>{item.q}</span>
                                    <div className="faq-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    ▼
                                    </div>
                                </button>
                                <div 
                                    className="faq-answer" 
                                    style={{ 
                                    maxHeight: isOpen ? '300px' : '0', 
                                    overflow: 'hidden', 
                                    transition: 'max-height 0.3s ease-out' 
                                    }}
                                >
                                    <div className="faq-answer-inner">{item.a}</div>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                        ))}

                        <div className="help-card">
                        <h3>Still have questions?</h3>
                        <p>Our team is available 24/7 to help you with anything not covered here.</p>
                        <a href="mailto:support@amlcheck.io" className="btn-blue">Contact support →</a>
                        </div>
                    </div>
                    </div>
                
                <footer>
                    <span>© 2026 AML Check. All rights reserved.</span>
                    <span>Privacy Policy · Terms of Service</span>
                </footer>
            </body>
        </>
    )
}