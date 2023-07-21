// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ExponentialLove is Ownable {
    constructor(address dao) {
        transferOwnership(dao);
    }

    function withdraw() public {
        payable(owner()).transfer(address(this).balance);
    }
}
