# 🏙️ City Empire — India Edition

A Monopoly-style board game built with React, set in India.

## Features

- 🗺️ Full 40-tile Indian board (Mumbai, Delhi, Bengaluru, etc.)
- 🤖 AI players that auto-play (vs Human or full AI match)
- 🏆 Last player standing wins (bankruptcy system)
- 🏠 Houses & Hotels with even-building rule
- 🔒 Mortgage system (10% interest to unmortgage)
- 🔨 Auction when property is declined
- 🃏 Chance & Community Chest cards
- ⛓️ Jail system (3-turn rule)
- 💸 Income Tax: ₹200 flat or 10% of net worth

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
city-empire/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root component
    ├── data/
    │   ├── tiles.js                    # Board tiles, colors, grid positions
    │   └── cards.js                    # Chance & Community Chest cards
    ├── utils/
    │   └── gameHelpers.js              # Game logic (pure functions)
    └── components/
        ├── CityEmpire.jsx              # Main game + state management
        ├── Board.jsx                   # Board grid + tiles
        ├── Dice.jsx                    # Dice display
        ├── AuctionPanel.jsx            # Auction bidding UI
        ├── TaxChoicePanel.jsx          # Income tax choice UI
        ├── PropertyManager.jsx         # Build/sell/mortgage UI
        ├── SetupScreen.jsx             # Game setup screen
        └── WinnerScreen.jsx            # Winner / game over screen
```

## How to Play

1. Choose 2–4 players
2. Toggle 👤 Human / 🤖 AI for each player
3. Click **Start Game**
4. Human players click buttons; AI players move automatically
5. Go bankrupt → eliminated. Last one standing = **Winner** 🏆
