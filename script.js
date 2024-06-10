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

const fetchDataAndInitialize = async () => {
  const data = await fetchData();
  initializePage(data);
};

const initializePage = (data) => {
  data.forEach(item => {
    item.Order_Quantity = Number(item.Order_Quantity);
    item.Cost = Number(item.Cost);
    item.Revenue = Number(item.Revenue);
    item.Profit = Number(item.Profit);
  });

  const profitPerYear = calculateProfitPerYear(data, "all");
  const yearSelect = document.getElementById("year-select");

  const allYearsOption = document.createElement("option");
  allYearsOption.value = "all";
  allYearsOption.textContent = `All Years `;
  yearSelect.appendChild(allYearsOption);

  Object.keys(profitPerYear).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = `${year}`;
    yearSelect.appendChild(option);
  });

  updateCardsAndRenderCharts(data, "all");

  yearSelect.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    updateCardsAndRenderCharts(data, selectedYear);
  });

  // Render data table
  renderDataTable(data);
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

  renderGenderDistributionChart(filteredData, year);
  renderAgeDistributionChart(filteredData, year);
  renderCustomerByCountryChart(filteredData, year);
};

const updateCards = (data) => {
  const totalElement = document.getElementById("total");
  const jumlahTransaksi = data.length;
  totalElement.textContent = "Transactions: " + jumlahTransaksi.toLocaleString('en-US');

  const quantityElement = document.getElementById("quantity");
  const totalOrderQuantity = data.reduce((sum, item) => sum + item.Order_Quantity, 0);
  quantityElement.textContent = "Sold: " + totalOrderQuantity.toLocaleString('en-US');

  const costElement = document.getElementById("cost");
  const totalCost = data.reduce((sum, item) => sum + item.Cost, 0);
  costElement.textContent = "Cost: $" + totalCost.toLocaleString('en-US');

  const revenueElement = document.getElementById("revenue");
  const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
  revenueElement.textContent = "Revenue: $" + totalRevenue.toLocaleString('en-US');

  const profitElement = document.getElementById("profit");
  const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
  profitElement.textContent = "Profit: $" + totalProfit.toLocaleString('en-US');
};

const renderProfitChartByMonth = (data, year) => {
  const groupedData = groupDataByMonth(data);
  const profitPerMonth = calculateProfitPerMonth(groupedData);

  const mainContent = document.querySelector('.profit-per-year');
  mainContent.innerHTML = '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  mainContent.appendChild(canvas);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const profits = months.map(month => profitPerMonth[month] || 0);

  const chartData = {
    labels: months,
    datasets: [{
      label: `Profit in ${year}`,
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
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
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
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

const renderGenderDistributionChart = (data, year) => {
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
      label: `Gender Distribution in ${year === "all" ? "All Years" : year}`,
      backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1,
      data: genderData,
    }]
  };

  new Chart(ctx, {
    type: 'pie',
    data: chartData,
  });
};

const renderAgeDistributionChart = (data, year) => {
  const groupedData = groupDataByAgeGroup(data);
  const ageGroups = Object.keys(groupedData);
  const counts = ageGroups.map(group => groupedData[group].length);

  const ageContent = document.querySelector('.customer-age');
  ageContent.innerHTML = '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ageContent.appendChild(canvas);

  const chartData = {
    labels: ageGroups,
    datasets: [{
      label: `Customer Age Distribution in ${year === "all" ? "All Years" : year}`,
      backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
      data: counts,
    }]
  };

  new Chart(ctx, {
    type: 'pie',
    data: chartData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value.toLocaleString('en-US', { minimumFractionDigits: 0 });
            }
          }
        }]
      }
    }
  });
};

const renderCustomerByCountryChart = (data, year) => {
  const groupedData = groupDataByCountry(data);
  const countries = Object.keys(groupedData);
  const counts = countries.map(country => groupedData[country]);

  const countryContent = document.querySelector('.customer-country');
  countryContent.innerHTML = '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  countryContent.appendChild(canvas);

  const chartData = {
    labels: countries,
    datasets: [{
      label: `Customers by Country in ${year === "all" ? "All Years" : year}`,
      backgroundColor: 'rgba(153, 102, 255, 0.7)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
      data: counts,
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value.toLocaleString('en-US', { minimumFractionDigits: 0 });
            }
          }
        }]
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', fetchDataAndInitialize);

const renderDataTable = (data) => {
  const mainContent = document.querySelector('.data-table-container');

  // Create table element
  const table = document.createElement('table');
  table.classList.add('data-table');

  // Create table header row
  const headerRow = table.insertRow();
  const headers = ['Years', 'Total Transaction', 'Sold Items', 'Costs', 'Revenue', 'Profit'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  // Calculate and add data rows for each year
  const years = [...new Set(data.map(item => new Date(item.Date).getFullYear()))]; // Get unique years
  years.forEach(year => {
    const rowData = calculateDataRow(data, year.toString());
    const row = table.insertRow();
    Object.values(rowData).forEach(value => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });

  const totalRowData = calculateTotalRow(data);
  const footerRow = table.insertRow();
  Object.values(totalRowData).forEach(value => {
    const cell = footerRow.insertCell();
    cell.textContent = value;
  });

  // Append table to main content
  mainContent.appendChild(table);
};

const calculateDataRow = (data, year) => {
  const filteredData = data.filter(item => new Date(item.Date).getFullYear() === Number(year));
  const totalTransaction = filteredData.length;
  const soldItems = filteredData.reduce((sum, item) => sum + item.Order_Quantity, 0);
  const totalCosts = filteredData.reduce((sum, item) => sum + item.Cost, 0);
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.Revenue, 0);
  const totalProfit = filteredData.reduce((sum, item) => sum + item.Profit, 0);

  return {
    'Years': year.toUpperCase(),
    'Total Transaction': totalTransaction,
    'Sold Items': soldItems,
    'Costs': totalCosts.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    'Revenue': totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    'Profit': totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  };
};

const calculateTotalRow = (data) => {
  const totalTransaction = data.length;
  const soldItems = data.reduce((sum, item) => sum + item.Order_Quantity, 0);
  const totalCosts = data.reduce((sum, item) => sum + item.Cost, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);

  return {
    'Years': 'TOTAL ALL YEARS',
    'Total Transaction': totalTransaction,
    'Sold Items': soldItems,
    'Costs': totalCosts.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    'Revenue': totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    'Profit': totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  };
};

document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burger-menu');
  const navLinks = document.getElementById('nav-links');

  burgerMenu.addEventListener('click', function() {
      navLinks.classList.toggle('show');
  });

  navLinks.querySelectorAll('li a').forEach(link => {
      link.addEventListener('click', function() {
          navLinks.classList.remove('show');
      });
  });
});


