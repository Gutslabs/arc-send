export type Transaction = {
    type: 'send' | 'mint' | 'Send' | 'Mint'
    amount: string
    hash: string
    timestamp: number
    to?: string
    status?: 'pending' | 'confirmed' | 'failed'
}

export type Recipient = {
    address: string
    amount: string
}
