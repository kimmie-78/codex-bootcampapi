import express from "express";

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Wordgame functions
function longestWord(sentence) {
    let words = sentence.split(' ');
    let longest = '';
    for (let word of words) {
        if (word.length >= longest.length) {
            longest = word;
        }
    }
    return longest;
}

function shortestWord(sentence) {
    let words = sentence.split(' ');
    let shortest = words[0];
    for (let word of words) {
        if (word.length <= shortest.length) {
            shortest = word;
        }
    }
    return shortest;
}

function wordLengths(sentence) {
    return sentence.split(' ').reduce((sum, word) => sum + word.length, 0);
}

// Word Game API
app.get('/api/word_game', (req, res) => {
    const sentence = req.query.sentence || '';
    res.json({
        longestWord: longestWord(sentence).length,
        shortestWord: shortestWord(sentence),
        sum: wordLengths(sentence)
    });
});

// Phone Bill functions
let callPrice = 2.75;
let smsPrice = 0.65;

function totalPhoneBill(bill) {
    const items = bill.split(',');
    const totalCost = items.reduce((total, item) => {
        return item === 'call' ? total + callPrice : total + smsPrice;
    }, 0);
    return `R${totalCost.toFixed(2)}`;
}

app.post('/api/phonebill/total', (req, res) => {
    const { bill } = req.body;
    res.json({ total: totalPhoneBill(bill) });
});

app.get('/api/phonebill/prices', (req, res) => {
    res.json({ call: callPrice, sms: smsPrice });
});

app.post('/api/phonebill/price', (req, res) => {
    const { type, price } = req.body;
    if (type === 'call') {
        callPrice = price;
    } else if (type === 'sms') {
        smsPrice = price;
    }
    res.json({ status: 'success', message: `The ${type} price was set to R${price}` });
});

// Enough Airtime functions
function enoughAirtime(projectedUsage, availableAirtime) {
    const callRate = 1.88;
    const dataRate = 12;
    const smsRate = 0.75;

    const items = projectedUsage.split(',');
    const totalCost = items.reduce((total, item) => {
        switch (item) {
            case 'call':
                return total + callRate;
            case 'data':
                return total + dataRate;
            case 'sms':
                return total + smsRate;
            default:
                return total;
        }
    }, 0);

    const remainingAirtime = availableAirtime - totalCost;
    return remainingAirtime > 0 ? `R${remainingAirtime.toFixed(2)}` : 'R0.00';
}

app.post('/api/enough', (req, res) => {
    const { usage, available } = req.body;
    res.json({ result: enoughAirtime(usage, available) });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
