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
        // Assuming the response has a 'count' property
        // Format the total sales as currency in PHP
        const todaySales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_today);
        const monthSales = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(response.total_sales_month);

        $('#today_sales').text(todaySales);
        $('#month_sales').text(monthSales);
        $('#admin_count').text(response.count_admin)
        $('#cashier_count').text(response.count_cashier)
        
    },
    error: function(xhr, status, error) {
        console.error('Error fetching dashboard count:', error);
        $('#dashboard-count').text('Error fetching count.');
    }
});

// Daily Sales Area Chart Configuration
var optionsDailySales = {
    series: [{
        name: 'Daily Sales',
        data: [31, 40, 28, 51, 42, 109, 100]
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
        categories: [
            "2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z"
        ]
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        }
    }
};
var dailySalesChart = new ApexCharts(document.querySelector("#dailySales"), optionsDailySales);
dailySalesChart.render();

// Monthly Sales Area Chart Configuration
var optionsMonthlySales = {
    series: [{
        name: 'Monthly Sales',
        data: [310, 400, 280, 510, 420, 1090, 1000]
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
        categories: ["2018-09", "2018-10", "2018-11", "2018-12", "2019-01", "2019-02", "2019-03"],
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
var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySales"), optionsMonthlySales);
monthlySalesChart.render();

// Yearly Sales Bar Chart Configuration
var optionsYearlySales = {
    series: [{
        name: 'Yearly Sales',
        data: [1200, 1500, 1300, 1700, 1600, 1900, 2200]
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
        categories: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
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
var yearlySalesChart = new ApexCharts(document.querySelector("#yearlySales"), optionsYearlySales);
yearlySalesChart.render();

// Donut Chart Configuration
var optionsDonut = {
    series: [44, 55, 41, 17, 15],
    chart: {
        type: 'donut',
    },
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'], // Shades of gray for contrast
    legend: {
        show: false
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                show: true,
                position: 'bottom'
            }
        }
    }]
};
var donutChart = new ApexCharts(document.querySelector("#topProducts"), optionsDonut);
donutChart.render();

// Donut Chart Configuration for Critical Stocks
var optionsCriticalStocks = {
    series: [20, 15, 10, 5, 2],  // Example data series for critical stocks
    chart: {
        type: 'donut'
    },
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],  // Shades of gray for critical stocks
    legend: {
        show: false
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

var donutChartCriticalStocks = new ApexCharts(document.querySelector("#criticalStocks"), optionsCriticalStocks);
donutChartCriticalStocks.render();
