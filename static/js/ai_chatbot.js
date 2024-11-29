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
                </ul>
            </div>`;
    } else if (lowerInput.includes('inventory report')) {
        // Return the initial HTML structure immediately
        const chatInventoryHTML = `
            <div class="inventory-report">
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
    } else {
        return "<p>Sorry, I don't understand the request. Please try again.</p>";
    }
}
