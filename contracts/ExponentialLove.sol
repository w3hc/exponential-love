// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Exponential Love
/// @author Web3 Hackers Collective
/// @notice Unsafe for production. Use it at your own risk.
/// @custom:security-contact julien@strat.cc
contract ExponentialLove is Ownable {
    uint public sponsorshipAmount;
    uint public multiplier;
    uint public total;

    constructor(address _dao, uint _sponsorshipAmount) {
        transferOwnership(_dao);
        sponsorshipAmount = _sponsorshipAmount;
    }

    function addSponsor() public payable {
        require(msg.value == sponsorshipAmount, "Wrong sponsorship amount");
        multiplier += 1;
    }

    function donate(uint amount) private {
        total += amount + amount * multiplier;
    }

    function withdraw() public {
        payable(owner()).transfer(total);
    }

    receive() external payable {
        donate(msg.value);
    }

    fallback() external payable {
        donate(msg.value);
    }
}
