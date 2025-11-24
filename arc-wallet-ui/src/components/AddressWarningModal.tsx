interface AddressWarningModalProps {
    showAddressWarning: boolean
    setShowAddressWarning: (show: boolean) => void
    pendingRecipient: string
    executeSend: () => Promise<void>
}

export default function AddressWarningModal({ showAddressWarning, setShowAddressWarning, pendingRecipient, executeSend }: AddressWarningModalProps) {
    if (!showAddressWarning) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddressWarning(false)}>
            <div className="bg-circle-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">⚠️ New Address</h3>
                        <button onClick={() => setShowAddressWarning(false)} className="text-circle-muted hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-circle-muted text-sm">
                            You haven't interacted with this address before. Are you sure you want to proceed?
                        </p>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                            <p className="text-xs text-circle-muted mb-1">Recipient Address:</p>
                            <p className="text-white font-mono text-xs break-all">{pendingRecipient}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowAddressWarning(false)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                setShowAddressWarning(false)
                                await executeSend()
                            }}
                            className="flex-1 bg-circle-blue hover:bg-circle-blue/80 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
