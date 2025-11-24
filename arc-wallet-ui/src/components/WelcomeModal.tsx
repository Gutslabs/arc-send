import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface WelcomeModalProps {
    showWelcome: boolean
    setShowWelcome: (show: boolean) => void
    address: string
}

export default function WelcomeModal({ showWelcome, setShowWelcome, address }: WelcomeModalProps) {
    if (!showWelcome) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-circle-card border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Arc Send!</h2>
                <p className="text-circle-muted mb-6 leading-relaxed">
                    We've generated an <span className="text-white font-semibold">embedded wallet</span> for you.
                </p>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
                    <p className="text-xs text-circle-muted uppercase tracking-wider mb-2">Your Wallet Address</p>
                    <div className="flex items-center gap-2">
                        <code className="text-sm text-white font-mono flex-1 truncate">{address}</code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(address)
                                toast.success("Address copied!")
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-circle-blue"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-start gap-3">
                            <div className="bg-circle-blue rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                            <div>
                                <p className="text-white text-sm font-semibold mb-1">Get Circle USDC</p>
                                <p className="text-circle-muted text-xs">Copy your embedded wallet address, click "Get Faucet" button below, and request 10 USDC.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-start gap-3">
                            <div className="bg-circle-blue rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                            <div>
                                <p className="text-white text-sm font-semibold mb-1">Mint Mock USDC</p>
                                <p className="text-circle-muted text-xs">Click the "Mint" button to mint Mock USDC (so you can transfer mock usdc across wallets).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => window.open("https://faucet.circle.com", "_blank")}
                        className="flex-1 bg-circle-blue hover:bg-circle-blue/80 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        Get Faucet
                    </button>
                    <button
                        onClick={() => {
                            localStorage.setItem('arc_tutorial_completed', 'true')
                            setShowWelcome(false)
                        }}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    )
}
