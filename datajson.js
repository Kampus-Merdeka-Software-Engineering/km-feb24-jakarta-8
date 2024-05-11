

let penjualan_sepeda = [
    {
        "tanggal": "2024-05-01",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 8,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-02",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 6,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-03",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 10,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-04",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 7,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-05",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 12,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-06",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 9,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-07",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 11,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-08",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 5,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-09",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 10,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-10",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 8,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-11",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 15,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-12",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 12,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-13",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 8,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-14",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 6,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-15",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 10,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-16",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 7,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-17",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 12,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-18",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 9,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-19",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 11,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-20",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 5,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-21",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 10,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-22",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 8,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-23",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 15,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-24",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 12,
        "harga_satuan": 4000000
    },
    {
        "tanggal": "2024-05-25",
        "merk": "Polygon",
        "tipe": "Xtrada",
        "jumlah": 8,
        "harga_satuan": 3000000
    },
    {
        "tanggal": "2024-05-26",
        "merk": "Trek",
        "tipe": "Marlin",
        "jumlah": 6,
        "harga_satuan": 3500000
    },
    {
        "tanggal": "2024-05-27",
        "merk": "Giant",
        "tipe": "ATX",
        "jumlah": 10,
        "harga_satuan": 2800000
    },
    {
        "tanggal": "2024-05-28",
        "merk": "Specialized",
        "tipe": "Rockhopper",
        "jumlah": 7,
        "harga_satuan": 4000000
    }

];
const totalElement = document.getElementById('total');
const jumlahTransaksi = penjualan_sepeda.length;

totalElement.textContent = `Jumlah Transaksi: ${jumlahTransaksi}`;