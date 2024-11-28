// Trigger message_ai when Enter key is pressed
document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission if applicable
        const inputValue = e.target.value.trim(); // Remove extra spaces
        message_ai(inputValue);
    }
});

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
        const response = getResponse(input);

        // Use innerHTML to render the HTML content returned by getResponse
        aiMessageElement.innerHTML = response;
    }, 3000);
}


// Function to determine the response based on the input
function getResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('sales report')) {
        return `
            <div>
                <p>Here is the detailed Sales Report:</p>
                <ul>
                    <li>Total Sales: 10,000</li>
                    <li>Top Region: North America</li>
                    <li>Growth Rate: 12%</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('inventory report')) {
        return `
            <div>
                <p>Here is the latest Inventory Report:</p>
                <ul>
                    <li>Stock Items: 500</li>
                    <li>Out of Stock: 20</li>
                    <li>Pending Orders: 15</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('top product report')) {
        return `
            <div>
                <p>The top product report is as follows:</p>
                <ul>
                    <li>Top Product: SuperWidget</li>
                    <li>Units Sold: 1,000</li>
                    <li>Revenue: 25,000</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('daily sales')) {
        return `
            <div>
                <p>Today’s sales performance is:</p>
                <ul>
                    <li>Total Sales: 1,200</li>
                    <li>Online Sales: 800</li>
                    <li>In-Store Sales: 400</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('monthly')) {
        return `
            <div>
                <p>Here is the monthly report overview:</p>
                <ul>
                    <li>Total Revenue: 50,000</li>
                    <li>New Customers: 300</li>
                    <li>Growth Rate: 8%</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('yearly')) {
        return `
            <div>
                <p>Here is the annual performance summary:</p>
                <ul>
                    <li>Total Revenue: 600,000</li>
                    <li>New Customers: 3,600</li>
                    <li>Year-over-Year Growth: 15%</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('most bought product')) {
        return `
            <div>
                <p>The most bought product is:</p>
                <ul>
                    <li>Product: MegaWidget</li>
                    <li>Units Sold: 5,000</li>
                    <li>Revenue: 125,000</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('least bought product')) {
        return `
            <div>
                <p>The least bought product is:</p>
                <ul>
                    <li>Product: BasicWidget</li>
                    <li>Units Sold: 50</li>
                    <li>Revenue: 500</li>
                </ul>
            </div>`;
    } else if (lowerInput.includes('hello')) {
        return `
            <div>
                <p>Thanks for messaging me. What do you want me to do for you?</p>
                <p class="p-0 mt-5 text-muted" style="font-size: 12px;">Try this prompt:</p>
                <div>
                    <button onclick="message_ai('Sales Report')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Sales Report</button>
                    <button onclick="message_ai('Inventory Report')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Inventory Report</button>
                    <button onclick="message_ai('Top product Report')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Top product Report</button>
                    <button onclick="message_ai('Daily Sales')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Daily Sales</button>
                    <button onclick="message_ai('Monthly')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Monthly</button>
                    <button onclick="message_ai('Yearly')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Yearly</button>
                    <button onclick="message_ai('Most Bought Product')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Most Bought Product</button>
                    <button onclick="message_ai('Least Bought Product')" class="btn btn-sm border text-muted rounded-3 mt-1" style="font-size: 12px;">Least Bought Product</button>
                </div>
            </div>`;
    } else {
        return `
            <div>
                <p>I'm sorry, I don't have information about "<strong>{input}</strong>".</p>
            </div>`;
    }
}

