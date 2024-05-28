// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;


interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);
}

contract BBDropProtocol {
    IERC20 _token20;
    
    enum ClaimStatus {
        Opened,
        Closed
    }

    struct Deposit {
        uint amount;
        string sender;
        ClaimStatus status; 
        address contractAddr;
    }
    
    address public owner;

    mapping(string => Deposit) public deposits;

    mapping(string => bytes32) private hashes;

    event DepositCreated(string id, address contractAddr);

    event DepositClaimed(string id, address beneficiary);

    event TransferReceived(address indexed _from, uint _value);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }

    receive() external payable {
        emit TransferReceived(msg.sender,msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function createDeposit(
        string memory id,
        bytes32 hash,
        uint amount,
        string memory sender,
        address contractAddr
    ) public {
        // check if id is already taken
        Deposit memory deposit;
        deposit = Deposit(
            amount,
            sender,
            ClaimStatus.Opened,
            contractAddr
        );

        deposits[id] = deposit;
        hashes[id] = hash;
        emit DepositCreated(id, contractAddr);
    }

    function validateClaim(string memory id, string memory pwd) public view returns(string memory, address) {
        require(_makeAndCompareHash(id, pwd), "Invalid password, hash doesn't match");
        return _depositToString(id);
    }

    function executeClaim(
        string memory id, 
        string memory pwd,
        address payable beneficiary
    ) public payable {
        require(_makeAndCompareHash(id, pwd), "Invalid password, hash doesn't match");
        require(deposits[id].status == ClaimStatus.Opened, "Deposit already claimed!");

        _token20 = IERC20(deposits[id].contractAddr);
        _token20.transfer(beneficiary, deposits[id].amount);
        
        deposits[id].status = ClaimStatus.Closed;
        emit DepositClaimed(id, beneficiary);
    }

    function _stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bool result = keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
        return result;
    }

    function _makeAndCompareHash(string memory id, string memory pwd) private view returns (bool) {
        bytes32 hash = sha256(abi.encodePacked(pwd));
        return hashes[id] == hash;
    }

    function _depositToString(string memory id) private view returns (string memory, address) {
        string memory claimed = deposits[id].status == ClaimStatus.Closed ? "1" : "0";
        
        string memory deposit_ = _joinStrings(
            _uintToString(deposits[id].amount),
            deposits[id].sender,
            claimed
        );

        return (deposit_, deposits[id].contractAddr);
    }

    function _joinStrings(string memory a, string memory b, string memory c) 
        internal pure returns (string memory result) {
            string memory sp = "|";
            result = string(abi.encodePacked(a, sp, b, sp, c));
    }

    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}