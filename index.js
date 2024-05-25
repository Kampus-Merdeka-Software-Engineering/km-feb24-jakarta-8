const fetchData = async () => {
  const data = await fetch("./data.json");
  return data.json();
};

window.addEventListener("DOMContentLoaded", async () => {
  const totalElement = document.getElementById("total");
  const data = await fetchData();
  const jumlahTransaksi = data.length;
  totalElement.textContent = "Transactions : " + jumlahTransaksi.toLocaleString('en-US');

  const quantityElement = document.getElementById("quantity");
  const totalOrderQuantity = data.reduce((sum, item) =>
    sum + item.Order_Quantity, 0);
  quantityElement.textContent = "Sold : " + totalOrderQuantity.toLocaleString('en-US');

  const costElement = document.getElementById("cost");
  const totalCost = data.reduce((sum, item) => 
    sum + item.Cost, 0);
  costElement.textContent = "Cost : $" + totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '');

  const revenueElement = document.getElementById("revenue");
  const totalRevenue = data.reduce((sum, item) => 
    sum + item.Revenue, 0);
  revenueElement.textContent = "Revenue : $" + totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '');

  const profitElement = document.getElementById("profit");
  const totalProfit = totalRevenue - totalCost;
  profitElement.textContent = "Profit: $" + totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '');

});

document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burger-menu');
  const navLinks = document.getElementById('nav-links');

  burgerMenu.addEventListener('click', function() {
      navLinks.classList.toggle('show');
  });
});

const groupDataByYear = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const year = new Date(item.Date).getFullYear();
    if (!groupedData[year]) {
      groupedData[year] = [];
    }
    groupedData[year].push(item);
  });
  return groupedData;
};

const calculateProfitPerYear = (groupedData) => {
  const profitPerYear = {};
  Object.keys(groupedData).forEach((year) => {
    const totalProfit = groupedData[year].reduce((sum, item) => sum + item.Profit, 0);
    profitPerYear[year] = totalProfit;
  });
  return profitPerYear;
};

const renderProfitChart = (profitPerYear) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const years = Object.keys(profitPerYear);
  const profits = Object.values(profitPerYear);

  const data = {
    labels: years,
    datasets: [{
      label: 'Profit per Year',
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
          callback: function(value, index, values) {
            return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0 });
          }
        }
      }]
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options,
  });

  return canvas;
};

window.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  const groupedData = groupDataByYear(data);
  const profitPerYear = calculateProfitPerYear(groupedData);
  const mainContent = document.querySelector('.profit-per-year');
  const profitChart = renderProfitChart(profitPerYear);
  mainContent.appendChild(profitChart);
});

