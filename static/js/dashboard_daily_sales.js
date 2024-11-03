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
    url: '/get_dashboard_count',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        const todaySales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_today);
        const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);

        $('#today_sales').text(todaySales);
        $('#month_sales').text(monthSales);
        $('#admin_count').text(response.count_admin);
        $('#cashier_count').text(response.count_cashier);

        const topProducts = response.top_products;
        const seriesData = topProducts.map(product => product[1]);
        const labelsData = topProducts.map(product => product[0]);

        var optionsDonut = {
            series: seriesData,
            chart: { type: 'donut' },
            labels: labelsData,
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Brighter colors
            legend: { show: false },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { show: false }
                }
            }]
        };
        var donutChart = new ApexCharts(document.querySelector("#topProducts"), optionsDonut);
        donutChart.render();

        const critical_stocks = response.critical_stocks;
        const seriesData2 = critical_stocks.map(stock => stock[1]);
        const labels = critical_stocks.map(stock => stock[0]);

        var optionsCriticalStocks = {
            series: seriesData2,
            chart: { type: 'donut' },
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
        var donutChartCriticalStocks = new ApexCharts(document.querySelector("#criticalStocks"), optionsCriticalStocks);
        donutChartCriticalStocks.render();

        const yearlySales = response.yearly_sales;
        const year_data = yearlySales.map(sale => sale[0]);
        const year_amounts = yearlySales.map(sale => sale[1]);

        var optionsYearlySales = {
            series: [{ name: 'Yearly Sales', data: year_amounts }],
            chart: { height: 300, type: 'bar' },
            colors: ['#4CAF50'], // Green for yearly sales
            dataLabels: { enabled: false },
            xaxis: { categories: year_data },
            tooltip: { x: { format: 'yyyy' } }
        };
        var yearlySalesChart = new ApexCharts(document.querySelector("#yearlySales"), optionsYearlySales);
        yearlySalesChart.render();

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
        var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySales"), optionsMonthlySales);
        monthlySalesChart.render();

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
        console.error('Error fetching dashboard count:', error);
        $('#dashboard-count').text('Error fetching count.');
    }
});
