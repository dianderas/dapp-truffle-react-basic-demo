// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Airline {

    address public owner;
    struct Customer {
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint price;
    }

    uint etherPerPoint = 0.5 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFLights;
    mapping(address => uint) public customerTotalFLights;

    event FlightPurchased(address indexed customer, uint price, string flight);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight("Tokio", 4 ether));
        flights.push(Flight("Berlin", 3 ether));
        flights.push(Flight("Madrir", 3 ether));
    }

    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price, "Require to pay flight");

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFLights[msg.sender].push(flight);
        customerTotalFLights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price, flight.name);
    }

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airlineAddress = address(this);
        return airlineAddress.balance;
    }

    modifier  isOwner() {
        require(msg.sender == owner, 'only the owner can to call this function');
        _;
    }
}