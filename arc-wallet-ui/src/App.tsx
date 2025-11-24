
import { useState, useEffect } from 'react'
import { Key } from 'lucide-react'
import { ethers } from 'ethers'
import { Toaster, toast } from 'sonner'
import { ARC_RPC_URL, MOCK_USDC_ADDRESS, USDC_ABI, MULTISEND_ADDRESS, MULTISEND_ABI, RECURRING_PAYMENTS_ADDRESS, RECURRING_PAYMENTS_ABI } from './constants'
import type { Transaction, Recipient } from './types'
import Header from './components/Header'
import BalanceDisplay from './components/BalanceDisplay'
import ModeToggle from './components/ModeToggle'
import SendForm from './components/SendForm'
import ScheduleForm from './components/ScheduleForm'
import ReceiveCard from './components/ReceiveCard'
import TransactionHistory from './components/TransactionHistory'
import WelcomeModal from './components/WelcomeModal'
import TransactionModal from './components/TransactionModal'
import AddressWarningModal from './components/AddressWarningModal'

export default function App() {
  const [mode, setMode] = useState<'send' | 'receive' | 'schedule'>('send')
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: '' }])
  const [mockBalance, setMockBalance] = useState(0.00)
  const [circleBalance, setCircleBalance] = useState(0.00)
  const [address, setAddress] = useState('')
  const [wallet, setWallet] = useState<ethers.Wallet | ethers.HDNodeWallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [viewAllTx, setViewAllTx] = useState(false)
  const [showAddressWarning, setShowAddressWarning] = useState(false)
  const [pendingRecipient, setPendingRecipient] = useState('')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Initialize Wallet & Provider
  useEffect(() => {
    const init = async () => {
      const _provider = new ethers.JsonRpcProvider(ARC_RPC_URL)
      setProvider(_provider)

      const storedKey = localStorage.getItem('arc_wallet_pk')
      const tutorialCompleted = localStorage.getItem('arc_tutorial_completed')
      const storedTxs = localStorage.getItem('arc_transactions')

      if (storedTxs) {
        setTransactions(JSON.parse(storedTxs))
      }

      let newWallet
      if (storedKey) {
        newWallet = new ethers.Wallet(storedKey, _provider)
      } else {
        // Generate new wallet if none exists
        newWallet = ethers.Wallet.createRandom(_provider)
        localStorage.setItem('arc_wallet_pk', newWallet.privateKey)
      }

      setWallet(newWallet)
      setAddress(newWallet.address)
      fetchBalances(newWallet.address, _provider)

      if (!storedKey && !tutorialCompleted) {
        setShowWelcome(true)
      }
    }
    init()
  }, [])

  // Auto-Execute Schedules (Frontend Keeper)
  useEffect(() => {
    if (!wallet || !provider) return

    const checkSchedules = async () => {
      try {
        const contract = new ethers.Contract(RECURRING_PAYMENTS_ADDRESS, RECURRING_PAYMENTS_ABI, wallet)
        const nextId = await contract.nextScheduleId()

        for (let i = 0; i < Number(nextId); i++) {
          const schedule = await contract.getSchedule(i)
          if (schedule.isActive && schedule.sender === wallet.address) {
            const now = Math.floor(Date.now() / 1000)
            const lastPayment = Number(schedule.lastPaymentTime)
            const interval = Number(schedule.interval)

            if (now >= lastPayment + interval) {
              console.log(`Executing schedule ${i}...`)

              // Check allowance first
              const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, wallet)
              const allowance = await usdcContract.allowance(wallet.address, RECURRING_PAYMENTS_ADDRESS)

              if (allowance < schedule.amount) {
                const approveTx = await usdcContract.approve(RECURRING_PAYMENTS_ADDRESS, ethers.MaxUint256)
                await approveTx.wait()
              }

              const tx = await contract.executePayment(i)
              await tx.wait()
              toast.success(`Scheduled payment executed!`)
              fetchBalances(wallet.address, provider)

              // Add to history
              const newTx: Transaction = {
                hash: tx.hash,
                type: 'send',
                amount: ethers.formatUnits(schedule.amount, 6), // Assuming 6 decimals for USDC
                to: schedule.recipient,
                timestamp: Date.now(),
                status: 'confirmed'
              }
              const updatedTxs = [newTx, ...transactions]
              setTransactions(updatedTxs)
              localStorage.setItem('arc_transactions', JSON.stringify(updatedTxs))
            }
          }
        }
      } catch (error) {
        console.error("Keeper error:", error)
      }
    }

    const interval = setInterval(checkSchedules, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [wallet, provider, transactions])


  const fetchBalances = async (addr: string, prov: ethers.JsonRpcProvider) => {
    try {
      // Fetch Mock USDC balance
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, prov)
      const decimals = await usdcContract.decimals()
      const rawBalance = await usdcContract.balanceOf(addr)
      const formattedBalance = ethers.formatUnits(rawBalance, decimals)
      setMockBalance(parseFloat(formattedBalance))

      // Fetch Circle USDC balance (Native Token)
      const circleRawBalance = await prov.getBalance(addr)
      const circleFormatted = ethers.formatUnits(circleRawBalance, 18) // Native token usually has 18 decimals
      setCircleBalance(parseFloat(circleFormatted))
    } catch (error) {
      console.error("Error fetching balances:", error)
    }
  }

  const handleMint = async () => {
    if (!wallet) return
    setLoading(true)
    const toastId = toast.loading("Minting 10,000 USDC...")
    try {
      const contract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, wallet)
      const decimals = await contract.decimals()
      const amount = ethers.parseUnits("10000", decimals) // Mint 10,000 USDC

      const tx = await contract.mint(address, amount)
      console.log("Mint tx:", tx.hash)
      await tx.wait()

      toast.success("Successfully minted 10,000 USDC!", {
        id: toastId,
        description: `Hash: ${tx.hash.slice(0, 10)}...`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://testnet.arcscan.app/tx/${tx.hash}`, '_blank')
        }
      })
      if (provider) fetchBalances(address, provider)

      // Add to transaction history
      const newTx: Transaction = {
        type: 'Mint',
        amount: '10000',
        hash: tx.hash,
        timestamp: Date.now(),
        status: 'confirmed'
      }
      const updatedTxs = [newTx, ...transactions].slice(0, 10)
      setTransactions(updatedTxs)
      localStorage.setItem('arc_transactions', JSON.stringify(updatedTxs))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Mint failed:", error)
      if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error("Insufficient ETH for Gas!", {
          id: toastId,
          description: "You need ETH to pay for gas fees.",
          action: {
            label: 'Get Gas',
            onClick: () => window.open("https://faucet.circle.com", "_blank")
          }
        })
      } else {
        toast.error("Mint failed!", { id: toastId, description: "Check console for details." })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = async (recipient: string, amount: string, interval: number) => {
    if (!wallet || !provider) return
    setLoading(true)
    try {
      const contract = new ethers.Contract(RECURRING_PAYMENTS_ADDRESS, RECURRING_PAYMENTS_ABI, wallet)
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, wallet)

      // Parse amount (assuming 6 decimals for USDC)
      const decimals = await usdcContract.decimals()
      const amountWei = ethers.parseUnits(amount, decimals)

      // Approve
      const approveTx = await usdcContract.approve(RECURRING_PAYMENTS_ADDRESS, ethers.MaxUint256)
      toast.info("Approving contract...")
      await approveTx.wait()

      // Create Schedule
      const tx = await contract.createSchedule(recipient, MOCK_USDC_ADDRESS, amountWei, interval)
      toast.info("Creating schedule...")
      await tx.wait()

      toast.success("Schedule created successfully!")
      setMode('send') // Go back to send mode or stay? Maybe stay to create more.
    } catch (error) {
      console.error(error)
      toast.error("Failed to create schedule")
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!wallet || !provider) return

    // Validate addresses
    const invalidRecipients = recipients.filter(r => !ethers.isAddress(r.address))
    if (invalidRecipients.length > 0) {
      toast.error("Invalid recipient address(es)")
      return
    }

    // Check for new addresses (only for single recipient for now to keep it simple, or loop)
    // For simplicity, if any recipient is new, show warning.
    // But the warning modal is designed for a single address.
    // Let's just check the first one if single, or skip warning for multi-send for now (or improve logic later).
    if (recipients.length === 1 && !showAddressWarning) {
      const hasTx = transactions.some(tx => tx.to?.toLowerCase() === recipients[0].address.toLowerCase())
      if (!hasTx) {
        setPendingRecipient(recipients[0].address)
        setShowAddressWarning(true)
        return
      }
    }

    executeSend()
  }

  const executeSend = async () => {
    setShowAddressWarning(false)
    if (!wallet) return
    const validRecipients = recipients.filter(r => r.address && r.amount)
    if (validRecipients.length === 0) return

    setLoading(true)
    const toastId = toast.loading(validRecipients.length > 1 ? "Processing Multi-Send..." : "Sending USDC...")

    try {
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, wallet)
      const decimals = await usdcContract.decimals()

      if (validRecipients.length === 1) {
        // Single Send
        const recipient = validRecipients[0]
        const amountWei = ethers.parseUnits(recipient.amount, decimals)
        const tx = await usdcContract.transfer(recipient.address, amountWei)
        console.log("Tx sent:", tx.hash)
        await tx.wait()

        toast.success("Transaction Successful!", {
          id: toastId,
          description: `Sent ${recipient.amount} USDC`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.arcscan.app/tx/${tx.hash}`, '_blank')
          }
        })

        // Add to transaction history
        const newTx: Transaction = {
          type: 'Send',
          amount: recipient.amount,
          hash: tx.hash,
          timestamp: Date.now(),
          to: recipient.address,
          status: 'confirmed'
        }
        const updatedTxs = [newTx, ...transactions]
        setTransactions(updatedTxs)
        localStorage.setItem('arc_transactions', JSON.stringify(updatedTxs))

      } else {
        // Multi Send
        const multiSendContract = new ethers.Contract(MULTISEND_ADDRESS, MULTISEND_ABI, wallet)

        // Calculate total amount
        const totalAmount = validRecipients.reduce((acc, r) => acc + parseFloat(r.amount), 0)
        const totalAmountWei = ethers.parseUnits(totalAmount.toString(), decimals)

        // Approve
        toast.info("Approving tokens...", { id: toastId })
        const approveTx = await usdcContract.approve(MULTISEND_ADDRESS, totalAmountWei)
        await approveTx.wait()

        // Send
        toast.info("Sending tokens...", { id: toastId })
        const addresses = validRecipients.map(r => r.address)
        const amounts = validRecipients.map(r => ethers.parseUnits(r.amount, decimals))

        const tx = await multiSendContract.multiSend(MOCK_USDC_ADDRESS, addresses, amounts)
        console.log("MultiSend tx:", tx.hash)
        await tx.wait()

        toast.success("Multi-Send Successful!", {
          id: toastId,
          description: `Sent to ${validRecipients.length} recipients`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.arcscan.app/tx/${tx.hash}`, '_blank')
          }
        })

        // Add to transaction history
        const newTxs: Transaction[] = validRecipients.map(r => ({
          type: 'Send',
          amount: r.amount,
          hash: tx.hash,
          timestamp: Date.now(),
          to: r.address,
          status: 'confirmed'
        }))

        const updatedTxs = [...newTxs, ...transactions]
        setTransactions(updatedTxs)
        localStorage.setItem('arc_transactions', JSON.stringify(updatedTxs))
      }

      setRecipients([{ address: '', amount: '' }])
      if (provider) fetchBalances(address, provider)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Transfer failed:", error)
      if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error("Insufficient ETH for Gas!", {
          id: toastId,
          description: "You need ETH to pay for gas fees.",
          action: {
            label: 'Get Gas',
            onClick: () => window.open("https://faucet.circle.com", "_blank")
          }
        })
      } else {
        toast.error("Transfer failed!", { id: toastId, description: "Check console for details." })
      }
    } finally {
      setLoading(false)
    }
  }

  const exportWallet = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.privateKey)
      toast.success("Private Key Copied!", {
        description: "Keep it safe! Do not share with anyone.",
        duration: 5000,
        icon: <Key size={16} />
      })
    }
  }

  const handleRepeatTx = async () => {
    if (!selectedTx || selectedTx.type !== 'Send' || !selectedTx.to || !wallet || !provider) {
      toast.error("Cannot repeat this transaction")
      setSelectedTx(null)
      return
    }

    const amount = selectedTx.amount
    const recipient = selectedTx.to
    setSelectedTx(null)
    setLoading(true)
    const toastId = toast.loading("Repeating transaction...")

    try {
      const contract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, wallet)
      const decimals = await contract.decimals()
      const amountWei = ethers.parseUnits(amount, decimals)

      const tx = await contract.transfer(recipient, amountWei)
      console.log("Repeat tx sent:", tx.hash)
      await tx.wait()

      toast.success("Transaction Successful!", {
        id: toastId,
        description: `Sent ${amount} USDC`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://testnet.arcscan.app/tx/${tx.hash}`, '_blank')
        }
      })

      if (provider) fetchBalances(address, provider)

      // Add to transaction history
      const newTx: Transaction = {
        type: 'Send',
        amount: amount,
        hash: tx.hash,
        timestamp: Date.now(),
        to: recipient
      }
      const updatedTxs = [newTx, ...transactions].slice(0, 10)
      setTransactions(updatedTxs)
      localStorage.setItem('arc_transactions', JSON.stringify(updatedTxs))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Repeat transfer failed:", error)
      if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error("Insufficient ETH for Gas!", {
          id: toastId,
          description: "You need ETH to pay for gas fees.",
          action: {
            label: 'Get Gas',
            onClick: () => window.open("https://faucet.circle.com", "_blank")
          }
        })
      } else {
        toast.error("Transfer failed!", { id: toastId, description: "Check console for details." })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-circle-dark text-circle-text flex flex-col items-center p-4 font-sans selection:bg-circle-blue selection:text-white">
      <Toaster position="bottom-right" theme="dark" richColors />

      <TransactionModal
        selectedTx={selectedTx}
        setSelectedTx={setSelectedTx}
        handleRepeatTx={handleRepeatTx}
      />

      <AddressWarningModal
        showAddressWarning={showAddressWarning}
        setShowAddressWarning={setShowAddressWarning}
        pendingRecipient={pendingRecipient}
        executeSend={executeSend}
      />

      <WelcomeModal
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
        address={address}
      />

      <Header
        exportWallet={exportWallet}
        handleMint={handleMint}
        loading={loading}
      />

      <main className="w-full max-w-md flex-1 flex flex-col justify-center gap-8 pb-12">
        <BalanceDisplay
          mockBalance={mockBalance}
          circleBalance={circleBalance}
          fetchBalances={fetchBalances}
          address={address}
          provider={provider}
        />

        <ModeToggle mode={mode} setMode={setMode} />

        <div className="bg-circle-card p-6 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {mode === 'send' ? (
            <SendForm
              recipients={recipients}
              setRecipients={setRecipients}
              handleSend={handleSend}
              loading={loading}
              balance={mockBalance}
            />
          ) : mode === 'schedule' ? (
            <ScheduleForm
              handleCreateSchedule={handleCreateSchedule}
              loading={loading}
              balance={mockBalance}
            />
          ) : (
            <ReceiveCard address={address} />
          )}
        </div>

        <TransactionHistory
          transactions={transactions}
          viewAllTx={viewAllTx}
          setViewAllTx={setViewAllTx}
          setSelectedTx={setSelectedTx}
          address={address}
        />
      </main>

      <footer className="fixed bottom-6 left-6 text-circle-muted text-xs font-medium opacity-50 hover:opacity-100 transition-opacity z-50">
        Built by <span className="text-white">Gutslab</span>
      </footer>
    </div>
  )
}

