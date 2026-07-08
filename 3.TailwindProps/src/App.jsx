import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Card from './components/Card.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-3xl font-bold bg-blue-500 text-white p-2'>Vite with Tailwind</h1>
      <Card username="Makime" animename="Chainsaw Man"/> // we can also pass arrays and objects but they have to enclosed in curly braces. For example, if we want to pass an array of strings, we can do it like this: <Card username={["Makime", "Akaza"]} animename="Chainsaw Man"/>. If we want to pass an object, we can do it like this: <Card username={{name: "Makime", age: 25}} animename="Chainsaw Man"/>. In the Card component, we can access the array or object using props.username[0] or props.username.name respectively.
      <Card/>
    </>
  )
}

export default App
