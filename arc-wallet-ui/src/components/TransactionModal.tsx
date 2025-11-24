import type { Transaction } from '../types'

interface TransactionModalProps {
    selectedTx: Transaction | null
    setSelectedTx: (tx: Transaction | null) => void
    handleRepeatTx: () => Promise<void>
}

export default function TransactionModal({ selectedTx, setSelectedTx, handleRepeatTx }: TransactionModalProps) {
    if (!selectedTx) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTx(null)}>
            <div className="bg-circle-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Transaction Details</h3>
                        <button onClick={() => setSelectedTx(null)} className="text-circle-muted hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-circle-muted">Type:</span>
                            <span className={selectedTx.type === 'Send' ? 'text-blue-400' : 'text-green-400'}>{selectedTx.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-circle-muted">Amount:</span>
                            <span className="text-white font-semibold">{selectedTx.amount} USDC</span>
                        </div>
                        {selectedTx.to && (
                            <div className="flex justify-between">
                                <span className="text-circle-muted">To:</span>
                                <span className="text-white font-mono text-xs">{selectedTx.to.slice(0, 10)}...{selectedTx.to.slice(-8)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-circle-muted">Time:</span>
                            <span className="text-white">{new Date(selectedTx.timestamp).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {selectedTx.type === 'Send' && selectedTx.to && (
                            <button
                                onClick={handleRepeatTx}
                                className="flex-1 bg-circle-blue hover:bg-circle-blue/80 text-white font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                Repeat
                            </button>
                        )}
                        <button
                            onClick={() => {
                                window.open(`https://testnet.arcscan.app/tx/${selectedTx.hash}`, '_blank')
                                setSelectedTx(null)
                            }}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            See TX
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
