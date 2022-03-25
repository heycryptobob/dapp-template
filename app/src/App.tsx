import './App.css';

import {
  useCall,
  useContractFunction,
  useEtherBalance,
  useEthers,
} from '@usedapp/core'
import { ethers } from 'ethers';

import { useForm } from "react-hook-form";

const CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const Artifact = require("./artifacts/contracts/Greeter.sol/Greeter.json")
const contract = new ethers.Contract(CONTRACT, Artifact.abi)

function useGreet(): string | undefined {
  const { value, error } = useCall({
    contract,
    method: "greet",
    args: []
  }) ?? {}
  if (error) {
    console.error(error)
    return undefined
  }
  return value?.[0]
}

function Form() {

  const { register, handleSubmit } = useForm();
  const { state, send } = useContractFunction(contract, "setGreeting", { transactionName: "setGreeting" })

  const onSubmit = async (data: any) => {
    await send(data.greeting)
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("greeting")} />
        <input type="submit" />
      </form>
      <code>{JSON.stringify(state)}</code>
    </>
  )
}


function App() {
  const { activateBrowserWallet, account, deactivate } = useEthers()
  const etherBalance = useEtherBalance(account)
  const greeting = useGreet()
  return (
    <div>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}
      {account && <button onClick={() => deactivate()}>Disconnect</button>}
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {ethers.utils.formatEther(etherBalance)}</p>}
      {greeting && <p>Greeting: {greeting}</p>}
      <Form />
    </div>
  )

}

export default App;
