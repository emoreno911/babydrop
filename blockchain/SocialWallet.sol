// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

contract SocialWallet {
    IERC20 _token20;
    
    string public name;
    address private owner;
    bytes32 private pincode;
    bool private isInitialized;

    receive() external payable {}
    
    modifier onlyOwner() {
      require(msg.sender == owner, "caller is not owner");
      _;
    }

    function init(address deployer, string memory _name, bytes32 _pincode) external {
        require(!isInitialized, "initialized contract");
        owner = deployer;
        pincode = _pincode;
        name = _name;
        isInitialized = true;
    }
    
    function getPinHash() external view onlyOwner returns (bytes32) {
        return pincode;
    }

    function withdraw(uint amount, address beneficiary) external onlyOwner {
        payable(beneficiary).transfer(amount);
    }
    
    function withdrawToken(address contractAddr, uint amount, address beneficiary) external onlyOwner {
        _token20 = IERC20(contractAddr);
        _token20.transfer(beneficiary, amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getOwner() external view returns (address) {
        return owner;
    }
}