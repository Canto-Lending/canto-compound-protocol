pragma solidity ^0.5.16;

import "./EIP20Interface.sol";

contract WEth9 is EIP20Interface {
    string private _name;
    string private _symbol;
    uint8  private _decimals = 18;
    mapping (address => uint)                       public  _balanceOf;
    mapping (address => mapping (address => uint))  public  _allowance;


    constructor(string memory name_, string memory symbol_) public {
	_name = name_;
	_symbol = symbol_;
    }

    function() external payable {
        deposit();
    }

    function deposit() public payable {
        _balanceOf[msg.sender] += msg.value;
        /* emit Deposit(msg.sender, msg.value); */
    }


    function withdraw(uint wad) public {
        require(_balanceOf[msg.sender] >= wad);
        _balanceOf[msg.sender] -= wad;
        msg.sender.transfer(wad);
        /* emit Withdrawal(msg.sender, wad); */
    }

    
    function name() external view returns (string memory) {
	return _name;
    }
    function symbol() external view returns (string memory) {
	return _symbol;
    }
    function decimals() external view returns (uint8) {
	return _decimals;
    }
    
    function totalSupply() public view returns (uint) {
        return _balanceOf[address(this)];
    }

    function balanceOf(address owner) external view returns(uint256) {
	return _balanceOf[owner];
    }
    
    
    function approve(address guy, uint wad) public returns (bool) {
        _allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint wad)
        public
        returns (bool)
    {
        require(_balanceOf[src] >= wad);

        if (src != msg.sender && _allowance[src][msg.sender] != uint(-1)) {
            require(_allowance[src][msg.sender] >= wad);
            _allowance[src][msg.sender] -= wad;
        }

        _balanceOf[src] -= wad;
        _balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;

    }

    function approve(address owner, address spender) external returns(bool) {
	_approve(owner, spender, _balanceOf[owner]);
        return true;
    }

    
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal   {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowance[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
	_allowance[owner][spender];
    }


    event  Approval(address indexed src, address indexed guy, uint wad);
    event  Transfer(address indexed src, address indexed dst, uint wad);
    /* event  Deposit(address indexed dst, uint wad); */
    /* event  Withdrawal(address indexed src, uint wad); */
}

