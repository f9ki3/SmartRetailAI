// Trigger message_ai when Enter key is pressed
document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission if applicable
        const inputValue = e.target.value.trim(); // Remove extra spaces
        message_ai(inputValue);
    }
});

function clear_message() {
    $('#ai_response').addClass('d-none');
    $('#default').removeClass('d-none');
}

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
        // Add placeholder for daily sales and charts
        const chatDailyHTML = `
            <div id="chat_daily">Fetching daily sales...</div>
            <div id="dailySales"></div> <!-- Placeholder for daily sales chart -->
        `;
        
        // Perform the AJAX request to get data
        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extract and format today's sales
                const todaySales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_today);
                const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                
                // Display today's sales with date
                $('#chat_daily').html(`The sales for today, ${todayDate}, are <b>${todaySales}</b>.`);
                
                // Daily sales data for chart
                const dailySales = response.daily_sales;
                const daily_timestamps = dailySales.map(sale => sale[0]);
                const daily_data = dailySales.map(sale => sale[1]);
                
                var optionsDailySales = {
                    series: [{ name: 'Daily Sales', data: daily_data }],
                    chart: { height: 300, type: 'area' },
                    colors: ['#FFC107'], // Amber for daily sales
                    dataLabels: { enabled: false },
                    stroke: { curve: 'smooth' },
                    xaxis: { type: 'datetime', categories: daily_timestamps },
                    tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
                };
                
                var dailySalesChart = new ApexCharts(document.querySelector("#dailySales"), optionsDailySales);
                dailySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching daily sales:', error);
                $('#chat_daily').text('Error fetching sales data.');
            }
        });
    
        // Return the placeholder for immediate display
        return chatDailyHTML;
    } else if (
        lowerInput.includes('what is the sales this month') || 
        lowerInput.includes('this month sales') ||
        lowerInput.includes('monthly sales') ||
        lowerInput.includes('monthly')
    ) {
        // Add the placeholder for monthly sales response and chart
        const chatMonthlyHTML = `
            <div id="chat_monthly">
                Fetching monthly sales...
                <div id="monthlySalesChartContainer" style="margin-top: 20px;"></div>
            </div>
        `;
        
        // Perform the AJAX request
        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extract and format monthly sales
                const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);
    
                // Get the current date
                const now = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = now.toLocaleDateString('en-US', options);
    
                // Update the HTML element with the formatted sales and current date in a bold sentence
                $('#chat_monthly').html(`
                    The monthly sales for this month as of ${formattedDate} is <b>${monthSales}</b>.
                    <div id="monthlySalesChartContainer" style="margin-top: 20px;"></div>
                `);
    
                // Extract monthly sales data for the chart
                const monthlySales = response.monthly_sales;
                const monthly_month = monthlySales.map(sale => sale[0]);
                const monthly_data = monthlySales.map(sale => sale[1]);
    
                // Set up the bar chart
                var optionsMonthlySales = {
                    series: [{ name: 'Monthly Sales', data: monthly_data }],
                    chart: { height: 300, type: 'bar' },
                    colors: ['#2196F3'], // Blue for monthly sales
                    dataLabels: { enabled: false },
                    stroke: { curve: 'smooth' },
                    xaxis: {
                        type: 'datetime',
                        categories: monthly_month,
                        labels: {
                            datetimeFormatter: { year: 'yyyy', month: 'MMM yyyy' }
                        }
                    },
                    tooltip: { x: { format: 'MMM yyyy' } }
                };
    
                // Render the chart in the newly added container
                var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySalesChartContainer"), optionsMonthlySales);
                monthlySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching monthly sales:', error);
                $('#chat_monthly').html('<span style="color: red;">Error fetching sales data.</span>');
            }
        });
    
        // Return the placeholder immediately
        return chatMonthlyHTML;
    } else if (lowerInput.includes('yearly')) {
        // Add placeholder for yearly sales and charts
        const chatYearlyHTML = `
            <div id="chat_yearly">Fetching yearly sales for 2023 and 2024...</div>
            <div id="yearlySales"></div> <!-- Placeholder for yearly sales chart -->
        `;
        
        // Perform the AJAX request to get data
        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Format sales for 2023 and 2024
                const sales2023 = response.yearly_sales.find(sale => sale[0] === '2023') ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.yearly_sales.find(sale => sale[0] === '2023')[1]) : 'N/A';
                const sales2024 = response.yearly_sales.find(sale => sale[0] === '2024') ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.yearly_sales.find(sale => sale[0] === '2024')[1]) : 'N/A';
                
                // Display the total sales for 2023 and 2024
                $('#chat_yearly').html(`
                    The total sales for the year 2023 are <b>${sales2023}</b> and for 2024 are <b>${sales2024}</b>.
                `);
                
                // Yearly sales data for chart (filtering for 2023 and 2024)
                const year_data = ['2023', '2024'];
                const year_amounts = [
                    response.yearly_sales.find(sale => sale[0] === '2023') ? response.yearly_sales.find(sale => sale[0] === '2023')[1] : 0,
                    response.yearly_sales.find(sale => sale[0] === '2024') ? response.yearly_sales.find(sale => sale[0] === '2024')[1] : 0
                ];
    
                var optionsYearlySales = {
                    series: [{ name: 'Yearly Sales', data: year_amounts }],
                    chart: { height: 300, type: 'bar' },
                    colors: ['#FF5733', '#FFBD33'], // Different colors for 2023 and 2024
                    dataLabels: { enabled: false },
                    xaxis: {
                        categories: year_data,
                        labels: { show: true } // Show x-axis labels for 2023 and 2024
                    },
                    plotOptions: {
                        bar: {
                            distributed: true // Ensures each bar uses a different color from the colors array
                        }
                    },
                    tooltip: { x: { format: 'yyyy' } }
                };
                
                var yearlySalesChart = new ApexCharts(document.querySelector("#yearlySales"), optionsYearlySales);
                yearlySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching yearly sales:', error);
                $('#chat_yearly').text('Error fetching sales data.');
            }
        });
    
        // Return the placeholder for immediate display
        return chatYearlyHTML;
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