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
19. [Rules & Gotchas (Quick Reference)](#19-rules--gotchas-quick-reference)

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

## 19. Rules & Gotchas (Quick Reference)

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

---

*More sections will be appended as the course continues (custom hooks, useMemo,
Context API, conditional rendering, lists & keys, React Router, etc.).*
