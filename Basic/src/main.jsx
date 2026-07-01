import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const reactElement = {
    type: 'a',
    props: {
        href: "https://www.google.com",
        target: '_blank'
    },
    children: 'Click me to visit Google'
}

function MyApp() {
  return (
    <div>
      <h1>Custom React App</h1>
    </div>
  )
}

const AnotherElement = (
  <a href="http://google.com" target="_blank">
    Click me to visit Google
  </a>
)

const areactElement = React.createElement(
  'a',
  { href: 'https://www.google.com', target: '_blank' },
  'Click me to visit Google'
  // the expressions inside the curly braces will be evaluated and the result will be rendered as the content of the anchor tag
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
  // <MyApp />
  // AnotherElement
  // reactElement wont work here because it is not a valid React element, it is just a plain JavaScript object.
  // areactElement //lowercase works here because it is a valid React element created using React.createElement
)
