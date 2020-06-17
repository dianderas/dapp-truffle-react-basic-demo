import React, { useEffect, useState } from 'react';
import { accountService } from './modules/services';
import AirlineContract from './airline.contract';

import Home from './modules/Home/home';

export default (props) => {
    const [contract, setContract] = useState(null);

    useEffect(() => {

        (async () => {
            // because in the future we want the accouynt reference in 
            // multiple components is observable instead of passing it by props.
            const accounts = await props.web3.eth.getAccounts();
            accountService.setAccount(accounts[0]);

            // get current airline contract deployed
            const airline = await AirlineContract(props.web3.currentProvider);
            setContract(airline);

            props.web3.currentProvider.publicConfigStore.on('update', (event) => {
                accountService.setAccount(event.selectedAddress);
            });
        })();

        // NOTE: maybe add a mechanism to unsubscribe 

    }, []);

    return (
        <Home web3={props.web3} contract={contract} />
    )
}


