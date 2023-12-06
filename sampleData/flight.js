
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAddNewFlight } from "../src/services/amadeusService.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    const headers = {};
    const data = [];
    // Duyệt qua mỗi ô trong sheet
    for (const cell in worksheet) {
        if (cell[0] === '!') continue;

        // Lấy giá trị của ô và chỉ mục cột/dòng
        const cellValue = worksheet[cell].v;
        const cellIndex = XLSX.utils.decode_cell(cell);

        // Lưu chỉ mục của các cột theo tiêu đề
        if (cellIndex.r === 0) {
            headers[cellIndex.c] = cellValue;
            continue;
        }

        // Tạo object dữ liệu với các giá trị tương ứng theo cột tiêu đề
        const rowData = {};
        for (let i = 0; i < Object.keys(headers).length; i++) {
            const header = headers[i];
            const cellData = worksheet[XLSX.utils.encode_cell({ r: cellIndex.r, c: i })];
            rowData[header] = cellData ? cellData.v : '';
        }
        data.push(rowData);
    }
    return data;
}

// Sử dụng hàm readExcel
const filePath = path.join(__dirname, 'codeFlight.xlsx');
// console.log(excelData); // In ra dữ liệu từ file Excel theo cột tiêu đề
export const uploadFlight = async() => { 
    const data = await readExcel(filePath);
    const uniqueIds = new Set();
    data.forEach(row =>{
        if (!uniqueIds.has(row.id)) {
            uniqueIds.add(row.id);     
            let airport = row.airport;
            let code_flight = row.code_flight;
            let district = row.district;
            if(district)
            {
                district = district.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }
            let status = 1;
            let include_district = row.include_district;
            handleAddNewFlight(airport,
                code_flight,
                district,
                include_district,
                status)
        }
    })
} 
