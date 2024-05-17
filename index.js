const fetchData = async () => {
  const data = await fetch("./data.json");
  return data.json();
};

window.addEventListener("DOMContentLoaded", async () => {
  const totalElement = document.getElementById("total");
  const data = await fetchData();
  const jumlahTransaksi = data.length;
  totalElement.textContent = "Transactions : " + jumlahTransaksi;

  const quantityElement = document.getElementById("quantity");
  const totalOrderQuantity = data.reduce((sum, item) =>
    sum + item.Order_Quantity, 0);
  quantityElement.textContent = "Sold : " + totalOrderQuantity;

  const costElement = document.getElementById("cost");
  const totalCost = data.reduce((sum, item) => 
    sum + item.Cost, 0);
  costElement.textContent = "Cost : $" + totalCost;

  const revenueElement = document.getElementById("revenue");
  const totalRevenue = data.reduce((sum, item) => 
    sum + item.Revenue, 0);
  revenueElement.textContent = "Revenue : $" + totalRevenue;

});
