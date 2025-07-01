# WebSonic System Analysis

This document provides a comprehensive analysis of the WebSonic project, a web-based, live-coding music environment.

## Project Structure

The project is a monorepo composed of two main parts:

1.  **`engine/`**: A Node.js package that contains the core logic for music synthesis and sequencing.
2.  **`websonic/`**: A Svelte-based web application that provides the user interface.

A `screenshot/` directory is also present, containing a PNG image of the application's UI.

---

## `engine/` Directory

The `engine/` directory is a self-contained Node.js package responsible for all audio-related tasks. It uses `isomorphic-web-audio-api` to ensure compatibility between the browser and Node.js environments.

### Key Files and their Functions

-   **`package.json`**: Defines the package's dependencies, including `isomorphic-web-audio-api`.
-   **`src/index.js`**: The main entry point for the engine, exporting all of its public functions. It also manages the `live_loop` functionality for concurrent musical patterns.
-   **`src/audio.js`**: The core of the engine, this file handles audio synthesis, including:
    -   **Synths**: `play()` function for generating sounds with oscillators (sine, square, sawtooth, triangle).
    -   **Samples**: `sample()` function for playing pre-defined drum samples (kick, snare, hat).
    -   **Effects**: `with_fx()` function for applying effects like reverb and delay.
    -   **Global Controls**: `setMasterVolume()` and `use_bpm()` for controlling the master volume and tempo.
-   **`src/collections.js`**: Provides data structures for creating musical patterns, such as `ring` (a circular array) and `tick` (a counter for the ring).
-   **`src/random.js`**: A set of utility functions for generating random numbers and shuffling arrays, useful for algorithmic composition.
-   **`src/getContext.js`**: A module that manages the `AudioContext`, ensuring a single instance is used throughout the application.
-   **`tests/`**: Contains tests for the engine's functionality.

---

## `websonic/` Directory

The `websonic/` directory contains the user-facing web application, built with Svelte and Vite.

### Key Files and their Functions

-   **`package.json`**: Defines the project's dependencies, including `svelte`, `vite`, and `websonic-engine` (via a local path).
-   **`vite.config.js`**: The configuration file for the Vite development server.
-   **`svelte.config.js`**: The configuration file for the Svelte compiler.
-   **`src/main.js`**: The entry point for the Svelte application.
-   **`src/App.svelte`**: The main component of the application, which includes:
    -   A **CodeMirror** editor for writing music code.
    -   **Controls** for running and stopping the code, and adjusting the volume.
    -   A **Console** for displaying logs and errors.
    -   A **sandboxed environment** for executing the user's code, providing access to the `websonic-engine` functions.
-   **`src/components/Console.svelte`**: A component that displays log messages from the running code.
-   **`src/components/Resizer.svelte`**: A component that allows the user to resize the console.

---

## Data Flow and Architecture

1.  The user writes code in the CodeMirror editor in the `websonic/` application.
2.  When the "Run" button is clicked, the code is executed within a sandboxed environment in `App.svelte`.
3.  The sandboxed environment provides the user's code with access to the functions from the `websonic-engine` package.
4.  The `websonic-engine` functions use the Web Audio API to generate and manipulate audio.
5.  The `live_loop` function in the engine allows for the creation of concurrent musical patterns that can be started and stopped from the UI.
6.  The `Console.svelte` component displays logs and errors from the executed code, providing feedback to the user.

This architecture effectively separates the user interface from the core audio processing logic, making the project modular and easier to maintain.
