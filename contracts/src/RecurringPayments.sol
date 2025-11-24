// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract RecurringPayments {
    struct Schedule {
        address sender;
        address recipient;
        address token;
        uint256 amount;
        uint256 interval;
        uint256 lastPaymentTime;
        bool isActive;
    }

    uint256 public nextScheduleId;
    mapping(uint256 => Schedule) public schedules;
    
    // Events
    event ScheduleCreated(uint256 indexed scheduleId, address indexed sender, address indexed recipient, uint256 amount, uint256 interval);
    event PaymentExecuted(uint256 indexed scheduleId, uint256 timestamp);
    event ScheduleCancelled(uint256 indexed scheduleId);

    function createSchedule(address _recipient, address _token, uint256 _amount, uint256 _interval) external {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be > 0");
        require(_interval > 0, "Interval must be > 0");

        schedules[nextScheduleId] = Schedule({
            sender: msg.sender,
            recipient: _recipient,
            token: _token,
            amount: _amount,
            interval: _interval,
            lastPaymentTime: block.timestamp, // First payment starts after 1 interval
            isActive: true
        });

        emit ScheduleCreated(nextScheduleId, msg.sender, _recipient, _amount, _interval);
        nextScheduleId++;
    }

    function executePayment(uint256 _scheduleId) external {
        Schedule storage schedule = schedules[_scheduleId];
        
        require(schedule.isActive, "Schedule is not active");
        require(block.timestamp >= schedule.lastPaymentTime + schedule.interval, "Payment not due yet");

        // Update time BEFORE transfer to prevent reentrancy (though simple transferFrom is usually safe)
        schedule.lastPaymentTime = block.timestamp;

        // Execute Transfer
        bool success = IERC20(schedule.token).transferFrom(schedule.sender, schedule.recipient, schedule.amount);
        require(success, "Transfer failed");

        emit PaymentExecuted(_scheduleId, block.timestamp);
    }

    function cancelSchedule(uint256 _scheduleId) external {
        require(msg.sender == schedules[_scheduleId].sender, "Not schedule owner");
        schedules[_scheduleId].isActive = false;
        emit ScheduleCancelled(_scheduleId);
    }

    function getSchedule(uint256 _scheduleId) external view returns (Schedule memory) {
        return schedules[_scheduleId];
    }
}
