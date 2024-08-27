chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'analyze') {
        extractHeadlines();}
    else if (message.type === 'sentiments') {
        applySentimentStyles(message.sentiments);}
    else if (message.type === 'headlines') {
        console.log('Received headlines:', message.headlines);
        
        // Log before making the API call
        console.log('Attempting to call the API for sentiment analysis...');

        fetch('http://127.0.0.1:5000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ headlines: message.headlines }),
        })
        .then(response => {
            // Check if the response status is OK (200-299)
            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }
            console.log('API call successful, processing response...');
            return response.json();
        })
        .catch(err => {
            // This catch will capture errors like network failures or invalid JSON response
            console.error('Failed to fetch:', err.message);
            throw err; // Re-throw the error to be caught by the final catch block
        })
        .then(data => {
            console.log('Sentiment analysis response:', data);
            chrome.storage.local.clear(() => {
                chrome.storage.local.set({ headlines: data }, () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, { type: 'sentiments', sentiments: data });
                        } else {
                            console.error("No active tab found.");
                        }
                    });
                });
            });
        })
        .catch(error => {
            // Final catch block to handle any errors in the promise chain
            console.error('An error occurred in the process:', error.message);
        });
    }
});
