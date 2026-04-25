// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title SplitRent — Inversión fraccionada en bienes raíces sobre Monad
/// @notice Permite comprar fracciones (tokens) de propiedades, recibir renta y reclamarla.
contract SplitRent {

    // ── Structs ──────────────────────────────────────────────────────────────

    struct Property {
        string  name;
        string  location;
        uint256 tokenPrice;            // MON (wei) por token
        uint256 totalTokens;           // oferta total
        uint256 tokensSold;            // vendidos hasta ahora
        uint256 rewardPerTokenStored;  // acumulado de renta por token (×1e18)
        bool    active;
    }

    // ── State ─────────────────────────────────────────────────────────────────

    address public owner;
    Property[] public properties;

    // propId → holder → tokens
    mapping(uint256 => mapping(address => uint256)) public tokenBalances;
    // propId → holder → checkpoint de rewardPerToken
    mapping(uint256 => mapping(address => uint256)) public userRewardPerTokenPaid;
    // propId → holder → renta pendiente (wei)
    mapping(uint256 => mapping(address => uint256)) public pendingRewards;

    // ── Errors ────────────────────────────────────────────────────────────────

    error NotOwner();
    error InvalidProperty();
    error PropertyNotActive();
    error SoldOut();
    error InsufficientPayment();
    error NoTokensSold();
    error NothingToClaim();
    error TransferFailed();

    // ── Events ────────────────────────────────────────────────────────────────

    event PropertyAdded(uint256 indexed propId, string name, string location, uint256 tokenPrice, uint256 totalTokens);
    event TokensPurchased(uint256 indexed propId, address indexed buyer, uint256 amount, uint256 cost);
    event RentDistributed(uint256 indexed propId, address indexed distributor, uint256 totalMon);
    event RentClaimed(uint256 indexed propId, address indexed claimer, uint256 amount);

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;

        _addProperty("Departamento Condesa",   "CDMX",         0.001  ether, 1000);
        _addProperty("Casa San Pedro",          "Monterrey",    0.0008 ether, 1000);
        _addProperty("Loft Providencia",        "Guadalajara",  0.0025 ether,  500);
    }

    // ── Modifiers ─────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier validProp(uint256 propId) {
        if (propId >= properties.length) revert InvalidProperty();
        _;
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    function _addProperty(
        string memory name,
        string memory location,
        uint256 tokenPrice,
        uint256 totalTokens
    ) internal {
        uint256 id = properties.length;
        properties.push(Property({
            name:                 name,
            location:             location,
            tokenPrice:           tokenPrice,
            totalTokens:          totalTokens,
            tokensSold:           0,
            rewardPerTokenStored: 0,
            active:               true
        }));
        emit PropertyAdded(id, name, location, tokenPrice, totalTokens);
    }

    function _earned(uint256 propId, address account) internal view returns (uint256) {
        return
            (tokenBalances[propId][account] *
                (properties[propId].rewardPerTokenStored - userRewardPerTokenPaid[propId][account])
            ) / 1e18
            + pendingRewards[propId][account];
    }

    function _updateReward(uint256 propId, address account) internal {
        pendingRewards[propId][account]         = _earned(propId, account);
        userRewardPerTokenPaid[propId][account] = properties[propId].rewardPerTokenStored;
    }

    // ── Public write functions ─────────────────────────────────────────────────

    /// @notice Compra `amount` tokens de la propiedad `propId`.
    function buyTokens(uint256 propId, uint256 amount) external payable validProp(propId) {
        Property storage prop = properties[propId];
        if (!prop.active)                              revert PropertyNotActive();
        if (prop.tokensSold + amount > prop.totalTokens) revert SoldOut();
        uint256 cost = prop.tokenPrice * amount;
        if (msg.value < cost)                          revert InsufficientPayment();

        _updateReward(propId, msg.sender);
        tokenBalances[propId][msg.sender] += amount;
        prop.tokensSold                  += amount;

        // Devuelve exceso
        uint256 excess = msg.value - cost;
        if (excess > 0) {
            (bool ok,) = payable(msg.sender).call{value: excess}("");
            if (!ok) revert TransferFailed();
        }

        emit TokensPurchased(propId, msg.sender, amount, cost);
    }

    /// @notice El owner distribuye renta enviando MON. Se reparte pro-rata entre holders.
    function distributeRent(uint256 propId) external payable onlyOwner validProp(propId) {
        if (properties[propId].tokensSold == 0) revert NoTokensSold();
        require(msg.value > 0, "SplitRent: must send MON");

        properties[propId].rewardPerTokenStored +=
            (msg.value * 1e18) / properties[propId].tokensSold;

        emit RentDistributed(propId, msg.sender, msg.value);
    }

    /// @notice El holder reclama toda su renta pendiente de la propiedad `propId`.
    function claimRent(uint256 propId) external validProp(propId) {
        _updateReward(propId, msg.sender);

        uint256 reward = pendingRewards[propId][msg.sender];
        if (reward == 0) revert NothingToClaim();

        pendingRewards[propId][msg.sender] = 0;
        (bool ok,) = payable(msg.sender).call{value: reward}("");
        if (!ok) revert TransferFailed();

        emit RentClaimed(propId, msg.sender, reward);
    }

    /// @notice Owner puede añadir nuevas propiedades post-deploy.
    function addProperty(
        string calldata name,
        string calldata location,
        uint256 tokenPrice,
        uint256 totalTokens
    ) external onlyOwner {
        _addProperty(name, location, tokenPrice, totalTokens);
    }

    /// @notice Owner puede activar/desactivar una propiedad.
    function setPropertyActive(uint256 propId, bool active) external onlyOwner validProp(propId) {
        properties[propId].active = active;
    }

    // ── Public view functions ──────────────────────────────────────────────────

    function earned(uint256 propId, address account) external view validProp(propId) returns (uint256) {
        return _earned(propId, account);
    }

    function propertiesCount() external view returns (uint256) {
        return properties.length;
    }

    /// @notice Devuelve todos los campos de una propiedad.
    function getProperty(uint256 propId)
        external
        view
        validProp(propId)
        returns (
            string memory name,
            string memory location,
            uint256 tokenPrice,
            uint256 totalTokens,
            uint256 tokensSold,
            bool active
        )
    {
        Property storage p = properties[propId];
        return (p.name, p.location, p.tokenPrice, p.totalTokens, p.tokensSold, p.active);
    }
}
