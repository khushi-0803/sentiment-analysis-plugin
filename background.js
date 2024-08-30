chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'headlines') {
        console.log('Headlines:', message.headlines);
        fetch('http://127.0.0.1:5000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ headlines: message.headlines }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sentiment analysis response', data);
            // Make sure there is an active tab before sending the message
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'sentiments', sentiments: data });
                } else {
                    console.error("No active tab found.");
                }
            });
        })
        .catch(error => console.error('Error:', error));
    }
});
