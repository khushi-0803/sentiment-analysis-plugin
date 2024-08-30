document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the button
    document.getElementById('analyze-button').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'analyze' });
        });
    });
    

    // Retrieve and display headlines with sentiments
    chrome.storage.local.get('headlines',function(result) {
        console.log('Headlines with sentiments retrieved in popup:', result);
        const headlines = result.headlines || [];
        if (headlines.length > 0) {
            const list = document.getElementById('headline-list');
            list.innerHTML = '';  // Clear previous entries if any
            headlines.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.headline} - Sentiment: ${item.sentiment}`;
                list.appendChild(li);
            });
        } else {
            console.log('No headlines found or data retrieval failed.');
        }

    });
});
