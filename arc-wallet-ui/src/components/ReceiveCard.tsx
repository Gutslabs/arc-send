import { Copy, QrCode } from 'lucide-react'
import { toast } from 'sonner'

interface ReceiveCardProps {
    address: string
}

export default function ReceiveCard({ address }: ReceiveCardProps) {
    return (
        <div className="flex flex-col items-center space-y-6 py-4 relative animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-white/5">
                {/* QR Code Placeholder - In a real app use a QR library */}
                <div className="w-48 h-48 bg-black flex items-center justify-center text-white rounded-xl overflow-hidden relative">
                    <div className={`absolute inset-0 opacity-50 bg-cover bg-center mix-blend-screen`} style={{ backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}')` }} />
                    <QrCode size={48} className="relative z-10 text-white" />
                </div>
            </div>
            <div className="w-full space-y-2">
                <label className="text-xs text-circle-muted uppercase font-bold text-center block tracking-wider">Your Address</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3 group hover:border-white/20 transition-colors cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(address)
                    toast.success("Address copied!")
                }}>
                    <span className="text-xs text-circle-muted font-mono truncate flex-1 group-hover:text-white transition-colors">{address || 'Generating...'}</span>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-circle-blue">
                        <Copy size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
