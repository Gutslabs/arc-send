import { Plus, Trash2, Wallet, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Recipient } from '../types'

interface SendFormProps {
    recipients: Recipient[]
    setRecipients: (recipients: Recipient[]) => void
    handleSend: () => Promise<void>
    loading: boolean
    balance: number
}

export default function SendForm({ recipients, setRecipients, handleSend, loading, balance }: SendFormProps) {
    const [expandedIndex, setExpandedIndex] = useState<number>(0)

    const addRecipient = () => {
        const newRecipients = [...recipients, { address: '', amount: '' }]
        setRecipients(newRecipients)
        setExpandedIndex(newRecipients.length - 1)
    }

    const removeRecipient = (index: number) => {
        if (recipients.length > 1) {
            const newRecipients = recipients.filter((_, i) => i !== index)
            setRecipients(newRecipients)
            if (expandedIndex >= index && expandedIndex > 0) {
                setExpandedIndex(expandedIndex - 1)
            }
        }
    }

    const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
        const newRecipients = [...recipients]
        newRecipients[index] = { ...newRecipients[index], [field]: value }
        setRecipients(newRecipients)
    }

    return (
        <div className="space-y-4 relative animate-in fade-in zoom-in-95 duration-300">
            <div className="max-h-[450px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {recipients.map((recipient, index) => {
                    const isExpanded = index === expandedIndex

                    return (
                        <div key={index} className="relative group/item transition-all duration-300">
                            {/* Collapsed View */}
                            {!isExpanded && (
                                <button
                                    onClick={() => setExpandedIndex(index)}
                                    className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center justify-between group transition-all border border-transparent hover:border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-circle-blue/20 flex items-center justify-center text-circle-blue font-bold text-xs">
                                            {index + 1}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-white">Recipient {index + 1}</div>
                                            <div className="text-xs text-circle-muted font-mono">
                                                {recipient.address ? `${recipient.address.slice(0, 6)}...${recipient.address.slice(-4)}` : 'No address'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {recipient.amount && (
                                            <span className="text-sm font-bold text-white">{recipient.amount} USDC</span>
                                        )}
                                        <ChevronDown size={16} className="text-circle-muted group-hover:text-white transition-colors" />
                                    </div>
                                </button>
                            )}

                            {/* Expanded View */}
                            {isExpanded && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    {/* Amount Input Box */}
                                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all group/input border border-circle-blue/20 shadow-lg shadow-circle-blue/5">
                                        <div className="flex justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-circle-blue flex items-center justify-center text-white font-bold text-[10px]">
                                                    {index + 1}
                                                </div>
                                                <label className="text-xs text-circle-muted font-medium group-focus-within/input:text-circle-blue transition-colors">Amount</label>
                                            </div>
                                            {recipients.length > 1 && (
                                                <button onClick={() => removeRecipient(index)} className="text-circle-muted hover:text-red-400 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                value={recipient.amount}
                                                onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                                                placeholder="0"
                                                className="w-full !bg-transparent text-3xl font-medium text-white focus:outline-none placeholder:text-white/10 border-none p-0 focus:ring-0 appearance-none"
                                                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="flex justify-between mt-2">
                                            <span className="text-xs text-circle-muted">≈ ${recipient.amount || '0.00'}</span>
                                            <div className="flex gap-2">
                                                {[1, 10, 100, 'Max'].map((val, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => updateRecipient(index, 'amount', typeof val === 'number' ? val.toString() : balance.toString())}
                                                        className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-xs font-medium text-white/70 hover:text-white transition-all active:scale-95"
                                                    >
                                                        {typeof val === 'number' ? `$${val}` : 'Max'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Input Box */}
                                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all group/input">
                                        <label className="text-xs text-circle-muted font-medium mb-1 block group-focus-within/input:text-circle-blue transition-colors">To</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={recipient.address}
                                                onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                                                placeholder="Wallet Address or ENS"
                                                className="w-full !bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-white/10 font-mono border-none p-0 focus:ring-0 appearance-none"
                                                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                                            />
                                            <Wallet size={20} className="text-circle-muted shrink-0" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="pt-2 space-y-3">
                <button
                    onClick={addRecipient}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-circle-muted hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus size={16} /> Add Recipient
                </button>

                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="w-full bg-circle-blue text-white font-bold py-4 rounded-xl hover:bg-circle-blue/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-circle-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : recipients.length > 1 ? `Send to ${recipients.length} Recipients` : 'Send USDC'}
                </button>
            </div>
        </div>
    )
}
