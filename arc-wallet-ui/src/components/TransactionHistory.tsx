import type { Transaction } from '../types'

interface TransactionHistoryProps {
    transactions: Transaction[]
    viewAllTx: boolean
    setViewAllTx: (view: boolean) => void
    setSelectedTx: (tx: Transaction | null) => void
    address: string
}

export default function TransactionHistory({ transactions, viewAllTx, setViewAllTx, setSelectedTx, address }: TransactionHistoryProps) {
    if (transactions.length === 0) return null

    if (!viewAllTx) {
        return (
            <div className="mt-8 space-y-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-circle-muted text-xs uppercase tracking-wider">Recent Transactions</h3>
                    {transactions.length > 5 && (
                        <button
                            onClick={() => setViewAllTx(true)}
                            className="text-xs text-circle-blue hover:text-blue-300 transition-colors"
                        >
                            See more →
                        </button>
                    )}
                </div>
                <div className="space-y-0">
                    {transactions.slice(0, 5).map((tx, index) => (
                        <div
                            key={index}
                            className="py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group -mx-2 px-2"
                            onClick={() => setSelectedTx(tx)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-medium ${tx.type === 'Send' ? 'text-blue-400' : 'text-green-400'}`}>
                                        {tx.type}
                                    </span>
                                    <span className="text-white text-sm">{tx.amount} USDC</span>
                                </div>
                                <span className="text-xs text-circle-muted">
                                    {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-circle-muted">From:</span>
                                    <span className="text-circle-muted font-mono">
                                        {address.slice(0, 6)}...{address.slice(-4)}
                                    </span>
                                </div>
                                {tx.to && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-circle-muted">To:</span>
                                        <span className="text-circle-muted font-mono">
                                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-8 space-y-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider">All Transactions</h3>
                <button
                    onClick={() => setViewAllTx(false)}
                    className="text-xs text-circle-blue hover:text-blue-300 transition-colors"
                >
                    ← Back
                </button>
            </div>
            <div className="space-y-0">
                {transactions.map((tx, index) => (
                    <div
                        key={index}
                        className="py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group -mx-2 px-2"
                        onClick={() => setSelectedTx(tx)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium ${tx.type === 'Send' ? 'text-blue-400' : 'text-green-400'}`}>
                                    {tx.type}
                                </span>
                                <span className="text-white text-sm">{tx.amount} USDC</span>
                            </div>
                            <span className="text-xs text-circle-muted">
                                {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center gap-2">
                                <span className="text-circle-muted">From:</span>
                                <span className="text-circle-muted font-mono">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                            </div>
                            {tx.to && (
                                <div className="flex items-center gap-2">
                                    <span className="text-circle-muted">To:</span>
                                    <span className="text-circle-muted font-mono">
                                        {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
