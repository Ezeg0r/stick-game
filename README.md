# Stick Game 🎮

A web-based interactive implementation of **Combinatorial Game Theory** concepts. This project demonstrates various algorithmic approaches to solving mathematical games, ranging from Dynamic Programming to Sprague-Grundy theorem applications and large-scale state pre-computation.

[**Play the Game**](https://ezeg0r.github.io/stick-game/)

---

## 🧠 Algorithmic Core (Game Modes)

The game features three distinct difficulty modes, each requiring a different algorithmic strategy to solve.

### 1. Standard Mode (Classic DP)
**Rules:** Players take a allowed number of sticks from a single pile.
* **Algorithm:** Classic **Dynamic Programming**.
* **Logic:** The state is defined by the number of remaining sticks ($N$). We calculate `dp[i]` (win/loss) based on possible transitions.
* **Complexity:** $O(N \cdot K)$, calculated on-the-fly in the browser.
* **Feature:** Added stochasticity to the bot's moves to make the game less predictable for human players.

### 2. Consecutive Mode (Sprague-Grundy Theorem)
**Rules:** Players can take sticks only if they are adjacent (consecutive).
* **Analysis:** The game breaks down into independent sub-games (groups of consecutive sticks). This classifies it as an **Impartial Game**.
* **Algorithm:** **Sprague-Grundy Theorem**.
* **Logic:**
    1.  Treat groups of sticks as independent games.
    2.  Compute the **Grundy numbers (Mex)** for each group size.
    3.  The state of the entire game is the **XOR sum** of the Grundy numbers of all groups.
    4.  The bot searches for a move that makes the total XOR sum zero (a losing position for the opponent).
* **Performance:** $O(N^3)$ worst-case, efficiently handled in the browser.



### 3. Special Mode (Pre-computed State Space)
**Rules:** Players can remove specific patterns of sticks (e.g., 2 sticks separated by a gap).
* **The Challenge:** Moves can split groups or merge them in complex ways, violating the independence of sub-games. Standard Sprague-Grundy logic does not apply.
* **Solution:** **Exhaustive State Space Search** with Memoization.
* **Engineering Optimization:**
    * The state space was too large for real-time JavaScript calculation.
    * I implemented a high-performance **C++ solver** to traverse the recursion tree and solve all ~240,000 game states.
    * **Pre-computation:** The C++ script generates a **Lookup Table** (approx. 7MB).
    * **Deployment:** The web app loads this pre-computed solution map, allowing for **O(1)** instant move retrieval in the browser.

---

## 🛠 Tech Stack

* **Frontend:** React, TypeScript
* **Algorithms:** C++ (for offline pre-computation), TypeScript (for real-time logic)
* **Deployment:** GitHub Pages

## ✨ Key Features

* **Interactive UI:** Visual representation of game states with intuitive controls.
* **AI Personality:** The computer reacts to the game state:
    * 😐 Neutral: State is undecided or bot moves second.
    * 😎 Confident: The bot found a winning strategy (you are in a losing position).
    * 🤔 Puzzled: The bot is in a losing position (you found the optimal move).
* **State Persistence:** Remembers user preferences and last played mode using LocalStorage.
* **Rule Validation:** Real-time checking of move validity.

---
*Developed by [Yahor Yasinski](https://github.com/Ezeg0r). Open for feedback and contributions.*
