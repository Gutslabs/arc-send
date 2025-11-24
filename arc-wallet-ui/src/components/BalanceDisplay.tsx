import { RefreshCw } from 'lucide-react'
import { ethers } from 'ethers'

interface BalanceDisplayProps {
    mockBalance: number
    circleBalance: number
    fetchBalances: (addr: string, prov: ethers.JsonRpcProvider) => Promise<void>
    address: string
    provider: ethers.JsonRpcProvider | null
}

export default function BalanceDisplay({ mockBalance, circleBalance, fetchBalances, address, provider }: BalanceDisplayProps) {
    return (
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 relative group">
            <p className="text-circle-muted text-sm uppercase tracking-wider font-medium flex items-center justify-center gap-2">
                Total Balance
                <button onClick={() => provider && fetchBalances(address, provider)} className="hover:text-white transition-colors"><RefreshCw size={12} /></button>
            </p>
            <h1 className="text-5xl font-bold text-white tracking-tight">
                ${mockBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl text-circle-muted font-normal">mUSDC</span>
            </h1>
            <p className="text-xs text-circle-muted mt-2">
                Circle USDC: ${circleBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
    )
}
