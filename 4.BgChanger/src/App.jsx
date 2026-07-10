import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [color, setColor] = useState('olive')
  function handleColorChange(newColor) {
    setColor(newColor)
  }
  return (
    <div className='w-full h-screen duration-200' style={{ backgroundColor: color }}>
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
        <div className='flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl'>
          <button style={{ backgroundColor: 'red' }} onClick={() => handleColorChange('red')}>
            Red
          </button>
          <button style={{ backgroundColor: 'blue' }} onClick={() => setColor('blue')}>
            Blue
          </button>
          <button style={{ backgroundColor: 'green' }} onClick={() => handleColorChange('green')}>
            Green
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
