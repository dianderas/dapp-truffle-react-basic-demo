import React, { useState, useEffect } from 'react';
import Dapp from './Dapp';
import getWeb3 from './utils/lastestWeb3';

function App() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    (async () => {
      const lastestWeb3 = await getWeb3();
      setWeb3(lastestWeb3);
    })();

  }, []);

  return (
    <section>
      {!web3 ? <div>Loading</div> :
        <Dapp web3={web3} />
      }
    </section>
  );
}

export default App;
