const Airline = artifacts.require('./Airline');

let instance;

beforeEach(async () => {
    instance = await Airline.new();
});

contract('Airline', accounts => {
    it('should be have available flights', async () => {
        const total = await instance.totalFlights();
        assert(total > 0);
    });

    it('should allow customers to buy a flight providing its value', async () => {
        const { name, price } = await instance.flights(0);

        await instance.buyFlight(0, { from: accounts[0], value: price });

        const { name: customerFlightName, price: customerFlightPrice } =
            await instance.customerFLights(accounts[0], 0);
        const customerTotalFlights = await instance.customerTotalFLights(accounts[0]);

        assert(customerFlightName, name);
        assert(customerFlightPrice, price);
        assert(customerTotalFlights, 1);
    });

    it('should not allow customers to buy flights under the price', async () => {
        let { _, price } = await instance.flights(0);
        price = price - 5000;
        try {
            await instance.buyFlight(0, { from: accounts[0], value: price });
        } catch (e) { return }
        assert.fail();
    });

    it('should get the real balance of the contract', async () => {
        const { price: price1 } = await instance.flights(0);
        const { price: price2 } = await instance.flights(1);

        await instance.buyFlight(0, { from: accounts[0], value: price1 });
        await instance.buyFlight(1, { from: accounts[0], value: price2 });

        const newAirlineBalance = await instance.getAirlineBalance();

        assert.equal(newAirlineBalance.toString(), price1.add(price2).toString());
    });

    it('should allow customers to redeen loyalty points', async () => {
        const { price } = await instance.flights(1);

        await instance.buyFlight(1, { from: accounts[0], value: price });
        const balance = await web3.eth.getBalance(accounts[0]);

        await instance.redeemLoyaltyPoints({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const { loyaltyPoints } = await instance.customers(accounts[0]);

        assert(loyaltyPoints, 0);
        assert(finalBalance > balance);

    });
});
