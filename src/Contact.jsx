import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Checkbutton from './Checkbutton';

export default function Contact(){
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    // Add your form logic here (e.g., Formspree, SendGrid, or custom API)
    setTimeout(() => setStatus('Message sent!'), () =>  2000);
    setTimeout(() => setFormData({name: '', email: '',message: ''}), () => 2000);
  };

  return (
    <>
        <nav>
            <Link className="logo" to="/">
                <div className="logo-icon"></div>
                AML Check
            </Link>
            <ul className="nav-links">
                <li><Link to="/pricing">Price</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
            </ul>
            <Checkbutton/>
        </nav>

        <div className="contact-container" style={styles.container}>
        <header style={styles.header}>
            <h1 style={styles.title}>Get in touch</h1>
            <p style={styles.subtitle}>Have a question? We're here to help you secure your assets.</p>
        </header>

        <div className="contact-grid" style={styles.grid}>
            {/* Left Side: Contact Information */}
            <div style={styles.infoSection}>
            <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Email us</h3>
                <p style={styles.infoText}>support@checkyourcrypto.com</p>
            </div>

            <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Office</h3>
                <p style={styles.infoText}>526 Broadway<br/>New York, NY</p>
            </div>

            </div>

            {/* Right Side: Contact Form */}
            <div style={styles.formSection}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" placeholder="John Doe" style={styles.input} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}required />
                </div>

                <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}required />
                </div>

                <div style={styles.inputGroup}>
                <label style={styles.label}>Message</label>
                <textarea 
                    rows="5" 
                    placeholder="How can we help?" 
                    style={{...styles.input, resize: 'none'}} 
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                ></textarea>
                </div>

                <button type="submit" style={styles.button}>
                {status || 'Send Message'}
                </button>
            </form>
            </div>
        </div>
        </div>
        <footer>
            <span>© 2025 AML Check. All rights reserved.</span>
            <span>Privacy Policy · Terms of Service</span>
        </footer>
    </>
  );
};

// Simple inline styles to match your previous "Syne" font & blue theme
const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '80px 20px', fontFamily: 'Inter, sans-serif' },
  header: { textAlign: 'center', marginBottom: '60px' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', color: '#666' },
  subtitle: { color: '#666', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '30px' },
  infoCard: { padding: '20px', borderLeft: '3px solid var(--blue, #0070f3)' },
  infoTitle: { fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: '8px' },
  infoText: { fontSize: '1.1rem', color: '#333', lineHeight: '1.5' },
  socialLinks: { display: 'flex', gap: '15px' },
  link: { color: 'var(--blue, #0070f3)', textDecoration: 'none', fontWeight: 600 },
  formSection: { background: '#f9f9f9', padding: '40px', borderRadius: '12px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { 
    width: '100%', background: 'var(--blue, #0070f3)', color: '#fff', 
    padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 700, 
    cursor: 'pointer', transition: 'opacity 0.2s' 
  }
};
