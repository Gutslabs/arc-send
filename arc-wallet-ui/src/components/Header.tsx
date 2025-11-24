import { Key } from 'lucide-react'

interface HeaderProps {
    exportWallet: () => void
    handleMint: () => Promise<void>
    loading: boolean
}

export default function Header({ exportWallet, handleMint, loading }: HeaderProps) {
    return (
        <header className="w-full max-w-md flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-circle-blue rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-circle-blue/20">A</div>
                <span className="font-semibold text-lg tracking-tight">Arc Send</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={exportWallet}
                    className="bg-white/5 hover:bg-white/10 text-circle-muted hover:text-white px-3 py-2 rounded-xl transition-all border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
                    title="Export Private Key"
                >
                    <Key size={16} />
                </button>
                <button
                    onClick={handleMint}
                    disabled={loading}
                    className="bg-gradient-to-r from-circle-blue to-blue-500 hover:from-circle-blue/80 hover:to-blue-500/80 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-circle-blue/20 hover:shadow-circle-blue/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Mint
                </button>
                <button className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95">
                    Deposit
                </button>
            </div>
        </header>
    )
}
