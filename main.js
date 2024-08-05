// 1. Deposit some money.
// 2. The number of lines to bet on.
// 3. The bet amount.
// 4. Spin the slot machine.
// 5. Check if the user won.
// 6. Give or take away the user's money.
// 7. Play again.

const prompt = require("prompt-sync")()
const ROWS = 3
const COLS = 3
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}
// If the player gets a line of a particular
// symbol, the bet will be multiplied by the
// number of points defined for that symbol.
const SYMBOLS_POINTS = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposit = () => {
    while (true) {
        const depositAmount = parseFloat(prompt("Enter a deposit amount: "))
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log("Invalid deposit amount. Try again.")
        } else {
            return depositAmount
        }
    }
}

const getNumberOfLines = () => {
    while (true) {
        const numOfLines = parseFloat(prompt("How many lines do you want to bet on (1-3)? "))
        if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
            console.log("Invalid number of lines. Try again.")
        } else {
            return numOfLines
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = parseFloat(prompt("How much do you want to bet (per line)? "))
        if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
            console.log("Invalid bat. Try again.")
        } else {
            return bet
        }
    }
}

const spin = () => {
    // All symbols of a single reel (vertically).
    // The program will pick a random symbol and
    // remove it from a copy of this array for
    // each row of a column.
    const symbols = [];
    for ([symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol)
        }
    }
    // Stores the resulting reels after the spin.
    const resultingReels = []
    for (let i = 0; i < COLS; i++) {
        resultingReels.push([])
        const symbolsRemained = [...symbols]  // Copy the 'symbols' array.
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * symbolsRemained.length)
            const selectedReel = symbolsRemained[randomIndex]
            resultingReels[i].push(selectedReel)
            symbolsRemained.splice(randomIndex, 1)
        }
    }
    return resultingReels
}

const transpose = (reels) => {
    const transposed = []
    for (let i = 0; i < ROWS; i++) {
        transposed.push([])
        for (let j = 0; j < COLS; j++) {
            transposed[i].push(reels[j][i])
        }
    }
    return transposed
}

const printReels = (reels) => {
    for (const row of reels) {
        let lineToPrint = ""
        for (const [i, sym] of row.entries()) {
            lineToPrint += sym
            if (i != row.length - 1) {
                lineToPrint += " | "
            }
        }
        console.log(lineToPrint)
    }
}

const getWinnings = (reels, bet, lines) => {
    let winnings = 0
    for (let rowno = 0; rowno < lines; rowno++) {
        const row = reels[rowno]
        let allAreSame = true
        for (const symbol of row) {
            if (symbol != row[0]) {
                allAreSame = false
                break
            }
        }
        if (allAreSame) {
            winnings += bet * SYMBOLS_POINTS[row[0]]
        }
    }
    return winnings
}

const game = () => {
    let balance = deposit()
    while (true) {
        console.log("You have a balance of $" + balance.toString())
        const numOfLines = getNumberOfLines()
        const bet = getBet(balance, numOfLines)
        balance -= bet * numOfLines
        let reels = spin()
        reels = transpose(reels)
        printReels(reels)
        const winnings = getWinnings(reels, bet, numOfLines)
        balance += winnings
        console.log("You won $" + winnings.toString())
        if (balance == 0) {
            console.log("You ran out of money!")
            break
        }
        const playAgain = prompt("Do you want to play again? ")
        if (playAgain != "y") break
    }
}

game()
