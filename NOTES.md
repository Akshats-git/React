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
9. [Rules & Gotchas (Quick Reference)](#9-rules--gotchas-quick-reference)

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

## 9. Rules & Gotchas (Quick Reference)

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

---

*More sections will be appended as the course continues (props, hooks like useState
& useEffect, events, conditional rendering, lists & keys, etc.).*
