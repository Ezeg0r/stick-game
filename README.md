# 🥢 Stick Game: AI-Powered Combinatorial Game Solver

[![Play Online]](https://ezeg0r.github.io/stick-game/)

A high-performance web application designed to solve and visualize a mathematical "Stick Game" (a variant of Nim). The project combines advanced **Game Theory algorithms** (implemented in C++) with a modern **React/TypeScript** frontend.

## 🎮 The Game Rules
There are $N$ sticks arranged in a row. Two players take turns taking sticks according to specific rules. The player who cannot make a move loses (Normal Play convention).

I have implemented 3 distinct game modes based on different algorithmic constraints:

### 1. Standard Mode
* **Rules:** Players can take between $1$ and $K$ (or range $[A, B]$) of **any** sticks, regardless of their position.
* **Algorithm:** Dynamic Programming (DP).
* **Logic:** Since position doesn't matter, the state is defined simply by the count of remaining sticks. The AI calculates the winning move on the fly using $O(N)$ DP or memoization.

### 2. Consecutive Mode
* **Rules:** Players can take a range of sticks, but they must be **consecutive** (a solid block without gaps).
* **Algorithm:** **Sprague-Grundy Theorem**.
* **Logic:**
    * The game decomposes into independent subgames (groups of adjacent sticks).
    * The state of the game is the XOR sum ($\oplus$) of the Grundy numbers (Nim-values) of these subgames.
    * The AI calculates the `Mex` (Minimum Excluded value) for each state to determine the optimal move.
    * **Complexity:** Efficient enough for real-time calculation in the browser.

### 3. Special Mode (The Hardest Challenge)
* **Rules:** A hybrid variant where a player can take:
    * 3 consecutive sticks, OR
    * 1 stick from anywhere, OR
    * 2 sticks from anywhere (even from different groups).
* **The Challenge:** The ability to pick "2 arbitrary sticks" breaks the independence of subgames, rendering the Sprague-Grundy theorem inapplicable. The state space is complex due to the combination of positional and count-based moves.
* **Solution:** **Offline Pre-computation (C++ -> Web)**.
    * I analyzed the state space and determined that while raw states are huge ($2^{50}$), reachable unique configurations are manageable (~240,000 states for $N=50$).
    * I wrote a highly optimized **C++ solver** using recursion and map-compression to traverse all states.
    * The results were compiled into a **7MB lookup table**.
    * The web app loads this data to provide an **instant O(1) optimal response** against the user, making the AI unbeatable in this mode.

## 🛠 Tech Stack

* **Frontend:** TypeScript, React (Custom hooks for game logic).
* **Algorithms:** C++ (for pre-computing heavy states), JavaScript (for real-time DP/XOR logic).
* **Deployment:** GitHub Pages.

## ✨ Key Features

* **Interactive UI:** Click-to-select sticks with validation of legal moves.
* **State Persistence:** The app remembers your last game settings.
* **"Emotional" AI:** The computer reacts to the state of the game:
    * 😐 **Neutral:** Calculations pending or equal position.
    * 😎 **Confident:** The AI has found a winning strategy (you are in a losing position).
    * 🤔 **Thinking/Worried:** The AI is in a losing position (this is your chance to win!).
