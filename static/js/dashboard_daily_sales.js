function updateDateTime() {
    const now = new Date();
    
    // Format the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    // Format the time with seconds
    const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    
    // Update the HTML elements
    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('current-time').textContent = formattedTime;

   
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Initial call to set the date and time immediately
updateDateTime();


$.ajax({
    url: '/get_dashboard_count', // replace with your API endpoint
    method: 'GET',
    dataType: 'json', // specify the data type expected from the server
    success: function(response) {
        // Format the total sales as currency in PHP
        const todaySales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_today);
        const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);

        // Update the dashboard counts
        $('#today_sales').text(todaySales);
        $('#month_sales').text(monthSales);
        $('#admin_count').text(response.count_admin);
        $('#cashier_count').text(response.count_cashier);

        // Prepare data for the donut chart
        const topProducts = response.top_products; // Assuming response.top_products is an array of arrays or objects
        const seriesData = topProducts.map(product => product[1]); // Assuming product[1] is the total quantity sold
        const labelsData = topProducts.map(product => product[0]); // Assuming product[0] is the sales_reference

        // Configure the donut chart
        var optionsDonut = {
            series: seriesData,
            chart: {
                type: 'donut',
            },
            labels: labelsData, // Add labels for each segment
            colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'], // Shades of gray for contrast
            legend: {
                show: false, // Hide the legend to prevent labels from showing
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false, // Ensure the legend remains hidden on smaller screens
                    }
                }
            }]
        };

        // Create and render the donut chart
        var donutChart = new ApexCharts(document.querySelector("#topProducts"), optionsDonut);
        donutChart.render();

        // Assuming response.critical_stocks is structured as shown in your sample
        const critical_stocks = response.critical_stocks;

        // Map the response to extract product names and their corresponding values
        const seriesData2 = critical_stocks.map(stock => stock[1]); // Extracting values for the donut chart series
        const labels = critical_stocks.map(stock => stock[0]); // Extracting product names for labeling

        // Donut Chart Configuration for Critical Stocks
        var optionsCriticalStocks = {
            series: seriesData2,  // Use the mapped data series for critical stocks
            chart: {
                type: 'donut'
            },
            labels: labels,  // Assign labels to the donut chart
            colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],  // Shades of gray for critical stocks
            legend: {
                show: false // Set to false to hide the legend (labels) from view
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        // Render the donut chart
        var donutChartCriticalStocks = new ApexCharts(document.querySelector("#criticalStocks"), optionsCriticalStocks);
        donutChartCriticalStocks.render();

        // Assuming response.yearly_sales is an array of arrays or objects
        const yearlySales = response.yearly_sales; // Use the correct property for yearly sales data

        // Extract year and sales amount
        const year_data = yearlySales.map(sale => sale[0]); // Assuming sale[0] is the year
        const year_amounts = yearlySales.map(sale => sale[1]); // Assuming sale[1] is the total amount sold

        // Yearly Sales Bar Chart Configuration
        var optionsYearlySales = {
            series: [{
                name: 'Yearly Sales',
                data: year_amounts // Use the extracted sales amounts
            }],
            chart: {
                height: 300,
                type: 'bar'
            },
            colors: ['#000000'], // Changed to black
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: year_data, // Use the extracted years for categories
                labels: {
                    formatter: function(value) {
                        return parseInt(value).toString();
                    }
                }
            },
            tooltip: {
                x: {
                    format: 'yyyy'
                }
            }
        };

        // Render the chart
        var yearlySalesChart = new ApexCharts(document.querySelector("#yearlySales"), optionsYearlySales);
        yearlySalesChart.render();

        // Assuming response.monthly_sales is the correct property for monthly sales data
        const monthlySales = response.monthly_sales; // Use the correct property for monthly sales data

        // Extract months and sales amounts
        const monthly_month = monthlySales.map(sale => sale[0]); // Assuming sale[0] is the month in 'YYYY-MM' format
        const monthly_data = monthlySales.map(sale => sale[1]); // Assuming sale[1] is the total amount sold

        // Monthly Sales Area Chart Configuration
        var optionsMonthlySales = {
            series: [{
                name: 'Monthly Sales',
                data: monthly_data // Use the extracted sales amounts
            }],
            chart: {
                height: 300,
                type: 'bar'
            },
            colors: ['#000000'], // Changed to black
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: monthly_month, // Use the extracted months for categories
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM yyyy'
                    }
                }
            },
            tooltip: {
                x: {
                    format: 'MMM yyyy'
                }
            }
        };

        // Render the chart
        var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySales"), optionsMonthlySales);
        monthlySalesChart.render();

        // Assuming response.daily_sales is the correct property for daily sales data
        const dailySales = response.daily_sales; // Use the correct property for daily sales data

        // Extract timestamps and sales amounts
        const daily_timestamps = dailySales.map(sale => sale[0]); // Assuming sale[0] is the timestamp in ISO format
        const daily_data = dailySales.map(sale => sale[1]); // Assuming sale[1] is the total amount sold

        // Daily Sales Area Chart Configuration
        var optionsDailySales = {
            series: [{
                name: 'Daily Sales',
                data: daily_data // Use the extracted sales amounts
            }],
            chart: {
                height: 300,
                type: 'area'
            },
            colors: ['#000000'], // Changed to black
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: daily_timestamps, // Use the extracted timestamps for categories
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm' // Format for tooltips
                }
            }
        };

        // Render the chart
        var dailySalesChart = new ApexCharts(document.querySelector("#dailySales"), optionsDailySales);
        dailySalesChart.render();


        
    },
    error: function(xhr, status, error) {
        console.error('Error fetching dashboard count:', error);
        $('#dashboard-count').text('Error fetching count.');
    }
});





