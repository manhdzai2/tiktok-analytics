const XLSX = require('xlsx');
const fs = require('fs');

const filePath = process.argv[2];

if (!filePath || !fs.existsSync(filePath)) {
    console.error(JSON.stringify({ error: "File not found" }));
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    const allLinks = [];

    // Lặp qua tất cả các Sheet trong file Excel
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // Chuyển đổi sheet thành JSON (mảng các mảng)
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        data.forEach(row => {
            if (row && row.length > 0) {
                row.forEach(cell => {
                    if (cell !== null && cell !== undefined && cell !== "") {
                        const str = cell.toString().trim();
                        // Bỏ qua các số thứ tự, chỉ lấy chuỗi có khả năng là ID/Link
                        if (str && isNaN(Number(str))) {
                            allLinks.push(str);
                        }
                    }
                });
            }
        });
    });

    // Trả về kết quả dưới dạng JSON để PHP dễ dàng parse
    console.log(JSON.stringify({
        success: true,
        links: [...new Set(allLinks)] // Loại bỏ trùng lặp
    }));

} catch (e) {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
}
