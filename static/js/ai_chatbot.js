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
        const chatSalesReportHTML = `
            <div class="sales-report">
                <div>
                    <hr>
                    <h6 class="text-muted">Today's Sales</h6>
                    <p id="today_sales_explanation">Loading...</p> <!-- Placeholder for today's sales explanation -->
                    <div id="today_sales"><strong>Loading...</strong></div> <!-- Placeholder for today's sales value with bold -->
                </div>
                <div>
                    <hr>
                    <h6 class="text-muted">Monthly Sales</h6>
                    <p id="month_sales_explanation">Loading...</p> <!-- Placeholder for monthly sales explanation -->
                    <div id="month_sales"><strong>Loading...</strong></div> <!-- Placeholder for monthly sales value with bold -->
                </div>
            </div>
        `;
        
        // Insert the HTML into the appropriate place in the DOM
        $('#report-container').html(chatSalesReportHTML); // Replace #report-container with the actual container ID you are targeting
        
        // Make AJAX call to get sales data
        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                const todaySales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_today);
                const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);
        
                // Update the sales data on the page with bold formatting
                $('#today_sales').html(`<strong>${todaySales}</strong>`);
                $('#month_sales').html(`<strong>${monthSales}</strong>`);
    
                // Update the explanation paragraphs
                $('#today_sales_explanation').text("Today's sales represent the total sales for today. This gives you a snapshot of daily performance.");
                $('#month_sales_explanation').text("This month's sales reflect the accumulated sales for the current month. It provides a broader view of the sales performance throughout the month.");
            },
            error: function(xhr, status, error) {
                console.error('Error fetching sales data:', error);
                $('#today_sales').html('<strong>Error loading data</strong>');
                $('#month_sales').html('<strong>Error loading data</strong>');
                $('#today_sales_explanation').text('Error loading data explanation');
                $('#month_sales_explanation').text('Error loading data explanation');
            }
        });
    
        // Return the initial HTML structure with placeholders (this will be dynamically updated by the above code)
        return chatSalesReportHTML;
    } else if (lowerInput.includes('inventory report')) {
        // Return the initial HTML structure immediately
        const chatInventoryHTML = `
            <div class="inventory-report">
                <p>This are the available stocks inventory</p>
                <ul id="criticalStocksList" style="font-size: 12px">
                    <!-- List of critical stocks will be populated here -->
                </ul>
                <div id="criticalStocksChart" style="height: 300px;">
                    <!-- The donut chart for critical stocks will be rendered here -->
                </div>
            </div>
        `;
        
        // Perform AJAX request to fetch the critical stocks data
        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                const critical_stocks = response.critical_stocks;

                // Prepare the data for the donut chart
                const seriesData2 = critical_stocks.map(stock => stock[1]);
                const labels = critical_stocks.map(stock => stock[0]);

                // Donut chart options for critical stocks
                var optionsCriticalStocks = {
                    series: seriesData2,
                    chart: { type: 'donut', 
                            height: '250px' },
                    labels: labels,
                    colors: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#CD5C5C'], // Red hues for critical stocks
                    legend: { show: false },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: { width: 200 },
                            legend: { position: 'bottom' }
                        }
                    }]
                };

                // Render the donut chart in the criticalStocks div
                var donutChartCriticalStocks = new ApexCharts(document.querySelector("#criticalStocksChart"), optionsCriticalStocks);
                donutChartCriticalStocks.render();

                // Create a list of critical stocks to show in text format
                let criticalStocksHTML = '';
                critical_stocks.forEach(stock => {
                    criticalStocksHTML += `<li>${stock[0]}: ${stock[1]} units left</li>`;
                });

                // Append the list of critical stocks to the #criticalStocksList element
                $('#criticalStocksList').html(criticalStocksHTML);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching dashboard count:', error);
                $('#criticalStocksList').html('<li>Error fetching critical stocks data.</li>');
            }
        });

        return chatInventoryHTML;
    } else if (lowerInput.includes('daily sales')) {
        // Return the placeholder for immediate display
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

        return chatDailyHTML;
    } else if (lowerInput.includes('what is the sales this month') || lowerInput.includes('this month sales') ||
        lowerInput.includes('monthly sales') || lowerInput.includes('monthly')) {

        const chatMonthlyHTML = `
            <div id="chat_monthly">
                Fetching monthly sales...
                <div id="monthlySalesChartContainer" style="margin-top: 20px;"></div>
            </div>
        `;

        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);

                const now = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = now.toLocaleDateString('en-US', options);

                $('#chat_monthly').html(`
                    The monthly sales for this month as of ${formattedDate} is <b>${monthSales}</b>.
                    <div id="monthlySalesChartContainer" style="margin-top: 20px;"></div>
                `);

                const monthlySales = response.monthly_sales;
                const monthly_month = monthlySales.map(sale => sale[0]);
                const monthly_data = monthlySales.map(sale => sale[1]);

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

                var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySalesChartContainer"), optionsMonthlySales);
                monthlySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching monthly sales:', error);
                $('#chat_monthly').html('<span style="color: red;">Error fetching sales data.</span>');
            }
        });

        return chatMonthlyHTML;
    } else if (lowerInput.includes('yearly')) {
        const chatYearlyHTML = `
            <div id="chat_yearly">Fetching yearly sales for 2023 and 2024...</div>
            <div id="yearlySales"></div> <!-- Placeholder for yearly sales chart -->
        `;

        $.ajax({
            url: '/get_dashboard_count',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                const sales2023 = response.yearly_sales.find(sale => sale[0] === '2023') ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.yearly_sales.find(sale => sale[0] === '2023')[1]) : 'N/A';
                const sales2024 = response.yearly_sales.find(sale => sale[0] === '2024') ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.yearly_sales.find(sale => sale[0] === '2024')[1]) : 'N/A';

                $('#chat_yearly').html(`
                    The total sales for the year 2023 are <b>${sales2023}</b> and for 2024 are <b>${sales2024}</b>.
                `);

                const year_data = ['2023', '2024'];
                const year_amounts = [
                    response.yearly_sales.find(sale => sale[0] === '2023') ? response.yearly_sales.find(sale => sale[0] === '2023')[1] : 0,
                    response.yearly_sales.find(sale => sale[0] === '2024') ? response.yearly_sales.find(sale => sale[0] === '2024')[1] : 0
                ];

                var optionsYearlySales = {
                    series: [{
                        name: 'Yearly Sales',
                        data: year_amounts
                    }],
                    chart: { type: 'bar', height: 350 },
                    colors: ['#4CAF50'], // Green for yearly sales
                    xaxis: { categories: year_data },
                    dataLabels: { enabled: false }
                };

                var yearlySalesChart = new ApexCharts(document.querySelector("#yearlySales"), optionsYearlySales);
                yearlySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching yearly sales:', error);
                $('#chat_yearly').text('Error fetching sales data.');
            }
        });

        return chatYearlyHTML;
    } else if (lowerInput.includes('most bought product') || lowerInput.includes('top product') || lowerInput.includes('top products')){
        // Add a placeholder for the Most Bought Product chart
        const chatTopHTML = `
            <div id="chat_top">Fetching Most Bought Product...</div>
            <div id="topProductDetails" style="font-size: 12px"></div> <!-- Placeholder for detailed product sales information -->
            <div id="topProducts"></div> <!-- Placeholder for top products chart -->
        `;
        
        // Perform the AJAX request to fetch data
        $.ajax({
            url: '/get_dashboard_count', // API endpoint for fetching top products
            method: 'GET',
            dataType: 'json', // Expecting a JSON response
            success: function(response) {
                // Check if top_products exists in the response
                if (response && response.top_products) {
                    // Get the top products and map them to series and labels for the chart
                    const topProducts = response.top_products;
                    const seriesData = topProducts.map(product => product[1]); // Quantities sold
                    const labelsData = topProducts.map(product => product[0]); // Product names
    
                    // Donut chart options for visualizing top products
                    var optionsDonut = {
                        series: seriesData, // Product quantities
                        chart: { 
                            type: 'donut', // Chart type
                            width: '100%',
                            height: '250px' // Ensures it fits well in the container
                        },
                        labels: labelsData, // Product names as labels
                        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Brighter colors for the segments
                        legend: { show: false }, // Hide the legend
                        responsive: [{
                            breakpoint: 480, // Adjust chart layout for smaller screens
                            options: {
                                chart: { width: 200 }, // Smaller chart on small screens
                                legend: { show: false } // Hide legend on small screens
                            }
                        }]
                    };
    
                    // Initialize and render the donut chart
                    var topChart = new ApexCharts(document.querySelector("#topProducts"), optionsDonut);
                    topChart.render();
    
                    // Update the placeholder message with data after chart is rendered
                    $('#chat_top').html('Here are the 5 top bought products:');
    
                    // Display textual details about the top products
                    let productDetailsHTML = '<ul>';
                    topProducts.forEach((product, index) => {
                        productDetailsHTML += `
                            <li>Top ${index + 1}: ${product[0]} with ${product[1]} sales</li>
                        `;
                    });
                    productDetailsHTML += '</ul>';
                    $('#topProductDetails').html(productDetailsHTML);
                } else {
                    console.error('No top products data found in the response.');
                    $('#chat_top').html('Failed to fetch the top bought products.');
                    $('#topProductDetails').html('No product details available.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching top products:', error);
                $('#chat_top').text('Error fetching data.');
                $('#topProductDetails').text('Error fetching product details.');
            }
        });
        
        // Return the placeholder for immediate display
        return chatTopHTML;
    }else if (lowerInput.includes('least bought product') || lowerInput.includes('low product') || lowerInput.includes('low products')) {
        // Add a placeholder for the Least Bought Product chart
        const chatLeastHTML = `
            <div id="chat_least">Fetching Least Bought Product...</div>
            <div id="leastProductDetails" style="font-size: 12px"></div> <!-- Placeholder for detailed product sales information -->
            <div id="leastProducts"></div> <!-- Placeholder for least bought products chart -->
        `;
        
        // Perform the AJAX request to fetch data
        $.ajax({
            url: '/get_dashboard_count', // API endpoint for fetching least bought products
            method: 'GET',
            dataType: 'json', // Expecting a JSON response
            success: function(response) {
                // Check if least_bought_products exists in the response
                if (response && response.low_products) {
                    // Get the least bought products and map them to series and labels for the chart
                    const leastBoughtProducts = response.low_products;
                    const seriesData = leastBoughtProducts.map(product => product[1]); // Quantities sold
                    const labelsData = leastBoughtProducts.map(product => product[0]); // Product names
    
                    // Donut chart options for visualizing least bought products
                    var optionsDonut = {
                        series: seriesData, // Product quantities
                        chart: { 
                            type: 'donut', // Chart type
                            width: '100%',
                            height: '250px' // Ensures it fits well in the container
                        },
                        labels: labelsData, // Product names as labels
                        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Brighter colors for the segments
                        legend: { show: false }, // Hide the legend
                        responsive: [{
                            breakpoint: 480, // Adjust chart layout for smaller screens
                            options: {
                                chart: { width: 200 }, // Smaller chart on small screens
                                legend: { show: false } // Hide legend on small screens
                            }
                        }]
                    };
    
                    // Initialize and render the donut chart
                    var leastChart = new ApexCharts(document.querySelector("#leastProducts"), optionsDonut);
                    leastChart.render();
    
                    // Update the placeholder message with data after chart is rendered
                    $('#chat_least').html('Here are the 5 least bought products:');
    
                    // Display textual details about the least bought products
                    let productDetailsHTML = '<ul>';
                    leastBoughtProducts.forEach((product, index) => {
                        productDetailsHTML += `
                            <li>Least ${index + 1}: ${product[0]} with ${product[1]} sales</li>
                        `;
                    });
                    productDetailsHTML += '</ul>';
                    $('#leastProductDetails').html(productDetailsHTML);
                } else {
                    console.error('No least bought products data found in the response.');
                    $('#chat_least').html('Failed to fetch the least bought products.');
                    $('#leastProductDetails').html('No product details available.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching least bought products:', error);
                $('#chat_least').text('Error fetching data.');
                $('#leastProductDetails').text('Error fetching product details.');
            }
        });
        
        // Return the placeholder for immediate display
        return chatLeastHTML;
    } else if (lowerInput.includes('create an attractive display')) {
        return 'Creating an attractive display involves highlighting your best products, organizing items by color or theme, and keeping the layout clean and inviting. Make sure the products are well-lit and accessible to customers.';
    } 
    else if (lowerInput.includes('upsell')) {
        return 'Upselling can be done by suggesting complementary items to your customers, like matching accessories or a different style in the same category. Offer discounts or special deals for bundling items together.';
    } 
    else if (lowerInput.includes('build customer loyalty')) {
        return 'Building customer loyalty can be achieved by offering great service, rewards programs, and personalized experiences. Encourage repeat visits by sending thank-you notes, birthday discounts, or exclusive promotions for loyal customers.';
    } 
    else if (lowerInput.includes('seasonal promotions')) {
        return 'Seasonal promotions are great for driving traffic and sales. Offer discounts or limited-time offers during key times like holidays or back-to-school season. Tailor your products and marketing efforts to match the season or event.';
    } 
    else if (lowerInput.includes('stand out from competitors')) {
        return 'To stand out from competitors, focus on what makes your store unique. This could be exclusive products, superior customer service, or a memorable shopping experience. Keep your store clean, and engage with your customers through social media and personalized offers.';
    } 
    else if (lowerInput.includes('train my staff')) {
        return 'Training your staff in excellent customer service is crucial. Make sure they understand the products, are friendly, approachable, and know how to engage with customers. Offer role-playing sessions and regular feedback to improve their performance.';
    } 
    else if (lowerInput.includes('handle complaints')) {
        return 'Handling complaints gracefully is key to customer satisfaction. Listen carefully, empathize with the customer’s concern, and offer solutions such as exchanges, refunds, or store credit. Always stay calm and respectful, and aim to resolve issues quickly.';
    } 
    else if (lowerInput.includes('use social media')) {
        return 'Using social media effectively can boost your store’s presence. Post regularly with engaging content, showcase new arrivals, behind-the-scenes looks, and promotions. Interact with followers, respond to messages, and use paid ads to reach a wider audience.';
    } 
    else if (lowerInput.includes('cross-sell')) {
        return 'Cross-selling is the art of suggesting products that complement what the customer is already purchasing. For example, if a customer is buying a dress, suggest a matching handbag or jewelry. Always keep the suggestion relevant to their needs and preferences.';
    } 
    else if (lowerInput.includes('assess customer preferences')) {
        return 'To assess customer preferences, pay attention to what products they spend the most time looking at, ask for feedback directly, and use sales data to identify trends. This will help you stock the right items that cater to your customers’ needs.';
    }else {
        return "<p>Sorry, I don't understand the request. Please try again.</p>";
    }
}
