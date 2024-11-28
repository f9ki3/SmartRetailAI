function message_ai(input) {
    // Hide default message
    document.getElementById('default').classList.add('d-none');
    
    // Show loading state
    const loadingBot = document.getElementById('loading_bot');
    const aiResponse = document.getElementById('ai_response');
    loadingBot.classList.remove('d-none');
    aiResponse.classList.add('d-none');
    
    // Simulate a delay of 3 seconds
    setTimeout(() => {
        // Hide loading state
        loadingBot.classList.add('d-none');
        
        // Show AI response
        aiResponse.classList.remove('d-none');
        
        // Display the message in `ai_message`
        const aiMessageElement = document.getElementById('ai_message');
        if (input === 'Sales Report') {
            aiMessageElement.innerText = 'Here is the detailed Sales Report.';
        } else if (input === 'Inventory Report') {
            aiMessageElement.innerText = 'Here is the latest Inventory Report.';
        } else if (input === 'Top product Report') {
            aiMessageElement.innerText = 'The top product report is as follows...';
        } else if (input === 'Daily Sales') {
            aiMessageElement.innerText = 'Today’s sales performance is...';
        } else if (input === 'Monthly') {
            aiMessageElement.innerText = 'Here is the monthly report overview.';
        } else if (input === 'Yearly') {
            aiMessageElement.innerText = 'Here is the annual performance summary.';
        } else if (input === 'Most Bought Product') {
            aiMessageElement.innerText = 'The most bought product is...';
        } else if (input === 'Least Bought Product') {
            aiMessageElement.innerText = 'The least bought product is...';
        } else {
            aiMessageElement.innerText = `I'm sorry, I don't have information about "${input}".`;
        }
    }, 3000);
}