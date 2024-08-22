document.addEventListener('alpine:init', () => {
    Alpine.data('wordGame', () => ({
        sentence: '',
        longestWord: '',
        shortestWord: '',
        sum: 0,
        analyzeSentence() {
            fetch(`/api/word_game?sentence=${this.sentence}`)
                .then(res => res.json())
                .then(data => {
                    this.longestWord = data.longestWord;
                    this.shortestWord = data.shortestWord;
                    this.sum = data.sum;
                });
        }
    }));

    Alpine.data('phoneBill', () => ({
        billString: '',
        totalCost: '',
        callPrice: 2.75,
        smsPrice: 0.65,
        fetchTotalBill() {
            fetch('/api/phonebill/total', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bill: this.billString })
            })
                .then(res => res.json())
                .then(data => {
                    this.totalCost = data.total;
                });
        },
        updatePrices(type, price) {
            fetch('/api/phonebill/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, price })
            })
                .then(res => res.json())
                .then(data => {
                    if (type === 'call') this.callPrice = price;
                    if (type === 'sms') this.smsPrice = price;
                });
        }
    }));

    Alpine.data('enoughAirtime', () => ({
        usage: '',
        available: '',
        remaining: '',
        checkAirtime() {
            fetch('/api/enough', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usage: this.usage, available: this.available })
            })
                .then(res => res.json())
                .then(data => {
                    this.remaining = data.result;
                });
        }
    }));
});
