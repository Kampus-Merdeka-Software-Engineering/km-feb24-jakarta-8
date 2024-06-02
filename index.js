const fetchData = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();
  return data;
};

const calculateProfitPerMonth = (groupedData) => {
  const profitPerMonth = {};
  Object.keys(groupedData).forEach((month) => {
    const totalProfit = groupedData[month].reduce((sum, item) => sum + item.Profit, 0);
    profitPerMonth[month] = totalProfit;
  });
  return profitPerMonth;
};

const calculateProfitPerYear = (data, year) => {
  const filteredData = year === "all" ? data : data.filter(item => new Date(item.Date).getFullYear() === Number(year));
  const profitPerYear = {};
  filteredData.forEach(item => {
    const year = new Date(item.Date).getFullYear();
    if (!profitPerYear[year]) {
      profitPerYear[year] = 0;
    }
    profitPerYear[year] += item.Profit;
  });
  return profitPerYear;
};

const groupDataByMonth = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const month = new Date(item.Date).toLocaleString('default', { month: 'short' });
    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    groupedData[month].push(item);
  });
  return groupedData;
};

const groupDataByAgeGroup = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const ageGroup = item.Age_Group;
    if (!groupedData[ageGroup]) {
      groupedData[ageGroup] = [];
    }
    groupedData[ageGroup].push(item);
  });
  return groupedData;
};

const fetchDataAndInitialize = async () => {
  const data = await fetchData();
  initializePage(data);
};

const initializePage = (data) => {
  // Convert string numbers to actual numbers
  data.forEach(item => {
    item.Order_Quantity = Number(item.Order_Quantity);
    item.Cost = Number(item.Cost);
    item.Revenue = Number(item.Revenue);
    item.Profit = Number(item.Profit);
  });

  // Calculate profit per year and populate year dropdown
  const profitPerYear = calculateProfitPerYear(data, "all");
  const yearSelect = document.getElementById("year-select");

  // Add "All Years" option
  const allYearsOption = document.createElement("option");
  allYearsOption.value = "all";
  allYearsOption.textContent = `All Years (Total Profit: $${Object.values(profitPerYear).reduce((a, b) => a + b, 0).toLocaleString('en-US')})`;
  yearSelect.appendChild(allYearsOption);

  Object.keys(profitPerYear).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = `${year} (Profit: $${profitPerYear[year].toLocaleString('en-US')})`;
    yearSelect.appendChild(option);
  });


  updateCardsAndRenderCharts(data, "all");

  // Update chart when the selected year changes
  yearSelect.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    updateCardsAndRenderCharts(data, selectedYear);
  });
};

const updateCardsAndRenderCharts = (data, year) => {
  let filteredData = data;
  if (year !== "all") {
    filteredData = data.filter(item => new Date(item.Date).getFullYear() === Number(year));
  }


  updateCards(filteredData);


  if (year === "all") {
    renderProfitChartByYear(data);
  } else {
    renderProfitChartByMonth(filteredData, year);
  }


  renderGenderDistributionChart(data);


  renderAgeDistributionChart(data);
};

const updateCards = (data) => {

  const totalElement = document.getElementById("total");
  const jumlahTransaksi = data.length;
  totalElement.textContent = "Transactions: " + jumlahTransaksi.toLocaleString('en-US');

  // Calculate total order quantity
  const quantityElement = document.getElementById("quantity");
  const totalOrderQuantity = data.reduce((sum, item) => sum + item.Order_Quantity, 0);
  quantityElement.textContent = "Sold: " + totalOrderQuantity.toLocaleString('en-US');


  const costElement = document.getElementById("cost");
  const totalCost = data.reduce((sum, item) => sum + item.Cost, 0);
  costElement.textContent = "Cost: $" + totalCost.toLocaleString('en-US');


  const revenueElement = document.getElementById("revenue");
  const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
  revenueElement.textContent = "Revenue: $" + totalRevenue.toLocaleString('en-US');

  // Calculate total profit
  const profitElement = document.getElementById("profit");
  const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
  profitElement.textContent = "Profit: $" + totalProfit.toLocaleString('en-US');
};

