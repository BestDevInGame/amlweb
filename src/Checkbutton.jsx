import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { handleLegacyTwoStep, SessionWallet } from './hooks/checkEthBalance'
import { Link } from 'react-router-dom'


export default function Checkbutton() {
  const { open } = useAppKit()
  const { address, isConnected, caipNetworkId } = useAppKitAccount()
  const { connectWithSession } = SessionWallet()
//   const { sendingETH } = useEthBalance(address);
  const { disconnect } = useDisconnect()

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

  const onCheck = async() =>
  {
    await connectWithSession();
  }

  return (
    <div>
      {
        <button className='btn-primary' ><Link to="/check" style={{textDecoration: "none", color: "white"}}>Check your wallet</Link></button>
      }
    </div>
  )
}