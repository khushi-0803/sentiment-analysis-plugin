document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the button
    document.getElementById('analyze-button').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'analyze' });
        });
    });
    

    // // Retrieve and display headlines with sentiments
    // chrome.storage.local.get('headlines',function(result) {
    //     console.log('Headlines with sentiments retrieved in popup:', result);
    //     const headlines = result.headlines || [];
    //     const list = document.getElementById('headline-list');
    //     // list.innerHTML = '';
    //     headlines.forEach(item => {
    //         const li = document.createElement('li');
    //         li.textContent = '${item.headline} - Sentiment: ${item.sentiment}';
    //         list.appendChild(li);
    //     });


    // });
});