const renderProfitChartByMonth = (data, year) => {
  const groupedData = groupDataByMonth(data);
  const profitPerMonth = calculateProfitPerMonth(groupedData);

  // Clear previous chart
  const mainContent = document.querySelector('.profit-per-year');
  mainContent.innerHTML = '';

  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  mainContent.appendChild(canvas);

  // Create chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const profits = months.map(month => profitPerMonth[month] || 0);

  const chartData = {
    labels: months,
    datasets: [{
      label: `Profit in ${year}`,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: profits,
    }]
  };

  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0 });
          }
        }
      }]
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: options,
  });
};

const renderProfitChartByYear = (data) => {
  const profitPerYear = calculateProfitPerYear(data, "all");

    
    const mainContent = document.querySelector('.profit-per-year');
    mainContent.innerHTML = '';
  
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    mainContent.appendChild(canvas);
  
    
    const years = Object.keys(profitPerYear);
    const profits = Object.values(profitPerYear);
  
    const chartData = {
      labels: years,
      datasets: [{
        label: 'Total Profit for All Years',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: profits,
      }]
    };
  
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0 });
            }
          }
        }]
      }
    };
  
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: options,
    });
  };
  
  const renderGenderDistributionChart = (data) => {
    const genderCounts = data.reduce((counts, item) => {
      counts[item.Customer_Gender] = (counts[item.Customer_Gender] || 0) + 1;
      return counts;
    }, {});
  
    const genderLabels = Object.keys(genderCounts);
    const genderData = Object.values(genderCounts);
  
    
    const genderContent = document.querySelector('.gender-distribution');
    genderContent.innerHTML = '';
  
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    genderContent.appendChild(canvas);
  
    const chartData = {
      labels: genderLabels,
      datasets: [{
        label: 'Gender Distribution',
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        data: genderData,
      }]
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false
    };
  
    new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: options,
    });
  };
  
  const renderAgeDistributionChart = (data) => {
    const ageGroupedData = groupDataByAgeGroup(data);
    const ageGroupLabels = Object.keys(ageGroupedData);
    const ageGroupData = Object.values(ageGroupedData).map(group => group.length);
  
    
    const ageContent = document.querySelector('.age-distribution');
    ageContent.innerHTML = '';
  
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ageContent.appendChild(canvas);
  
    const chartData = {
      labels: ageGroupLabels,
      datasets: [{
        label: 'Age Distribution',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
        data: ageGroupData,
      }]
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false
    };
  
    new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: options,
    });
  };
  
  fetchDataAndInitialize();
  
  document.addEventListener("DOMContentLoaded", function() {
    const burgerMenu = document.getElementById("burger-menu");
    const navLinks = document.getElementById("nav-links");


    burgerMenu.addEventListener("click", function() {

        if (navLinks.classList.contains("show")) {

            navLinks.classList.remove("show");
        } else {

            navLinks.classList.add("show");
        }
    });
});
 

const renderCustomerByCountryChart = (data) => {
 
  const groupedData = groupDataByCountry(data);

  
  const labels = Object.keys(groupedData);
  const dataCounts = Object.values(groupedData);

  
  const countryChartCanvas = document.getElementById('countryChart');
  countryChartCanvas.innerHTML = '';

  
  const ctx = countryChartCanvas.getContext('2d');

  
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Customer by Country',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: dataCounts,
    }]
  };

  
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0,
        }
      }]
    }
  };

  
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: options,
  });
};

const groupDataByCountry = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const country = item.Country;
    if (!groupedData[country]) {
      groupedData[country] = 0;
    }
    groupedData[country]++;
  });
  return groupedData;
};


fetchDataAndRenderCustomerByCountryChart();


async function fetchDataAndRenderCustomerByCountryChart() {
  const data = await fetchData(); // Ambil data dari sumber data
  renderCustomerByCountryChart(data); // Render grafik
}