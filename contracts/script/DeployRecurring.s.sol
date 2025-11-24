// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/RecurringPayments.sol";

contract DeployRecurring is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        RecurringPayments payments = new RecurringPayments();
        console.log("RecurringPayments deployed at:", address(payments));

        vm.stopBroadcast();
    }
}
