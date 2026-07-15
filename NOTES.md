# React Notes

> Personal course notes. Built up lecture by lecture. Each section maps to topics
> practiced in this repo (`customReact/`, `Basic/`) plus extra points the instructor
> mentioned in the videos.

## Table of Contents
1. [What is React & Why Use It](#1-what-is-react--why-use-it)
2. [Creating a React Project](#2-creating-a-react-project)
3. [Project Structure (Vite)](#3-project-structure-vite)
4. [How React Works Under the Hood (Custom React)](#4-how-react-works-under-the-hood-custom-react)
5. [React.createElement & the Virtual DOM](#5-reactcreateelement--the-virtual-dom)
6. [JSX](#6-jsx)
7. [Rendering: createRoot & render](#7-rendering-createroot--render)
8. [Components](#8-components)
9. [State & the useState Hook](#9-state--the-usestate-hook)
10. [Handling Events](#10-handling-events)
11. [Updating State: Batching & the Updater Function](#11-updating-state-batching--the-updater-function)
12. [Props: Passing Data to Components](#12-props-passing-data-to-components)
13. [Styling with Tailwind CSS (v4)](#13-styling-with-tailwind-css-v4)
14. [Inline Styles & Passing Arguments to Event Handlers](#14-inline-styles--passing-arguments-to-event-handlers)
15. [The useEffect Hook (Side Effects)](#15-the-useeffect-hook-side-effects)
16. [The useCallback Hook (Memoizing Functions)](#16-the-usecallback-hook-memoizing-functions)
17. [The useRef Hook (Referencing DOM Nodes)](#17-the-useref-hook-referencing-dom-nodes)
18. [Controlled Inputs & Reading Form Values](#18-controlled-inputs--reading-form-values)
19. [Custom Hooks & Fetching Data from an API](#19-custom-hooks--fetching-data-from-an-api)
20. [Rendering Lists with .map() & Keys](#20-rendering-lists-with-map--keys)
21. [The useId Hook](#21-the-useid-hook)
22. [Forms: onSubmit & preventDefault](#22-forms-onsubmit--preventdefault)
23. [Callback Props & Barrel Exports](#23-callback-props--barrel-exports)
24. [Rules of Hooks](#24-rules-of-hooks)
25. [React Router: Setup & Routing](#25-react-router-setup--routing)
26. [Layouts & the Outlet](#26-layouts--the-outlet)
27. [Navigation: Link & NavLink](#27-navigation-link--navlink)
28. [Dynamic Routes & useParams](#28-dynamic-routes--useparams)
29. [Loaders & useLoaderData](#29-loaders--useloaderdata)
30. [Prop Drilling: The Problem Context Solves](#30-prop-drilling-the-problem-context-solves)
31. [The Context API](#31-the-context-api)
32. [The children Prop](#32-the-children-prop)
33. [Conditional Rendering](#33-conditional-rendering)
34. [Context, Refined: Default Values & a Custom Hook](#34-context-refined-default-values--a-custom-hook)
35. [Side Effects on the DOM (Dark Mode)](#35-side-effects-on-the-dom-dark-mode)
36. [Tailwind Dark Mode & the peer Pattern](#36-tailwind-dark-mode--the-peer-pattern)
37. [Rules & Gotchas (Quick Reference)](#37-rules--gotchas-quick-reference)

---

## 1. What is React & Why Use It

**React** is a JavaScript **library** (not a full framework) for building user
interfaces, maintained by Meta (Facebook). It lets you build UIs out of small,
reusable pieces called **components**.

**Why it exists / the core idea:**
- Traditional web pages update the DOM manually (`document.createElement`,
  `setAttribute`, `appendChild`...). This becomes very hard to manage as an app grows.
- React lets you **describe what the UI should look like** for a given state, and
  React figures out **how** to update the actual DOM efficiently.
- This is called a **declarative** approach (you declare the result) versus the
  **imperative** approach (you write every step of DOM manipulation).

**Key mental model:** UI = function of state. When your data changes, React
re-renders the components and updates only the parts of the DOM that actually changed.

---

## 2. Creating a React Project

There are two common ways to scaffold a React app:

```bash
# Option 1 - Create React App (older, heavier, now largely deprecated)
npx create-react-app my-app

# Option 2 - Vite (modern, fast, recommended)
npm create vite@latest
```

**Vite** is the modern build tool. It is preferred because:
- It is **much faster** during development (uses native ES modules + HMR — Hot
  Module Replacement, so the browser updates instantly on save).
- Smaller and lighter than Create React App.
- Faster production builds.

After `npm create vite@latest`, choose a framework (React) and a variant
(JavaScript / TypeScript). Then:

```bash
cd my-app
npm install      # install dependencies (creates node_modules)
npm run dev      # start the dev server
```

**Common Vite scripts** (from `package.json`):
| Script | Command | What it does |
|--------|---------|--------------|
| `dev` | `vite` | Starts the local dev server with HMR |
| `build` | `vite build` | Bundles the app for production |
| `preview` | `vite preview` | Serves the production build locally to test it |
| `lint` | `eslint .` | Runs ESLint to catch code issues |

> **Note:** This repo uses **React 19** with **Vite** as the build tool.

---

## 3. Project Structure (Vite)

A minimal Vite + React project looks like this:

```
Basic/
├── index.html          ← the single HTML page (entry point of the whole app)
├── package.json        ← dependencies + scripts
├── vite.config.js      ← Vite configuration (registers the React plugin)
├── public/             ← static assets served as-is (favicon, images)
└── src/
    ├── main.jsx        ← JS entry point; mounts React onto the page
    ├── App.jsx         ← the root component
    └── assets/         ← images/assets imported into components
```

**How it all connects:**
1. The browser loads `index.html`.
2. `index.html` contains one important element — the root div — and a script tag:
   ```html
   <div id="root"></div>
   <script type="module" src="/src/main.jsx"></script>
   ```
3. `main.jsx` grabs that `#root` div and tells React to render the `<App />`
   component inside it.
4. Everything you see on screen lives inside that single `#root` div. This is why
   React apps are called **Single Page Applications (SPA)** — there is really only
   one HTML page, and React swaps the content in and out.

---

## 4. How React Works Under the Hood (Custom React)

Before using real React, it helps to build a tiny version yourself. This is the
`customReact/` experiment.

A React element is, at its core, **just a plain JavaScript object** describing what
to render:

```js
const reactElement = {
    type: 'a',                       // the HTML tag to create
    props: {                         // attributes for that tag
        href: "https://www.google.com",
        target: '_blank'
    },
    children: 'Click me to visit Google'   // content inside the tag
}
```

A **render function** takes that object and turns it into a real DOM node:

```js
function customRender(reactElement, container) {
    const domElement = document.createElement(reactElement.type)   // <a>
    domElement.innerHTML = reactElement.children                   // text inside
    // loop over every prop and set it as an attribute
    for (const prop in reactElement.props) {
        if (prop === 'children') continue;   // skip children if present
        domElement.setAttribute(prop, reactElement.props[prop])
    }
    container.appendChild(domElement)        // put it on the page
}

const mainContainer = document.querySelector('#root');
customRender(reactElement, mainContainer)
```

**Why the loop matters:** Instead of hard-coding `setAttribute('href', ...)` and
`setAttribute('target', ...)` line by line, we loop over `props` so the function
works for **any** attributes. This is closer to how real React handles arbitrary props.

**The big takeaways:**
- React elements are just objects: `{ type, props, children }`.
- "Rendering" is the process of converting those objects into real DOM nodes.
- Real React does exactly this, but far more optimized (via the Virtual DOM and a
  diffing algorithm) so it only touches the DOM where something actually changed.

---

## 5. React.createElement & the Virtual DOM

Real React gives you `React.createElement()` to build element objects. Its signature:

```js
React.createElement(type, props, children)
```

Example (from `main.jsx`):

```js
const areactElement = React.createElement(
  'a',
  { href: 'https://www.google.com', target: '_blank' },
  'Click me to visit Google'
)
```

- `type` → the tag/component (`'a'`, `'div'`, or a component like `App`).
- `props` → an object of attributes.
- `children` → the content inside the element.

This produces a proper **React element** (a special object React understands), which
React can then render efficiently.

**Important distinction — why a hand-made object does NOT work:**

```js
const reactElement = {
  type: 'a',
  props: { href: "https://www.google.com", target: '_blank' },
  children: 'Click me to visit Google'
}
// createRoot(...).render(reactElement)  ❌ won't render
```
A plain object like this is **not** a valid React element — React won't render it.
You must use `React.createElement()` (or JSX, which compiles to it). React elements
carry extra internal fields (like `$$typeof`) that mark them as genuine React
elements; a raw object lacks these.

**Virtual DOM (VDOM):** React keeps a lightweight in-memory copy of the UI (a tree of
these element objects). When state changes, React builds a new virtual tree, compares
it with the previous one (**diffing / reconciliation**), and updates only the changed
parts of the real DOM. Direct DOM manipulation is slow; this makes React fast.

### Reconciliation & Diffing (short version)

- **Reconciliation** is the overall process React uses to figure out *what changed*
  between the old virtual tree and the new one, and then apply the minimum set of
  updates to the real DOM.
- **Diffing** is the algorithm inside reconciliation that actually **compares the two
  trees**. Comparing two trees perfectly is expensive (O(n³)), so React uses a fast
  **O(n) heuristic** based on two assumptions:
  1. **Different element types produce different trees.** If a `<div>` becomes a
     `<span>`, React tears down the old node and builds a new one (doesn't try to reuse).
  2. **`key` props tell React which items are stable** across renders. This is why lists
     need a stable, unique `key` — it lets React match old and new items instead of
     re-creating them.
- **Only the differences get committed** to the real DOM — unchanged nodes are left
  alone. This is what makes updates cheap.
- **Fiber** is the current reconciliation engine (React 16+). It lets React split
  rendering work into small units, **pause/resume/prioritize** it, so heavy updates
  don't block the browser. The older engine (the "stack reconciler") did all the work
  synchronously in one go.

> 📚 **Deep dive:** [react-fiber-architecture (acdlite)](https://github.com/acdlite/react-fiber-architecture)
> — an excellent explainer of how React's Fiber reconciler works under the hood.

---

## 6. JSX

Writing `React.createElement` by hand is tedious. **JSX** is a syntax extension that
lets you write HTML-like markup directly in JavaScript:

```jsx
const AnotherElement = (
  <a href="http://google.com" target="_blank">
    Click me to visit Google
  </a>
)
```

Behind the scenes, a compiler (Babel / the Vite React plugin) converts this JSX into
`React.createElement(...)` calls. **JSX is just syntactic sugar** — the browser never
sees JSX, only the compiled JavaScript.

### Embedding JavaScript in JSX with `{ }`
Use curly braces to drop any JavaScript **expression** into JSX. The expression is
**evaluated** and its result is rendered:

```jsx
function App() {
  const username = "Akshat"
  return (
    <>
      <h1>Hello, {username}!</h1>     {/* renders: Hello, Akshat! */}
      <h1>this is {2+2}</h1>          {/* renders: this is 4 */}
    </>
  )
}
```

- `{ }` accepts **expressions** (values, math, function calls, ternaries) — **not**
  statements like `if`/`for`.

### JSX Rules
1. **Return a single parent element.** A component can only return **one** root
   element. To return multiple elements, wrap them in a parent.
   - Historically you wrapped everything in a `<div>`.
   - Now you use a **Fragment** — an empty tag `<> ... </>` — which groups elements
     **without** adding an extra `<div>` to the DOM.
   ```jsx
   return (
     <>
       <h1>First</h1>
       <h1>Second</h1>
     </>
   )
   ```
2. **`className` instead of `class`** — because `class` is a reserved word in JS.
3. **camelCase for attributes/events** — `onClick`, `tabIndex`, `htmlFor`, etc.
4. **Tags must be closed** — even self-closing ones: `<img />`, `<br />`.

---

## 7. Rendering: createRoot & render

`main.jsx` is where React attaches to the page. In React 18+ (and 19), you use
`createRoot`:

```jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
```

- `createRoot(domNode)` — creates a React root tied to the `#root` div from
  `index.html`. This is where React will take over.
- `.render(<App />)` — tells React what to display inside that root. Here we render
  the `App` component.

You can render a component (`<App />`), a JSX element, or a `React.createElement`
result — but **not** a plain object.

### StrictMode
```jsx
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```
`<StrictMode>` is a development-only wrapper that helps catch potential problems
(deprecated APIs, unsafe side effects). It intentionally **double-invokes** some
functions in development to surface bugs. It has **no effect in production** and
renders nothing visible.

---

## 8. Components

A **component** is a reusable, self-contained piece of UI, written as a JavaScript
function that returns JSX.

```jsx
function App() {
  const username = "Akshat"
  return (
    <>
      <h1>Hello, {username}!</h1>
    </>
  )
}

export default App
```

- Use it like an HTML tag: `<App />`.
- **A component is exported** (`export default App`) so other files can import and use it.

### ⚠️ Component names MUST start with a Capital letter
This is a hard rule (especially with Vite/JSX):
- **Capitalized** (`App`, `MyApp`) → React treats it as a **component**.
- **lowercase** (`app`) → React treats it as a plain **HTML tag** and it won't work
  as your component.

> This matches the note that "the exported function names need to be in capital in
> Vite." Same idea applies to using them: `<App />` works, `<app />` does not.

There is a subtle related point from the `main.jsx` experiments:
- `areactElement` (lowercase variable created via `React.createElement`) **works**
  when rendered, because it is already a valid React element — the capital-letter rule
  is about **component functions**, not variables holding elements.

---

## 9. State & the useState Hook

Up to now components rendered **static** data. Real UIs change — a counter, a form,
a toggle. **State** is data that a component "remembers" between renders, and when it
changes, React **re-renders** the component to reflect the new value.

This section maps to the `2.Counter/` app.

### Why a normal variable does NOT work

```jsx
let counter = 0        // ❌ NOT state
const addValue = () => { counter = counter + 1 }
```
A plain variable *does* change in memory, but React has **no idea** it changed, so it
never re-renders — the UI stays stuck on the old value. React only re-renders when
**state** changes.

### The useState hook

```jsx
import { useState } from 'react'

function App() {
  const [counter, setCounter] = useState(0)  // [ value, setter ], initial value 0
  ...
}
```

`useState` returns an **array of two things** (we destructure them):
| Part | Name | Purpose |
|------|------|---------|
| `counter` | the **state variable** | the current value — read this to display it |
| `setCounter` | the **setter function** | the ONLY correct way to change the value |
| `useState(0)` | — | the argument is the **initial value** (used on first render only) |

**Rules of thumb:**
- Never reassign the state variable directly (`counter = 5` ❌). Always go through the
  setter (`setCounter(5)` ✅) so React knows to re-render.
- The naming convention is `[thing, setThing]`.
- When state updates, React re-renders the component and **every place** that uses the
  variable updates together — in the counter app, both `Counter Value : {counter}` and
  `Footer : {counter}` change at once. This shows the "UI = function of state" idea:
  one source of truth drives the whole view.

> **Hooks** are special functions that start with `use` and let function components
> "hook into" React features (state, lifecycle, etc.). `useState` is the first one.

---

## 10. Handling Events

React elements accept event handlers as **camelCase props** that take a function:

```jsx
<button onClick={addValue}>Add Value</button>
```

- `onClick` (camelCase) — not `onclick` like plain HTML.
- The value is a **function reference**, not a call: `onClick={addValue}` ✅,
  **not** `onClick={addValue()}` ❌ (the second one runs immediately on render).

### Inline arrow functions
When you need to pass an argument or run a small bit of logic, use an inline arrow:

```jsx
<button onClick={() => { setCounter(counter - 1) }}>Remove Value</button>
```
The arrow function wraps the code so it only runs **when clicked**, not during render.

---

## 11. Updating State: Batching & the Updater Function

This is the key lesson of the counter app. Look at `addValue`:

```jsx
const addValue = () => {
  setCounter(counter + 1)
  setCounter(counter + 1)
  setCounter(counter + 1)
  setCounter(counter + 1)   // expected +4... but the counter only goes up by 1
}
```

### Why it only adds 1 — batching
React **batches** multiple state updates that happen in the same event handler for
performance (it re-renders once, not four times). During this handler, `counter` is a
**snapshot** — it stays `0` for the whole function. So all four calls compute
`0 + 1 = 1`, and React applies the final `1`. Result: **+1, not +4.**

### The fix — pass an updater function
Instead of passing a value, pass a **function** that receives the latest pending state:

```jsx
const addValue = () => {
  setCounter((prevCounter) => prevCounter + 1)
  setCounter((prevCounter) => prevCounter + 1)   // now this really adds up
}
```
Here each call gets the **previous** value from React's queue rather than the stale
snapshot, so two calls give `+2`. Chain more for `+3`, `+4`, etc.

**Rule of thumb:** whenever the new state depends on the **old** state, use the
updater-function form `setX(prev => ...)`. It is always safe. Passing a raw value
(`setX(x + 1)`) is fine only for a single, standalone update.

| Form | Example | When to use |
|------|---------|-------------|
| Value | `setCounter(counter + 1)` | one update, not dependent on chained updates |
| Updater fn | `setCounter(prev => prev + 1)` | when new value depends on previous / multiple updates |

---

## 12. Props: Passing Data to Components

**Props** (short for *properties*) are how a parent component passes data **down** to a
child component. They make components **reusable** — the same component renders
different content depending on the props it receives. This section maps to the
`3.TailwindProps/` app (`App.jsx` + `components/Card.jsx`).

### Passing props (parent side)
You pass props like HTML attributes on the component tag:

```jsx
<Card username="Makime" animename="Chainsaw Man" />
<Card />   {/* no props passed — child will fall back to defaults */}
```

- **Strings** go in quotes: `username="Makime"`.
- **Anything else** (numbers, arrays, objects, expressions) goes in **curly braces**:
  ```jsx
  <Card username={["Makime", "Akaza"]} animename="Chainsaw Man" />   {/* array  */}
  <Card username={{ name: "Makime", age: 25 }} animename="Chainsaw Man" />   {/* object */}
  ```

### Receiving props (child side)
Every component automatically receives a single `props` object holding all the values:

```jsx
function Card(props) {
  return <span>{props.username}</span>   // access via props.<name>
}
```
For a passed array/object you'd read `props.username[0]` or `props.username.name`.

### Destructuring props + default values (preferred)
Instead of writing `props.` everywhere, destructure the props right in the parameter
list. You can also give each prop a **default value** used when the parent doesn't pass
one:

```jsx
function Card({ username = "Akaza", animename = "Kimetsu no Yaiba" }) {
  return (
    <>
      <span>{username}</span>
      <span>{animename}</span>
    </>
  )
}
```

- `<Card username="Makime" animename="Chainsaw Man" />` → shows *Makime / Chainsaw Man*.
- `<Card />` → falls back to defaults → *Akaza / Kimetsu no Yaiba*.

**Key points about props:**
- Props flow **one way**: parent → child (**"unidirectional data flow"**).
- Props are **read-only** — a child must **never** modify its own props. If data needs
  to change, that's what **state** is for (in the parent).
- Destructuring with defaults is the clean, common pattern.

---

## 13. Styling with Tailwind CSS (v4)

**Tailwind CSS** is a **utility-first** CSS framework: instead of writing custom CSS
classes, you compose small single-purpose classes directly in your JSX `className`.

```jsx
<h1 className="text-3xl font-bold bg-blue-500 text-white p-2">Vite with Tailwind</h1>
<div className="flex flex-col items-center p-7 rounded-2xl"> ... </div>
<img className="size-48 shadow-xl rounded-md" src="..." alt="" />
```

Each class does one thing:
| Class | Effect |
|-------|--------|
| `text-3xl` | font size | 
| `font-bold` | bold weight |
| `bg-blue-500` | blue background |
| `text-white` | white text |
| `p-2` / `p-7` | padding |
| `flex flex-col` | flexbox, column direction |
| `items-center` | center items on cross axis |
| `gap-2` | spacing between flex children |
| `rounded-2xl` / `rounded-md` | rounded corners |
| `size-48` | fixed width + height |
| `shadow-xl` | large drop shadow |

### Setup (Tailwind v4 + Vite)
This project uses **Tailwind v4**, which is much simpler than v3 (no `tailwind.config.js`
or PostCSS setup needed):

1. Install: `npm install tailwindcss @tailwindcss/vite`
2. Add the plugin in `vite.config.js`:
   ```js
   import tailwindcss from '@tailwindcss/vite'
   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```
3. Import Tailwind once in your CSS entry (`index.css`):
   ```css
   @import "tailwindcss";
   ```
   > In v4 this **single line** replaces the old `@tailwind base/components/utilities`
   > directives from v3.

**Why utility-first:** you style without leaving your JSX, class names are consistent,
and unused styles are stripped in the production build — so the shipped CSS stays small.

---

## 14. Inline Styles & Passing Arguments to Event Handlers

This section maps to the `4.BgChanger/` app — a page whose background color changes
when you click a button. It ties together **state**, **events**, and **inline styles**.

### Inline styles in JSX — the double curly braces

```jsx
<div className="w-full h-screen duration-200" style={{ backgroundColor: color }}>
```

- `style` in JSX takes a **JavaScript object**, not a CSS string.
- That's why you see **two** braces: the **outer** `{ }` embeds a JS expression into
  JSX, and the **inner** `{ }` is the object literal itself → `style={{ ... }}`.
- CSS property names are **camelCase**: `backgroundColor` (not `background-color`),
  `fontSize`, `marginTop`, etc.
- Values are strings/numbers: `{ backgroundColor: color }` uses the state variable, so
  the style is **driven by state** — change `color` and the div restyles automatically.

> `className` is for static classes (Tailwind here: `w-full h-screen duration-200`);
> `style` is handy for **dynamic** values coming from state/props.

### Driving styles from state
The whole app is "UI = function of state" again:

```jsx
const [color, setColor] = useState('olive')   // initial background
// ...
<div style={{ backgroundColor: color }}>      // reads the state
```
When `setColor(...)` runs, `color` changes → React re-renders → the inline style updates
→ the background changes. The Tailwind `duration-200` class makes it animate smoothly.

### Passing arguments to an event handler
`onClick` needs a **function reference**. To also pass an argument, wrap the call in an
**inline arrow function** so it runs only on click:

```jsx
<button onClick={() => handleColorChange('red')}>Red</button>   // ✅ arrow wrapper
```

- `onClick={handleColorChange('red')}` ❌ would call it **immediately** during render.
- `onClick={() => handleColorChange('red')}` ✅ defers it until the click, passing `'red'`.

You can call the setter directly or go through a handler — both appear in the app and
are equivalent:

```jsx
<button onClick={() => setColor('blue')}>Blue</button>              // direct
<button onClick={() => handleColorChange('green')}>Green</button>   // via handler
```
A named handler is useful when there's extra logic; calling the setter inline is fine
for a one-liner.

---

## 15. The useEffect Hook (Side Effects)

The next four sections all map to the `5.PasswordGenerator/` app, which brings three new
hooks together. This app also uses **all three** so it's a good place to see how they
cooperate.

A **side effect** is anything that reaches **outside** the pure "render UI from state"
job — timers, subscriptions, fetching data, manually touching the DOM, or (here)
**re-running logic when some state changes**. `useEffect` lets you run code *after*
render, in response to changes.

```jsx
useEffect(() => {
  generatePassword()          // effect: regenerate the password
}, [length, numberAllowed, charAllowed])   // dependency array
```

**The dependency array is the key part:**
| Dependency array | When the effect runs |
|------------------|----------------------|
| `[a, b]` | after the first render **and** whenever `a` or `b` changes |
| `[]` (empty) | **once**, after the first render only (mount) |
| *omitted* | after **every** render (rarely what you want) |

In the password app: whenever the user changes the **length**, or toggles **numbers**
or **special characters**, the effect fires and regenerates the password automatically —
no button press needed.

> **Cleanup (mentioned for later):** an effect can `return` a function that React runs
> before the next effect / on unmount — used to clear timers, remove listeners, etc.

---

## 16. The useCallback Hook (Memoizing Functions)

In JavaScript, a function defined inside a component is **re-created on every render** (a
brand-new function object each time). `useCallback` **memoizes** the function — it hands
back the **same** function instance between renders, and only rebuilds it when one of its
dependencies changes.

```jsx
const generatePassword = useCallback(() => {
  let pass = ""
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  if (numberAllowed) str += "0123456789"
  if (charAllowed)   str += "!@#$%^&*()_+"
  for (let i = 1; i < length; i++) {
    const char = Math.floor(Math.random() * str.length + 1)
    pass += str.charAt(char)
  }
  setPassword(pass)
}, [length, numberAllowed, charAllowed])   // deps: rebuild only if these change
```

- **Signature:** `useCallback(fn, [dependencies])`.
- **Why it matters here:** `generatePassword` is listed in `useEffect`'s logic and
  depends on `length`, `numberAllowed`, `charAllowed`. Memoizing keeps a stable
  reference and ensures the latest values are captured (the deps match the effect's).
- **When to use:** as an optimization — when a function is a dependency of another hook,
  or passed to memoized child components. Don't wrap every function; use it when a stable
  identity actually matters.

> Note the `for` loop starts at `i = 1`, so the generated password is `length - 1`
> characters — a small off-by-one worth being aware of.

---

## 17. The useRef Hook (Referencing DOM Nodes)

`useRef` gives you a **mutable container** (`{ current: ... }`) that **persists across
renders** and, unlike state, **does not trigger a re-render** when you change it. Its most
common use is getting a **direct reference to a DOM element**.

```jsx
const passwordRef = useRef(null)          // 1. create the ref
// ...
<input ref={passwordRef} value={password} readOnly />   // 2. attach via ref={}
// ...
const copyPasswordToClipboard = () => {
  window.navigator.clipboard.writeText(password)
  passwordRef.current?.select()           // 3. use the real DOM node
}
```

- `useRef(null)` creates the ref; React fills `.current` with the DOM node once it mounts.
- `ref={passwordRef}` wires the ref to the JSX element.
- `passwordRef.current` is then the actual `<input>` DOM node — here `.select()`
  highlights its text when you click **copy**.
- The `?.` (optional chaining) guards against `current` being `null`.

**useState vs useRef:** both persist values across renders, but changing **state**
re-renders the component, while changing a **ref** does **not**. Use a ref for values you
want to remember but that shouldn't drive the UI (like a DOM handle).

---

## 18. Controlled Inputs & Reading Form Values

An input is **controlled** when its value comes from React **state** — React is the
"single source of truth", not the DOM. You wire it with `value={state}` +
`onChange={...}`.

### Range slider (controlled)
```jsx
<input
  type="range" min={6} max={100}
  value={length}
  onChange={(e) => setLength(e.target.value)}
/>
<label>Length: {length}</label>
```
- `value={length}` binds the slider to state.
- `onChange` fires on every move; `e.target.value` is the new value → pushed into state.

### Checkboxes (toggling boolean state)
```jsx
<input
  type="checkbox"
  defaultChecked={numberAllowed}
  onChange={() => setNumberAllowed((prev) => !prev)}
/>
```
- For checkboxes the meaningful value is **checked**, so `onChange` flips the boolean
  with the updater form `setX(prev => !prev)` (depends on previous state → updater fn,
  from Section 11).

**Key idea:** the UI and the state stay in sync automatically. Changing any input updates
state → (via `useEffect`) regenerates the password → the read-only output field reflects
it. That's the whole app wired together: **state + effect + refs + controlled inputs**.

> **`value` + `readOnly`:** the output `<input>` uses `value={password} readOnly` so it
> displays state but can't be typed into. A controlled `value` without `onChange` needs
> `readOnly` to avoid a React warning.

---

## 19. Custom Hooks & Fetching Data from an API

Sections 19–23 map to the `6.CurrencyConverter/` app. This is the first project with a
**real folder structure** (`components/`, `hooks/`) and the first that talks to an **API**.

A **custom hook** is just a **normal JavaScript function whose name starts with `use`**
and that calls other hooks inside it. It's the way to **extract reusable stateful logic**
out of a component so the component stays focused on the UI.

### The custom hook — `hooks/useCurrencyInfo.js`

```js
import { useEffect, useState } from "react"

function useCurrencyInfo(currency) {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`)
      .then((res) => res.json())        // parse the JSON response
      .then((res) => setData(res[currency]))   // store just the rates object
  }, [currency])                        // re-fetch whenever the currency changes

  return data                           // hand the data back to the component
}

export default useCurrencyInfo
```

**What's happening:**
1. The hook owns its own `useState` — each component using it gets its **own** copy.
2. `useEffect` with `[currency]` fetches **on mount** and again **whenever `currency`
   changes** — so picking a different "from" currency automatically re-fetches rates.
3. `fetch()` returns a **Promise** → `.then(res => res.json())` parses the body →
   the second `.then` saves it to state.
4. The hook **returns** the data. Setting state inside the hook re-renders the component
   that uses it — this is normal hook behavior.

### Using it — one clean line in `App.jsx`
```jsx
const currencyInfo = useCurrencyInfo(from)   // all the fetching complexity is hidden
const options = Object.keys(currencyInfo)    // ["usd", "inr", "eur", ...] for the dropdown
```
`Object.keys()` turns the rates object (`{ inr: 83.2, eur: 0.92, ... }`) into an array of
currency codes to render in the `<select>`.

**Why custom hooks are great:**
- **Reusable** — any component can call `useCurrencyInfo(...)`.
- **Separation of concerns** — `App` renders UI; the hook handles data fetching.
- They can use `useState`, `useEffect`, and other hooks freely.
- **State is not shared** between components using the hook — each call is independent.

> **Initial state matters:** `useState({})` starts as an **empty object**, not `undefined`.
> The first render happens **before** the fetch finishes, so `Object.keys(currencyInfo)`
> must not blow up — an empty object safely gives `[]`. (A real app would also track
> `loading` / `error` states.)

> ⚠️ **`console.log(data)` inside the hook logs the *old* value.** State updates are
> asynchronous — `data` in that render is a snapshot, so the log always trails one render
> behind. It's not a bug in the data, just a common source of confusion when debugging.

### 🐛 Debugging story: the empty dropdown

The currency dropdown first rendered **completely empty**. Working backwards:
`options` was `[]` → so `Object.keys(currencyInfo)` had nothing → so `currencyInfo` was
still the initial `{}` → so **`setData` never ran** → so the **fetch failed**.

The cause: the API URL used in the course video is **dead**. The old
`.../gh/fawazahmed0/currency-api@1/latest/currencies/usd.json` endpoint now returns
**404** — that version of the API was retired. The working URL is:

```js
fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
```

**Lessons from this:**
- **APIs used in tutorials go stale.** If data never shows up, check the **Network tab**
  (or paste the URL in a browser) *before* suspecting your React code.
- **A failed `fetch` is silent by default.** `fetch` does **not** throw on a 404 — it
  resolves with `res.ok === false`. Here the 404 body was plain text, so `res.json()`
  rejected, and with no `.catch()` the error vanished as an unhandled promise rejection.
  Always add a `.catch()`:
  ```js
  fetch(url)
    .then((res) => res.json())
    .then((res) => setData(res[currency]))
    .catch((err) => console.error("Failed to fetch currency rates:", err))
  ```
- **An empty initial state hides failures.** `useState({})` meant the UI rendered an empty
  dropdown instead of crashing — safer, but it made the failure invisible. This is exactly
  why real apps track `loading` and `error` state alongside the data.

---

## 20. Rendering Lists with .map() & Keys

To render an array as UI, use JavaScript's **`.map()`** inside `{ }` to turn each item
into a JSX element:

```jsx
{currencyOptions.map((currency) => (
  <option key={currency} value={currency}>
    {currency}
  </option>
))}
```

- `.map()` is used (not `forEach`) because it **returns a new array** — of JSX elements —
  and React can render an array of elements.
- Wrap it in `{ }` since it's a JavaScript expression inside JSX.

### The `key` prop
**Every item in a list needs a unique `key`.** This is the same `key` from the diffing
section (Section 5): it lets React **match** items between the old and new virtual trees,
so it can reorder/update them instead of re-creating them.

- The key must be **unique among siblings** and **stable** across renders.
- Here `key={currency}` works because currency codes are unique.
- **Avoid the array index as a key** when the list can reorder, filter, or have items
  inserted/removed — it causes subtle bugs and wasted re-renders.
- Missing keys → React logs a *"Each child in a list should have a unique key"* warning.

---

## 21. The useId Hook

`useId` generates a **unique, stable ID string** — useful for wiring an input to its
label without hard-coding IDs that could collide when a component is reused.

```jsx
import { useId } from 'react'

function InputBox({ label, ... }) {
  const amountInputId = useId()
  return (
    <>
      <label htmlFor={amountInputId}>{label}</label>
      <input id={amountInputId} ... />
    </>
  )
}
```

- `htmlFor` + matching `id` links the label to the input (clicking the label focuses it —
  good accessibility).
- **Why not just `id="amount"`?** `InputBox` is rendered **twice** (From and To) — a
  hard-coded ID would be **duplicated** in the DOM, which is invalid. `useId` gives each
  instance its own ID automatically.
- The ID is **stable across re-renders** and safe with server rendering.

> **Not for list keys:** `useId` is for DOM IDs, not for the `key` prop in lists.

---

## 22. Forms: onSubmit & preventDefault

```jsx
<form
  onSubmit={(e) => {
    e.preventDefault();   // stop the browser's default page reload
    convert()
  }}
>
  ...
  <button type="submit">Convert {from.toUpperCase()} to {to.toUpperCase()}</button>
</form>
```

- A `<form>` submits when a **`type="submit"`** button inside it is clicked (or Enter is
  pressed in a field).
- **`e.preventDefault()` is essential.** By default the browser submits the form and
  **reloads the page**, which would wipe all React state. Preventing it keeps everything
  in JavaScript.
- `e` is React's **synthetic event** — a cross-browser wrapper around the native event
  with the same API (`preventDefault`, `target`, etc.).

### `type="button"` vs `type="submit"`
```jsx
<button type="button" onClick={swap}>swap</button>   // does NOT submit the form
```
Inside a `<form>`, a button **defaults to `type="submit"`**. The swap button explicitly
sets `type="button"` so clicking it runs `swap` **without** submitting the form — an easy
bug to hit if you forget it.

---

## 23. Callback Props & Barrel Exports

### Callback props — talking back to the parent
Props flow **down** (Section 12), so how does a child send data **up**? The parent passes
a **function** as a prop, and the child **calls** it:

```jsx
// Parent (App.jsx) — passes functions down
<InputBox
  label="From"
  amount={amount}
  currencyOptions={options}
  selectCurrency={from}
  onAmountChange={(amount) => setAmount(amount)}
  onCurrencyChange={(currency) => setFrom(currency)}
/>
```
```jsx
// Child (InputBox.jsx) — calls them when something changes
<input
  value={amount}
  onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
/>
<select
  value={selectCurrency}
  onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
>
```

- The child never modifies props — it just **reports** the change; the **parent owns the
  state** and decides what to do. This is **"lifting state up"**.
- `onAmountChange && onAmountChange(...)` guards against the prop not being passed
  (optional callback), so the child doesn't crash.
- `Number(e.target.value)` converts the input's **string** value to a number — input
  values are **always strings**, even for `type="number"`.

### Reusable component design
`InputBox` is a good example of a flexible component — defaults + toggles:
```jsx
function InputBox({
  label, amount, onAmountChange, onCurrencyChange,
  currencyOptions = [],        // default: empty list
  selectCurrency = "usd",
  amountDisable = false,       // flags to disable parts of the UI
  currencyDisable = false,
  className = "",              // let the parent add extra styling
}) {
```
- `amountDisable` is passed as a bare prop (`<InputBox amountDisable />`) — a JSX prop
  with **no value defaults to `true`**. That makes the "To" box read-only.
- Accepting a `className` prop and merging it with a template literal
  (`` className={`bg-white p-3 ... ${className}`} ``) lets the parent customize styles.

### Barrel exports — `components/index.js`
```js
import InputBox from './InputBox'
export { InputBox }
```
This "barrel" file re-exports components so imports get shorter and tidier:
```jsx
import { InputBox } from './components'          // ✅ with the barrel file
import InputBox from './components/InputBox'     // without it
```
With more components you'd add them to the same file and import several in one line.
Note the **named** import `{ InputBox }` here vs. the **default** import
`import useCurrencyInfo from './hooks/useCurrencyInfo'`.

> 🐛 **Bugs that were in this app** (fixed — but good debugging practice to understand):
> - The **"To"** `InputBox` had `selectCurrency={from}` — it should be `to`, so the
>   dropdown showed the wrong currency. **Copy-paste bugs like this are silent:** the prop
>   name is correct and it renders fine, it's just wired to the wrong state variable.
> - The **"From"** box's `onCurrencyChange={(currency) => setAmount(amount)}` ignored the
>   `currency` argument and re-set the amount to itself → changing the "From" dropdown did
>   **nothing**. Fixed to `setFrom(currency)`.

---

## 24. Rules of Hooks

Now that several hooks are in play, the rules that apply to **all** of them (including
custom ones):

1. **Only call hooks at the top level.** Never inside loops, conditions, or nested
   functions. React tracks hooks **by call order**, so the order must be identical on
   every render.
   ```jsx
   if (something) { const [x, setX] = useState(0) }   // ❌ breaks the order
   const [x, setX] = useState(0)                      // ✅ top level
   ```
2. **Only call hooks from React functions** — a component, or another custom hook. Not
   from plain JS functions or event handlers.
3. **Custom hook names must start with `use`.** This is how React (and the ESLint plugin)
   knows to apply these rules — `useCurrencyInfo` ✅, `currencyInfo` ❌.

> `eslint-plugin-react-hooks` (already in these projects' `package.json`) enforces rules
> 1 and 2 and warns about missing `useEffect` dependencies.

---

## 25. React Router: Setup & Routing

Sections 25–29 map to the `7.ReactRouter/` app. Until now every project was a **single
page**. **React Router** adds **client-side routing**: multiple URLs (`/`, `/about`,
`/github`) that swap components **without a full page reload** — keeping the SPA benefit
(Section 3) while having real, shareable, bookmarkable URLs.

It's **not** part of React — it's a separate library:
```bash
npm install react-router-dom
```

### Two ways to define routes
**Object syntax** — routes as a plain nested array:
```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: "",        element: <Home /> },
      { path: "about",   element: <About /> },
      { path: "contact", element: <Contact /> },
    ]
  }
])
```

**JSX syntax** — the same thing written as `<Route>` elements (what this app uses):
```jsx
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path=''             element={<Home />} />
      <Route path='about'        element={<About />} />
      <Route path='contact'      element={<Contact />} />
      <Route path='user/:userid' element={<User />} />
      <Route path='github' element={<Github />} loader={githubInfoLoader} />
    </Route>
  )
)
```
`createRoutesFromElements` converts the JSX tree into that same object array — **pick
whichever you find readable**, they're identical in behavior.

### Wiring it up in `main.jsx`
```jsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```
- `createBrowserRouter(...)` builds the router (uses the browser's History API for clean
  URLs — no `#`).
- `<RouterProvider router={router} />` renders whatever matches the current URL.

**Note the structural shift:** `main.jsx` now renders `<RouterProvider />` **instead of**
`<App />`. The router is the new root — `App.jsx` is left over from the Vite template and
is **no longer used** in this project.

### Nested routes: how paths combine
Child paths are **relative** and append to the parent:
| `<Route>` | Resulting URL |
|-----------|---------------|
| parent `path='/'` | `/` |
| child `path=''` (**index**) | `/` — the default child, shown at the parent's exact path |
| child `path='about'` | `/about` |
| child `path='user/:userid'` | `/user/akshat` |

Child paths **don't** start with `/` — a leading slash makes the path absolute and breaks
nesting.

> **Migration note:** this project was scaffolded with older versions (React 18, Vite 4,
> **Tailwind v3**) and was upgraded to match projects 3–6 (React 19, Vite 8, **Tailwind
> v4**). Moving Tailwind v3 → v4 meant: deleting `tailwind.config.js` and
> `postcss.config.js`, replacing the three `@tailwind base/components/utilities`
> directives in `index.css` with the single `@import "tailwindcss";`, and adding the
> `@tailwindcss/vite` plugin (Section 13). The **utility classes didn't change** — only
> the configuration. React Router was also bumped to **v7**, since v6 predates React 19;
> the imports and APIs in this app are unchanged between v6 and v7.

---

## 26. Layouts & the Outlet

Most sites keep a **header and footer** on every page and swap only the middle. That's a
**layout route**: a parent route whose element renders the shared shell.

```jsx
// Layout.jsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Header />
      <Outlet />     {/* ← the matched child route renders HERE */}
      <Footer />
    </>
  )
}
```

- `<Outlet />` is a **placeholder** for the child route's element.
- Navigate to `/about` → the router renders `<Layout />`, and `<Outlet />` becomes
  `<About />`. Header and Footer **stay mounted** and don't re-render from scratch.
- This is why routes are nested: `<Route path='/' element={<Layout />}>` wraps all the
  children.

**Mental model:** `Outlet` is to routing what `children` is to a normal wrapper component
— a hole for content decided by the router.

---

## 27. Navigation: Link & NavLink

### Never use `<a>` for internal links
```jsx
<a href="/about">About</a>          {/* ❌ full page reload — kills the SPA */}
<Link to="/about">About</Link>      {/* ✅ client-side, instant, keeps state */}
```
A plain `<a>` makes the browser **request a new document**, reloading the whole app and
wiping React state. `Link` intercepts the click and just swaps components.

- Note the prop is **`to`**, not `href`.
- Use `<a>` only for **external** URLs.

### NavLink — a Link that knows if it's active
`NavLink` is `Link` plus awareness of whether its route is currently active — perfect for
highlighting the current nav item:

```jsx
<NavLink
  to="/about"
  className={({ isActive }) =>
    `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} hover:text-orange-700`
  }
>
  About
</NavLink>
```

- `className` can be a **function** receiving `{ isActive }` and returning the class
  string. (`style` accepts a function too.)
- Here the active link turns **orange**; inactive links stay gray.
- `NavLink` also adds an `active` class automatically if you pass a plain string.

> **Gotcha:** `to="#"` (used by the Log in / Get started buttons here) is a placeholder —
> it doesn't navigate anywhere. Fine as a stub, but swap in real routes later.

---

## 28. Dynamic Routes & useParams

A **dynamic segment** is a placeholder in the path, written with a **colon**:

```jsx
<Route path='user/:userid' element={<User />} />
```
This one route matches `/user/akshat`, `/user/123`, `/user/anything` — and captures that
segment as **`userid`**.

Read it with the **`useParams`** hook:
```jsx
import { useParams } from 'react-router-dom'

function User() {
  const { userid } = useParams()      // key matches the :userid in the route
  return <div>User: {userid}</div>
}
```
- `useParams()` returns an **object** of all URL params → destructure it.
- The key **must match** the route's segment name exactly: `:userid` → `params.userid`.
- Visiting `/user/akshat` renders *"User: akshat"*.

This is how detail pages work — one component serves every user/product/post, with the
URL supplying the id.

> There's no `<Link>` to this route in the Header, so reach it by typing
> `/user/<anything>` in the address bar.

---

## 29. Loaders & useLoaderData

React Router can fetch data **before** the component renders, replacing the
`useEffect` + `useState` fetch pattern from Section 19.

### The old way (commented out in `Github.jsx`)
```jsx
const [data, setData] = useState([])
useEffect(() => {
  fetch('https://api.github.com/users/Akshats-git')
    .then(response => response.json())
    .then(data => setData(data))
}, [])
```
This renders **first** with empty data, *then* fetches, *then* re-renders — a visible
flash of empty UI.

### The loader way
```jsx
// 1. Export a loader — a plain async function that returns data
export const githubInfoLoader = async () => {
  const response = await fetch('https://api.github.com/users/Akshats-git')
  return response.json()
}
```
```jsx
// 2. Attach it to the route (main.jsx)
<Route loader={githubInfoLoader} path='github' element={<Github />} />
```
```jsx
// 3. Read it in the component — no useState, no useEffect
import { useLoaderData } from 'react-router-dom'

function Github() {
  const data = useLoaderData()
  return (
    <div>
      Github followers: {data.followers}
      <img src={data.avatar_url} alt="Git picture" width={300} />
    </div>
  )
}
```

**Why loaders are better:**
- The router **waits** for the loader to resolve before rendering — the component always
  has its data, so **no empty-state flash** and no loading flicker.
- Fetching starts **as soon as navigation begins**, not after render — it's faster.
- The component gets **simpler**: no `useState`, no `useEffect`, no loading state.
- `async/await` here instead of `.then()` chains — cleaner for sequential steps.

> Note `Github.jsx` has **two exports**: `export default Github` (the component) and
> `export const githubInfoLoader` (a named export). That's why `main.jsx` imports it as
> `import Github, { githubInfoLoader } from './components/Github/Github.jsx'` — default
> and named in one line (Section 23).

> ⚠️ The GitHub API allows only **60 unauthenticated requests per hour** per IP. If the
> avatar/follower count stops appearing, you may be **rate-limited** — check the Network
> tab for a **403** (the same "check the network first" lesson from Section 19).

---

## 30. Prop Drilling: The Problem Context Solves

Sections 30–33 map to the `8.MiniContext/` app. (Like project 7, it was scaffolded on
React 18 / Vite 4 / ESLint 8 and upgraded to **React 19 / Vite 8 / flat ESLint config** to
match the rest of the repo — no code changes were needed, the Context API is identical.)

Props flow **one level at a time**: parent → child (Section 12). But what if a deeply
nested component needs data from the top? You'd have to pass it through **every**
component in between:

```jsx
<App user={user}>                    // owns the state
  <Layout user={user}>               // doesn't use it — just passing through
    <Sidebar user={user}>            // doesn't use it either
      <Profile user={user} />        // ← finally, the one that needs it
```

This is **prop drilling** — and it's painful:
- Middle components receive props they **don't care about**, just to hand them down.
- Adding one new value means **editing every layer**.
- Components become **hard to reuse** — they're coupled to props they never use.

**Context** solves this: put the data in **one place** and let any component **reach in
and grab it directly**, no matter how deep — skipping every layer in between.

> **Not a replacement for props.** Props are still the right default for parent → child.
> Reach for Context only for **"global"** data that many components at different depths
> need: the logged-in user, a theme, a language setting.

---

## 31. The Context API

Context has **three pieces**: create it, provide it, consume it.

### 1. Create the context — `context/UserContext.js`
```js
import React from 'react'

const UserContext = React.createContext()

export default UserContext
```
`createContext()` makes a context object. Think of it as an empty **box** that data will
be put into. (Plain `.js` — no JSX here.)

### 2. Provide the value — `context/UserContextProvider.jsx`
```jsx
import React from "react"
import UserContext from "./UserContext"

const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null)   // the state lives HERE

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
```
- Every context has a **`.Provider`** component. Anything rendered **inside** it can read
  the context.
- The **`value`** prop is what gets shared. Here it's an object holding **both** the state
  and its setter — so children can **read** `user` *and* **change** it via `setUser`.
- Note the **double braces**: `value={{ user, setUser }}` — outer `{}` = JSX expression,
  inner `{}` = the object literal (same idea as inline styles, Section 14).
- The state lives in the **provider**, which is why every consumer sees the same value.

**Why a separate provider component?** `createContext` and the state could live in one
file, but splitting them keeps the context object importable anywhere without dragging
the state logic along. This "provider component" pattern is very common.

### 3. Wrap the app — `App.jsx`
```jsx
function App() {
  return (
    <UserContextProvider>       {/* everything inside can access the context */}
      <h1>React with Chai and share is important</h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}
```
Components **outside** the provider **cannot** see the context — the provider defines the
scope.

### 4. Consume with `useContext`
```jsx
// Login.jsx — writes to the context
import React, { useState, useContext } from 'react'
import UserContext from '../context/UserContext'

function Login() {
  const [username, setUsername] = useState('')   // local state — only Login needs it
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)    // pull the setter out of context

  const handleSubmit = (e) => {
    e.preventDefault()
    setUser({ username, password })              // push to the shared context
  }
  ...
}
```
```jsx
// Profile.jsx — reads from the context
function Profile() {
  const { user } = useContext(UserContext)       // pull the value out of context
  if (!user) return <div>please login</div>
  return <div>Welcome {user.username}</div>
}
```

- `useContext(UserContext)` returns whatever the nearest provider passed as `value` —
  destructure just the part you need.
- **`Login` and `Profile` are siblings and never talk to each other.** `Login` calls
  `setUser` → the provider's state changes → **every** consumer re-renders → `Profile`
  shows the new user. No props were passed between them at all. **That's the payoff.**

### Note the split: local vs shared state
`username`/`password` stay as **local `useState`** in `Login` — only that component cares
about the in-progress typing. Only the **submitted** user goes into context. Don't put
everything in context; keep state as local as it can be.

> **The three steps, summarized:** `createContext()` → wrap in `<X.Provider value={...}>`
> → read with `useContext(X)`.

> **Modern syntax:** React 19 lets you render the context directly as `<UserContext
> value={...}>` instead of `<UserContext.Provider value={...}>`. `.Provider` still works
> and is what you'll see in most code and tutorials.

---

## 32. The children Prop

`children` is a **special, automatic prop**: whatever you nest **inside** a component's
tags is passed to it as `children`.

```jsx
const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={{ user, setUser }}>
    {children}                 {/* ← renders whatever was nested inside */}
  </UserContext.Provider>
)
```
```jsx
<UserContextProvider>
  <h1>React with Chai...</h1>   {/* ─┐                       */}
  <Login />                     {/*  ├─ all of this is `children` */}
  <Profile />                   {/* ─┘                       */}
</UserContextProvider>
```

- You don't declare or pass `children` — React fills it in automatically.
- It makes **wrapper components** possible: providers, layouts, modals, cards — any
  component that adds behavior around content it doesn't know about in advance.
- Same idea as React Router's `<Outlet />` (Section 26): a hole for content decided
  elsewhere. `children` is filled by the **parent**; `Outlet` is filled by the **router**.

---

## 33. Conditional Rendering

Showing different UI depending on state. `Profile` uses the **early return**:

```jsx
function Profile() {
  const { user } = useContext(UserContext)

  if (!user) return <div>please login</div>    // guard clause — bail out early
  return <div>Welcome {user.username}</div>
}
```
`user` starts as `null` (`useState(null)`), so this renders *"please login"* until a login
happens. The early return is the cleanest option when one branch is a simple fallback —
and it doubles as a **guard**: the line below is only reached when `user` exists, so
`user.username` can't crash.

### The other common patterns
```jsx
{user && <div>Welcome {user.username}</div>}                   // && — render or nothing
{user ? <Profile /> : <Login />}                               // ternary — either/or
```
- **`&&`** — renders the right side only if the left is truthy. Good for "show it or
  don't".
- **Ternary** — picks between two elements. The only way to do an inline if/else in JSX,
  since `{ }` takes **expressions**, not `if` statements (Section 6).

> ⚠️ **The `&&` number gotcha:** `{items.length && <List />}` renders a literal **`0`** on
> screen when the array is empty — `0` is falsy, and React renders it. Use
> `{items.length > 0 && <List />}` to force a real boolean.

---

## 34. Context, Refined: Default Values & a Custom Hook

Sections 34–36 map to the `9.ThemeSwitcher/` app. It's **Context again** (Section 31), but
written the way you'd write it in a real project. Compare the two — same feature, better
ergonomics.

### The whole context in one file — `contexts/theme.js`
```js
import { createContext, useContext } from "react"

// 1. Create the context WITH a default shape
export const ThemeContext = createContext({
    themeMode: "light",
    darkTheme: () => {},
    lightTheme: () => {},
})

// 2. Re-export the Provider under a friendlier name
export const ThemeProvider = ThemeContext.Provider

// 3. A custom hook so consumers never touch useContext directly
export default function useTheme() {
    return useContext(ThemeContext)
}
```

### Three upgrades over project 8

**1. `createContext(defaultValue)` — a default shape.**
Project 8 used bare `createContext()`, so the value is `undefined` if a component isn't
wrapped in a provider — meaning `const { user } = useContext(...)` **crashes**. Passing a
default gives a safe fallback and, just as usefully, **documents the context's shape**:
you can read this file and instantly see what's inside. The empty functions (`() => {}`)
are **no-op placeholders** — real implementations come from the provider.

**2. `export const ThemeProvider = ThemeContext.Provider`.**
A small alias so `App` writes `<ThemeProvider value={...}>` instead of
`<ThemeContext.Provider value={...}>`. Note this exports the Provider **directly** — there's
no wrapper component like project 8's `UserContextProvider`, so **the state lives in
`App`** instead of inside a provider component. Both patterns are valid.

**3. `useTheme()` — a custom hook wrapping `useContext`.** ⭐
This is the big one, and it combines Section 19 (custom hooks) with Section 31 (context):

```jsx
// Without the custom hook (project 8's style) — every consumer needs 2 imports:
import { useContext } from 'react'
import ThemeContext from '../contexts/theme'
const { themeMode } = useContext(ThemeContext)

// With the custom hook — one import, no useContext in sight:
import useTheme from '../contexts/theme'
const { themeMode, lightTheme, darkTheme } = useTheme()
```
- Consumers **don't need to know** the context object even exists.
- If the implementation changes later, you edit **one file**, not every consumer.
- It's a legal custom hook because it starts with `use` and calls a hook (Section 24).

**This is the standard, production pattern:** context + provider + a `useX()` hook,
all in one file.

### Functions in the context value, not the setter
```jsx
// App.jsx — state lives here
const [themeMode, setThemeMode] = useState("light")

const lightTheme = () => setThemeMode("light")
const darkTheme  = () => setThemeMode("dark")

<ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
```
Project 8 shared the raw setter (`setUser`); here `App` shares **named action functions**
instead. Consumers call `darkTheme()` — expressing **intent** — rather than
`setThemeMode("dark")` and needing to know the valid string values. It's a cleaner API and
keeps the state's shape private.

---

## 35. Side Effects on the DOM (Dark Mode)

React owns the `#root` div — but the `<html>` element is **outside** it. To toggle a class
there, you reach for the DOM directly, and that's a **side effect** → `useEffect`
(Section 15):

```jsx
useEffect(() => {
  document.querySelector('html').classList.remove("light", "dark")
  document.querySelector('html').classList.add(themeMode)
}, [themeMode])
```

- **Runs on mount and whenever `themeMode` changes** — thanks to the `[themeMode]` dep.
- **`remove` before `add`** matters: without it the classes would pile up
  (`class="light dark"`) and the last one wouldn't reliably win. Clean up, then apply.
- This is a **legitimate** use of direct DOM manipulation. React can't render `<html>`, so
  an effect is exactly the right escape hatch.

**The full data flow, end to end:**
```
click toggle → onChangeBtn → darkTheme() → setThemeMode("dark")
  → App re-renders → useEffect fires (themeMode changed)
  → <html class="dark"> → every `dark:` Tailwind class activates
```
State drives a DOM class, and CSS does the rest — no component needs to know about styling.

---

## 36. Tailwind Dark Mode & the peer Pattern

### Class-based dark mode
```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",     // ← toggle dark mode via a CSS class, not the OS setting
  ...
}
```
- **`darkMode: "class"`** tells Tailwind that `dark:` variants apply when a **`.dark`
  class** is present on an ancestor (here, `<html>`).
- The default is `"media"`, which follows the **OS** setting (`prefers-color-scheme`) and
  **can't be toggled by the user** — which is why this app overrides it.
- Then any `dark:` prefixed class activates automatically:
  ```jsx
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  ```
  Two states, one element, zero JavaScript.

### The controlled toggle
```jsx
const { themeMode, lightTheme, darkTheme } = useTheme()

const onChangeBtn = (e) => {
    const darkModeStatus = e.currentTarget.checked
    if (darkModeStatus) darkTheme()
    else lightTheme()
}

<input type="checkbox" className="sr-only peer"
       onChange={onChangeBtn}
       checked={themeMode === "dark"} />
```
- **`checked={themeMode === "dark"}`** — a controlled input (Section 18) whose state comes
  from **context**, converting the theme string into the checkbox's boolean.
- **`e.currentTarget.checked`** reads the new checked state. (`currentTarget` is the
  element the handler is attached to; `target` is what was actually clicked — they differ
  when the click lands on a child.)

### `sr-only` + `peer` — styling a custom switch
The real checkbox is **hidden but still functional**, and a `<div>` is styled to look like
a switch:
- **`sr-only`** hides it visually while keeping it in the accessibility tree — screen
  readers and keyboards still work. (Better than `hidden`, which removes it entirely.)
- **`peer`** marks it as a sibling that other elements can react to. The next div then uses
  **`peer-checked:`** and **`peer-focus:`** to restyle itself based on the checkbox's
  state:
  ```jsx
  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600
                  after:h-5 after:w-5 peer-checked:after:translate-x-full ..." />
  ```
  `after:` styles the CSS `::after` pseudo-element (the sliding knob), and
  `peer-checked:after:translate-x-full` slides it right when checked.
- Wrapping both in a `<label>` makes clicking anywhere on the switch toggle the checkbox.

**Takeaway:** a native checkbox provides the behavior and accessibility for free; CSS
makes it look like anything you want.

> **Tailwind v4 note:** `darkMode: "class"` is **v3** config. v4 drops `tailwind.config.js`
> (Section 13) and declares this in CSS instead:
> ```css
> @import "tailwindcss";
> @custom-variant dark (&:where(.dark, .dark *));
> ```
> The `dark:` classes in your JSX stay exactly the same.

---

## 37. Rules & Gotchas (Quick Reference)

| Rule | Detail |
|------|--------|
| One root per component | Wrap multiple elements in `<>...</>` (Fragment) or a parent tag. |
| Fragments | `<></>` groups elements without adding an extra DOM node. |
| Component names | Must be **Capitalized** so React treats them as components (required in Vite). |
| `{ }` in JSX | Holds **expressions** only (not `if`/`for` statements). Result gets rendered. |
| `className` | Use instead of `class` in JSX. |
| Plain objects don't render | Must be React elements — use `React.createElement()` or JSX. |
| Entry point | `index.html` → `main.jsx` → `createRoot('#root').render(<App />)`. |
| SPA | The whole app lives inside one `#root` div in a single HTML page. |
| JSX is sugar | Compiles down to `React.createElement()` calls. |
| State, not variables | UI only updates when **state** changes; use `useState`, never a plain variable. |
| Update via setter | Change state with `setX(...)`, never by reassigning the variable. |
| Events are camelCase | `onClick={fn}` — pass a reference, not `onClick={fn()}`. |
| Batching | Multiple `setX(value)` in one handler use a stale snapshot → applied once. |
| Updater function | Use `setX(prev => ...)` when new state depends on the old value. |
| Props are read-only | A child must never modify its props; data flows parent → child. |
| Passing props | Strings use quotes; arrays/objects/expressions use `{ }`. |
| Prop defaults | Destructure with defaults: `function Card({ name = "..." })`. |
| Tailwind classes | Utility-first styling via `className`; v4 needs only `@import "tailwindcss";`. |
| Inline styles | `style={{ camelCaseProp: value }}` — an object, double braces, camelCase keys. |
| Dynamic vs static styles | `style` for state/prop-driven values; `className` for static classes. |
| Args to handlers | Wrap in an arrow: `onClick={() => fn(arg)}`, never `onClick={fn(arg)}`. |
| `useEffect` | Runs code after render; `[deps]` control when — `[]` = once on mount. |
| `useCallback` | Memoizes a function so its identity is stable across renders; `useCallback(fn, [deps])`. |
| `useRef` | Persistent `{ current }` box that survives renders **without** re-rendering; used for DOM refs. |
| ref → DOM | `const r = useRef(null)` → `ref={r}` → use `r.current` (guard with `?.`). |
| Controlled input | `value={state}` + `onChange` — React state is the source of truth. |
| `value` + `readOnly` | A controlled `value` with no `onChange` needs `readOnly` to silence React's warning. |
| Custom hooks | A `use`-prefixed function that calls hooks; extracts reusable stateful logic. |
| Rules of Hooks | Top level only (never in loops/conditions), only from React functions, name starts with `use`. |
| Lists | Render arrays with `.map()`; needs a unique, stable `key` — avoid the index. |
| `useId` | Unique DOM ids for label/input pairs when a component is reused. Not for list keys. |
| Forms | `onSubmit` + **`e.preventDefault()`** or the page reloads and state is lost. |
| Button type | Buttons in a form default to `type="submit"`; use `type="button"` to avoid submitting. |
| Lifting state up | Child calls a callback prop (`onChange`-style); the **parent** owns the state. |
| Input values | Always strings — convert with `Number(e.target.value)` when you need a number. |
| Bare prop = true | `<InputBox amountDisable />` is the same as `amountDisable={true}`. |
| Barrel exports | `components/index.js` re-exports so you can `import { X } from './components'`. |
| Async state | State updates aren't instant — `console.log` right after a setter shows the **old** value. |
| `fetch` + 404 | `fetch` does **not** throw on 404 — always add `.catch()` or errors disappear silently. |
| Empty data? | Check the Network tab first — tutorial API URLs go stale (this app's did). |
| Router setup | `createBrowserRouter(...)` + `<RouterProvider router={router} />` in `main.jsx`. |
| Nested paths | Child paths are **relative** — no leading `/`, or nesting breaks. |
| `<Outlet />` | Placeholder in a layout where the matched child route renders. |
| Never `<a>` internally | Use `<Link to="...">` — an `<a>` reloads the page and wipes state. |
| `NavLink` | `Link` + `isActive`; `className` can be a function: `({isActive}) => ...`. |
| Dynamic routes | `path='user/:userid'` → read with `const { userid } = useParams()`. |
| Loaders | `loader={fn}` on a route + `useLoaderData()` — data ready **before** render, no flash. |
| Prop drilling | Passing props through layers that don't use them — what Context fixes. |
| Context (3 steps) | `createContext()` → `<X.Provider value={...}>` → `useContext(X)`. |
| Provider scope | Only components **inside** the provider can read the context. |
| Share state + setter | `value={{ user, setUser }}` lets consumers both read and update. |
| Keep state local | Only put genuinely shared data in context (not in-progress form input). |
| `children` | Automatic prop holding whatever is nested inside a component's tags. |
| Conditional render | Early return, `cond && <X />`, or `cond ? <A /> : <B />`. |
| `&&` renders `0` | `{arr.length && <X/>}` prints `0` — use `{arr.length > 0 && <X/>}`. |
| Context default | `createContext({...})` documents the shape + avoids `undefined` crashes. |
| `useX()` wrapper | Wrap `useContext` in a custom hook — consumers import one thing, not two. |
| Share actions | Expose `darkTheme()` rather than `setThemeMode` — intent, not implementation. |
| DOM outside `#root` | `<html>`/`<body>` need `useEffect` + `classList` — a valid escape hatch. |
| Class hygiene | `classList.remove(...)` **then** `add(...)`, or classes pile up. |
| Tailwind dark mode | v3: `darkMode: "class"`; v4: `@custom-variant dark (&:where(.dark, .dark *));`. |
| `sr-only` + `peer` | Hide a real input accessibly; style a sibling with `peer-checked:`. |
| `currentTarget` | The element the handler is on; `target` is what was clicked. |

---

*More sections will be appended as the course continues (useMemo, useReducer,
Redux Toolkit, memo, etc.).*
