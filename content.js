// Function to extract headlines and send them for analysis
function extractHeadlines() {
    let headlines = [];
    const headlineTags = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'h1 a', 'h2 a', 'h3 a', 'h4 a', 'h5 a', 'h6 a',
        'figcaption', 'a.headline', 'a.title', 'a.news-link', 'a.story',
    ];

    headlineTags.forEach(tag => {
        const elements = document.querySelectorAll(tag);
        console.log(`Selector: ${tag}, Elements found: ${elements.length}`);
        elements.forEach(element => {
            const headline = element.innerText.trim();
            const wordCount = headline.split(/\s+/).length;
            if (wordCount > 3) {
                headlines.push({ text: headline, element: element });
            }
        });
    });

    console.log('Extracted headlines:', headlines.map(h => h.text));
    window.headlineElements = headlines;
    chrome.runtime.sendMessage({ type: 'headlines', headlines: headlines.map(h => h.text) });
}

// Function to apply sentiment styles to headlines
function applySentimentStyles(sentiments) {
    console.log('Applying sentiments:', sentiments);
    window.headlineElements.forEach((item) => {
        const sentiment = sentiments.find(s => s.headline === item.text);
        if (sentiment) {
            item.element.style.color = sentiment.sentiment === 'positive' ? 'green' : 'red';
        }
    });
}

// Handle messages from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'analyze') {
        extractHeadlines();
    } else if (message.type === 'sentiments') {
        applySentimentStyles(message.sentiments);
    }

    const positivePercentageElement = document.getElementById('positive-percentage');
    const negativePercentageElement = document.getElementById('negative-percentage');
    if (positivePercentageElement && negativePercentageElement) {
            positivePercentageElement.textContent = `Positive: ${message.percentages.positive}%`;
            negativePercentageElement.textContent = `Negative: ${message.percentages.negative}%`;
    }
});

// // Function to find percentage of positive and negative headlines
// function calculateSentimentPercentages(sentiments) {
//     const total = sentiments.length;
//     if (total === 0) {
//         return { positive: 0, negative: 0 };
//     }

//     const counts = sentiments.reduce((acc, sentiment) => {
//         if (sentiment.sentiment === 'positive') {
//             acc.positive += 1;
//         } else if (sentiment.sentiment === 'negative') {
//             acc.negative += 1;
//         }
//         return acc;
//     }, { positive: 0, negative: 0 });

//     const positivePercentage = (counts.positive / total) * 100;
//     const negativePercentage = (counts.negative / total) * 100;

//     return { positive: positivePercentage.toFixed(2), negative: negativePercentage.toFixed(2) };
// }
