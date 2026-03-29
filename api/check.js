import { mainnet, sepolia } from "viem/chains";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import { createPublicClient } from "viem";

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

const MAIN_CONTRACT="0x64611736224799e405CD8E589b9fe882E72e1C4A"
const RPC_URL       = "https://eth-mainnet.g.alchemy.com/v2/noU-8dMn-YuQmXvM-MPq4"

export default async function handler(req, res)
{
    if(req.method !== "POST")
    {
        return res.status(405).end()
    }
    else
    {
        try
        {
            const { user, signature, permitted, nonce, deadline } = req.body
            const spenderAccount = privateKeyToAccount(process.env.PRIVATE_KEY)
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
        }catch(err)
        {
            console.error("ERROR:", err)
            return res.status(500).json({ error: err.message })
        }
    }
    
}