# react-top-progress

![npm version](https://img.shields.io/npm/v/react-top-progress)
![downloads](https://img.shields.io/npm/dw/react-top-progress)
![license](https://img.shields.io/npm/l/react-top-progress)

**<a href="https://react-test-progress.vercel.app/" target="_blank">👉 View Live Demo</a>**

A lightweight, modern, and performant top loading progress bar for React. Built for seamless user experiences with **zero dependencies**!

Perfect for Next.js App Router, Vite, and standard SPA architectures.

## 🚀 Why react-top-progress?

- **SSR & App Router Safe**: Fully compatible with Next.js SSR & App Router natively
- **Framework Agnostic**: Works perfectly in React, Vite, CRA, Remix, React Router
- **0 Dependencies**: No weird transitive bloat
- **📦 Tiny Bundle Size**: ~1.9kb gzipped (Tree-shakable)
- **Premium Aesthetics**: Smooth realistic loading animation with beautiful gradients & glows
- **Promise Integrations**: Auto-wrapping utilities like `withProgress` for API fetching

## Installation

```bash
npm install react-top-progress
```

## Quick Start (Next.js / Vite / React)

### Method 1: The Global Provider (Recommended)

This approach automatically provides all routing configurations and is incredibly clean.

```jsx
import { ProgressProvider, useAutoProgress } from "react-top-progress";

export default function RootLayout({ children }) {
  // Use generic auto-route progress detector or just trigger global effects
  // Optional but recommended for easy routing coverage!

  return (
    <ProgressProvider color="#29D" height={3} shadow={true}>
      {children}
    </ProgressProvider>
  );
}
```

### Method 2: Next.js App Router Generic Auto-Routing

Because Next.js App Router removed native router events, you can quickly auto-wire progress with the `useRouteProgress` hook, which intrinsically detects all link navigation globally using zero-external dependencies!

```jsx
"use client";

import { TopProgress, useRouteProgress } from "react-top-progress";

export default function Layout({ children }) {
  useRouteProgress(); // Auto-detects clicks, routing events, and history pushState!

  return (
    <>
      <TopProgress
        height={4}
        color="linear-gradient(90deg, #ff5500, #ff0080)"
      />
      {/* Your Top Nav, Sidebar, etc. */}
      {children}
    </>
  );
}
```

## Built-in Methods

You can trigger the loader from anywhere in your codebase by importing the functions globally, or via a React `ref` assigned to `<TopProgress ref={myRef} />`.

| Method                                          | Parameters                 | Description                                                                                                          |
| ----------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `start(loaderType?)`                            | `"continuous" \| "static"` | Starts the loading indicator. Default is continuous.                                                                 |
| `continuousStart(startingValue?, refreshRate?)` | `number`, `number`         | Starts with a random value (20-30), then slowly ticks up (2-10) repetitively. Reaches max 90%.                       |
| `staticStart(startingValue?)`                   | `number`                   | Starts the loader with a random static value between 30-50, waiting for completion.                                  |
| `complete()` / `finishProgress()`               |                            | Instantly pushes the indicator to 100% and gracefully fades it out.                                                  |
| `resetProgress()`                               |                            | Instantly zeroes out and hides the progress bar without fading.                                                      |
| `increase(value)`                               | `number`                   | Manually increments the loader by a specific amount.                                                                 |
| `decrease(value)`                               | `number`                   | Manually decrements the loader by a specific amount.                                                                 |
| `setProgress(value)`                            | `number`                   | Hardsets to a specific progress percentage.                                                                          |
| `getProgress()`                                 |                            | Returns the current progress percentage (0 - 100).                                                                   |
| `withProgress(promise)`                         | `Promise<T>`               | Wraps an asynchronous action. `startProgress()` executes automatically before and completes automatically afterward. |

### Promise Wrapper Example

```jsx
import { withProgress } from "react-top-progress";

const data = await withProgress(fetch("/api/users"));
```

## Component Properties

You can customize `<TopProgress />` passing any of the following props:

| Property             | Type            | Default                          | Description                                                                                       |
| -------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `progress`           | `number`        |                                  | Hardset the progress (0-100) if you want to bypass the internal store and control state yourself. |
| `color`              | `string`        | `"#29D"`                         | Background color of the bar. Accepts `linear-gradient(...)` or hex codes.                         |
| `height`             | `number`        | `3`                              | Height of the progress bar in pixels.                                                             |
| `shadow`             | `boolean`       | `true`                           | Appends a glorious trailing drop-glow peg matching the bar's color tracking its head.             |
| `background`         | `string`        | `"transparent"`                  | Fills the container div's background layer under the progress element.                            |
| `transitionSpeed`    | `number`        | `200`                            | Fade transition time (ms) for the fade-out completion sequence.                                   |
| `loaderSpeed`        | `number`        | `500`                            | Loader width transition speed (ms).                                                               |
| `waitingTime`        | `number`        | `1000`                           | The delay time (ms) loader waits at 100% width before fading entirely out.                        |
| `easing`             | `string`        | `"cubic-bezier(0.4, 0, 0.2, 1)"` | Customizable CSS animation timing path curve.                                                     |
| `style`              | `CSSProperties` |                                  | Inject custom JSX styles directly onto the loader element.                                        |
| `className`          | `string`        |                                  | Apply a specific custom CSS class to the loader element.                                          |
| `containerStyle`     | `CSSProperties` |                                  | Configure inline styles for the fixed `<div />` wrapper container.                                |
| `containerClassName` | `string`        |                                  | Custom CSS class applied onto the wrapper container.                                              |
| `onLoaderFinished`   | `() => void`    |                                  | A callback function executing precisely when the loader fully hits 100% max width.                |

## Compared to Alternatives

Developers need to know why to switch. Here is the breakdown:

| Library                 | Dependencies           | SSR Safe | Routing Bindings  | Promise Wrap | Bundle Size       |
| ----------------------- | ---------------------- | -------- | ----------------- | ------------ | ----------------- |
| `nprogress`             | Old jQuery style logic | No       | ❌                | ❌           | Larger            |
| `nextjs-toploader`      | Next-specific only     | Yes      | ✅ (Next.js)      | ❌           | Medium            |
| `react-top-loading-bar` | React mostly           | Some     | ❌                | ❌           | Medium            |
| **react-top-progress**  | **0 dependencies**     | **Yes**  | **✅ (Agnostic)** | **✅**       | **Tiny (~1.9kb)** |

## Credits

Designed for the modern web. Inspired by the classic `nprogress` and Next.js' `nextjs-toploader`. Ideal when you need explicit control without relying solely on framework routing events.

Built with ❤️ by **[Harry Mate](https://github.com/harrymate22)**.
🌟 If you find this library helpful, consider dropping a **Star** on GitHub and **[following me (@harrymate22)](https://github.com/harrymate22)** for more open-source tools!

## License

MIT © [harrymate22](https://github.com/harrymate22)
