import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'

interface ModeToggleProps {
    mode: 'send' | 'receive' | 'schedule'
    setMode: (mode: 'send' | 'receive' | 'schedule') => void
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
    return (
        <div className="flex justify-center gap-2 bg-circle-card/50 p-1.5 rounded-full w-fit mx-auto border border-white/5">
            <button
                onClick={() => setMode('send')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${mode === 'send' ? 'bg-circle-blue text-white shadow-lg shadow-circle-blue/25' : 'text-circle-muted hover:text-white hover:bg-white/5'}`}
            >
                <ArrowUpRight size={16} /> Send
            </button>
            <button
                onClick={() => setMode('receive')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${mode === 'receive' ? 'bg-circle-blue text-white shadow-lg shadow-circle-blue/25' : 'text-circle-muted hover:text-white hover:bg-white/5'}`}
            >
                <ArrowDownLeft size={16} /> Receive
            </button>
            <button
                onClick={() => setMode('schedule')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${mode === 'schedule' ? 'bg-circle-blue text-white shadow-lg shadow-circle-blue/25' : 'text-circle-muted hover:text-white hover:bg-white/5'}`}
            >
                <Clock size={16} /> Schedule
            </button>
        </div>
    )
}
