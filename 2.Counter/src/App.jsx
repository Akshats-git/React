import { useState } from 'react'
import './App.css'

function App() {

  const [counter, setCounter] = useState(0)  // variable,method and initial value
  // let counter = 0 this is not a state variable, so it will not update the UI when its value changes
  const addValue = () => {
    // setCounter(counter + 1); // calling the method to update the value of counter
    // setCounter(counter + 1);
    // setCounter(counter + 1);
    // setCounter(counter + 1); // batching of state updates, so the final value will be counter + 1, not counter + 4

    setCounter((prevCounter)=>prevCounter+1)
    setCounter((prevCounter)=>prevCounter+1) // this works as they cant be batched as they are using the previous value of the state variable
  }

  return (
    <>
      <h1>React with Akshat</h1>
      <h2>Counter Value : {counter}</h2>
      <button onClick={addValue}>Add Value</button> {" "}
      <button onClick={() => {setCounter(counter-1)}}>Remove Value</button>
      <p>Footer : {counter}</p>
    </>
  )
}

export default App
