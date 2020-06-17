import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useObservable } from '../../utils/observableHook';
import { fromWei } from '../../utils/converter';
import { accountService } from '../services';

import './home.scss';

export default (props) => {
  const account = useObservable(accountService.account);

  const [balance, setBalance] = useState('');
  const [airlineFlights, setAirlineFlights] = useState([]);
  const [customerFlights, setCustomerFlights] = useState([]);
  const [refundableEther, setRefundableEther] = useState('');
  const [lastTx, setLastTx] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (account) {
      getBalance();

      if (props.contract) {
        getFlights();
        getCustomerFlights();
        getRefundableEther();
      }
    }
  }, [account, props.contract]);

  useEffect(() => {
    if (props.contract) {
      const events = props.contract.allEvents();
      events.on('data', (events) => {
        setLastTx({ name: events.event, args: events.args });
      })
    }

  }, [props.contract]);

  useEffect(() => {
    if (lastTx.name === 'FlightPurchased') {
      const { customer, price, flight } = lastTx.args;
      if (customer.toLowerCase() === account) {
        console.log(`You purchased a flight to ${flight} with a cost of ${price}`);
        getBalance();
        getCustomerFlights();
        getRefundableEther();
      } else {
        setAlert({
          message: `Last customer pruchased a flight to ${flight} with a cost of ${fromWei(price)} eth.`,
        })
      }
    }
  }, [lastTx])


  async function getBalance() {
    const weiBalance = await props.web3.eth.getBalance(account);
    setBalance(weiBalance);
  }

  async function getFlights() {
    const total = await getTotalFlights();
    let flights = [];

    for (let i = 0; i < total; i++) {
      const flight = await props.contract.flights(i);
      flights.push(flight);
    }
    flights = mapFlights(flights)

    setAirlineFlights(flights);
  };

  function buyFlight(flightIndex, flight) {
    return props.contract.buyFlight(flightIndex, { from: account, value: flight.price });
  }

  async function getRefundableEther() {
    const amount = await props.contract.getRefundableEther({ from: account });
    setRefundableEther(amount);
  }

  async function refundLoyaltyPoints() {
    await props.contract.redeemLoyaltyPoints({ from: account });
  }

  async function getCustomerFlights() {
    const customerTotalFlights = await props.contract.customerTotalFLights(account);
    let flights = [];

    for (let i = 0; i < customerTotalFlights.toNumber(); i++) {
      const flight = await props.contract.customerFLights(account, i);
      flights.push(flight);
    }

    flights = mapFlights(flights);
    setCustomerFlights(flights);
  }

  function mapFlights(flights) {
    return flights.map(flight => {
      return {
        name: flight[0],
        price: flight[1],
        etherPrice: fromWei(flight[1]),
      }
    });
  }

  async function getTotalFlights() {
    return (await props.contract.totalFlights()).toNumber();
  }

  return (
    <Fragment>
      <header>
        {alert && <div className="information">{alert.message}</div>}
        <h2>Welcome to the Airline!</h2>
      </header>
      <section className="home">
        <article>
          <h4>Balance</h4>
          <section>
            <p>{account}</p>
            <p><b>Balance:</b> {fromWei(balance)} ether</p>
          </section>
        </article>
        <article>
          <h4>Loyalty points - refundable ether</h4>
          <section>
            <p>{fromWei(refundableEther)} eth</p>
            <button onClick={refundLoyaltyPoints}>Refund</button>
          </section>
        </article>
        <article>
          <h4>Available flights</h4>
          <section>
            {airlineFlights.map((flight, index) => (
              <section key={index} className="App-content-item">
                <p>{flight.name} - cost: {flight.etherPrice} ether</p>
                <button onClick={() => buyFlight(index, flight)}>Purchase</button>
              </section>
            ))}
          </section>
        </article>
        <article>
          <h4>Your flights</h4>
          <section>
            {customerFlights.map((flight, index) => (
              <section key={index} className="App-content-item">
                <p>{flight.name} cost: {flight.etherPrice}</p>
              </section>
            ))}
          </section>
        </article>
      </section>
    </Fragment>
  );
}
