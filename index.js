const fetchData = async () => {
  const data = await fetch("./data.json");
  return data.json();
};

window.addEventListener("DOMContentLoaded", async () => {
  const totalElement = document.getElementById("total");
  const data = await fetchData();
  const jumlahTransaksi = data.length;

  totalElement.textContent = "Jumlah Transaksi:" + (+jumlahTransaksi + 10);
});
