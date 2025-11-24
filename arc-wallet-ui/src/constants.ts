export const ARC_RPC_URL = "https://rpc.testnet.arc.network"
export const MOCK_USDC_ADDRESS = "0xa916a06f2b742ebb09abfaeb97c43243383f4ac7"
export const CIRCLE_USDC_ADDRESS = "0x3600000000000000000000000000000000000000"

export const USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function mint(address to, uint256 amount)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)"
]

export const MULTISEND_ADDRESS = "0xbf4c45ea8e0fafa064c0f6effd7d61ac1a960dfb"
export const RECURRING_PAYMENTS_ADDRESS = "0x191cb7c21a9bc0d24574c44114c3a5487ae331a2"

export const MULTISEND_ABI = [
    "function multiSend(address token, address[] recipients, uint256[] amounts)"
]

export const RECURRING_PAYMENTS_ABI = [
    "function createSchedule(address _recipient, address _token, uint256 _amount, uint256 _interval)",
    "function executePayment(uint256 _scheduleId)",
    "function cancelSchedule(uint256 _scheduleId)",
    "function getSchedule(uint256 _scheduleId) view returns (tuple(address sender, address recipient, address token, uint256 amount, uint256 interval, uint256 lastPaymentTime, bool isActive))",
    "function nextScheduleId() view returns (uint256)",
    "event ScheduleCreated(uint256 indexed scheduleId, address indexed sender, address indexed recipient, uint256 amount, uint256 interval)",
    "event PaymentExecuted(uint256 indexed scheduleId, uint256 timestamp)"
]
