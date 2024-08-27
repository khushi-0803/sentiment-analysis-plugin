// Function to extract headlines and send them for analysis
function extractHeadlines() {
    let headlines = [];
    const headlineTags = [
        'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',             // Standalone headline tags
        'h1 a', 'h2 a', 'h3 a', 'h4 a', 'h5 a', 'h6 a', // Headlines within <a> tags
        'figcaption', 'a.headline', 'a.title', 'a.news-link', 'a.story' // Specific <a> tags with headline classes
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

    // Initialize counters
    let positiveCount = 0;
    let negativeCount = 0;
 
    // Count the number of positive and negative sentiments
    sentiments.forEach((sentiment) => {
        if (sentiment.sentiment === 'positive') {
            positiveCount++;
        } else if (sentiment.sentiment === 'negative') {
            negativeCount++;
        }
    });

    // Calculate the percentages
    const totalCount = positiveCount + negativeCount;
    const positivePercentage = (positiveCount / totalCount) * 100;
    const negativePercentage = (negativeCount / totalCount) * 100;

    // Log the percentages
    console.log(`Positive: ${positivePercentage.toFixed(2)}%, Negative: ${negativePercentage.toFixed(2)}%`);

    window.headlineElements.forEach((item) => {
        const sentiment = sentiments.find(s => s.headline === item.text);
        if (sentiment) {
            item.element.style.color = sentiment.sentiment === 'positive' ? 'green' : 'red';
        }
        else {
            console.log('No sentiment found for headline: ${item.text}');
        }
    });

    // Display the percentages on the page or in the popup
    displaySentimentPercentages(positivePercentage, negativePercentage);
}

// Function to display the sentiment percentages
function displaySentimentPercentages(positivePercentage, negativePercentage) {
    // Create or select an element to display the percentages
    let percentageElement = document.getElementById('sentiment-percentages');
    
    if (!percentageElement) {
        percentageElement = document.createElement('div');
        percentageElement.id = 'sentiment-percentages';
        percentageElement.style.position = 'fixed';
        percentageElement.style.bottom = '10px';
        percentageElement.style.right = '10px';
        percentageElement.style.backgroundColor = 'white';
        percentageElement.style.border = '1px solid black';
        percentageElement.style.padding = '10px';
        percentageElement.style.zIndex = '1000';
        document.body.appendChild(percentageElement);
    }

    // Update the content with the calculated percentages
    percentageElement.innerHTML = `
        <strong>Sentiment Analysis Results:</strong><br>
        Positive: ${positivePercentage.toFixed(2)}%<br>
        Negative: ${negativePercentage.toFixed(2)}%
    `;
}

