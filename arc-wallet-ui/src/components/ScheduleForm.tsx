import { Wallet, Clock } from 'lucide-react'
import { useState } from 'react'

interface ScheduleFormProps {
    handleCreateSchedule: (recipient: string, amount: string, interval: number) => Promise<void>
    loading: boolean
    balance: number
}

export default function ScheduleForm({ handleCreateSchedule, loading, balance }: ScheduleFormProps) {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [intervalValue, setIntervalValue] = useState('1')
    const [intervalUnit, setIntervalUnit] = useState<'minutes' | 'hours' | 'days'>('minutes')

    const calculateIntervalSeconds = () => {
        const val = parseInt(intervalValue) || 0
        switch (intervalUnit) {
            case 'minutes': return val * 60
            case 'hours': return val * 3600
            case 'days': return val * 86400
            default: return 0
        }
    }

    const onSubmit = () => {
        const seconds = calculateIntervalSeconds()
        if (seconds > 0 && recipient && amount) {
            handleCreateSchedule(recipient, amount, seconds)
        }
    }

    return (
        <div className="relative min-h-[400px] flex items-center justify-center">
            {/* Blurred Content */}
            <div className="space-y-4 w-full filter blur-md opacity-50 pointer-events-none select-none">
                <div className="space-y-2 relative group/item">
                    {/* Amount Input Box */}
                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all group/input">
                        <div className="flex justify-between mb-1">
                            <label className="text-xs text-circle-muted font-medium group-focus-within/input:text-circle-blue transition-colors">Amount per Interval</label>
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                inputMode="decimal"
                                pattern="[0-9]*"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full !bg-transparent text-3xl font-medium text-white focus:outline-none placeholder:text-white/10 border-none p-0 focus:ring-0 appearance-none"
                                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                            />
                        </div>

                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-circle-muted">≈ ${amount || '0.00'}</span>
                            <div className="flex gap-2">
                                {[1, 10, 100, 'Max'].map((val, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setAmount(typeof val === 'number' ? val.toString() : balance.toString())}
                                        className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-xs font-medium text-white/70 hover:text-white transition-all active:scale-95"
                                    >
                                        {typeof val === 'number' ? `$${val}` : 'Max'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interval Input Box */}
                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all group/input">
                        <label className="text-xs text-circle-muted font-medium mb-1 block group-focus-within/input:text-circle-blue transition-colors">Frequency</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={intervalValue}
                                onChange={(e) => setIntervalValue(e.target.value)}
                                className="w-20 !bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-white/10 font-mono border-none p-0 focus:ring-0 appearance-none text-center border-b border-white/10"
                                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                            />
                            <div className="flex-1 flex gap-2">
                                {(['minutes', 'hours', 'days'] as const).map((unit) => (
                                    <button
                                        key={unit}
                                        onClick={() => setIntervalUnit(unit)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${intervalUnit === unit ? 'bg-circle-blue text-white' : 'bg-white/5 text-circle-muted hover:bg-white/10'}`}
                                    >
                                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <Clock size={20} className="text-circle-muted shrink-0" />
                        </div>
                    </div>

                    {/* Address Input Box */}
                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all group/input">
                        <label className="text-xs text-circle-muted font-medium mb-1 block group-focus-within/input:text-circle-blue transition-colors">To</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Wallet Address or ENS"
                                className="w-full !bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-white/10 font-mono border-none p-0 focus:ring-0 appearance-none"
                                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                            />
                            <Wallet size={20} className="text-circle-muted shrink-0" />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="w-full bg-circle-blue text-white font-bold py-4 rounded-xl hover:bg-circle-blue/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-circle-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Schedule...' : 'Create Schedule'}
                    </button>
                </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                    <Clock className="text-circle-blue" size={20} />
                    <span className="font-medium text-white">Coming Soon</span>
                </div>
            </div>
        </div>
    )
}
