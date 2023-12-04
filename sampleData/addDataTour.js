import { handleAddNewTour } from "../src/services/toursService.js";
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
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
const filePath = path.join(__dirname, 'tour.xlsx');
// console.log(excelData); // In ra dữ liệu từ file Excel theo cột tiêu đề
export const upload = async() => { 
    const data = await readExcel(filePath);
    const uniqueIds = new Set();
    data.forEach(row =>{
        if (!uniqueIds.has(row.id)) {
            uniqueIds.add(row.id);
            console.log(row.id);      
            let name = row.name;
            let description = row.description;
            let destination = row.destination;
            let region = row.region;
            let duration = row.duration;
            let adultPrice = row.adultPrice; 
            let childPrice = row.childPrice;
            // console.log(row.openTIme);
            const unixTime = (row.openTIme - 25569) * 86400 * 1000;
            const dateValue = new Date(unixTime);
            const dateObj = new Date(dateValue); // Tạo đối tượng Date từ chuỗi ngày tháng
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và định dạng thành 2 chữ số
            const day = dateObj.getDate().toString().padStart(2, '0'); // Lấy ngày và định dạng thành 2 chữ số
            const year = dateObj.getFullYear(); // Lấy năm
            const formattedDate = `${month}-${day}-${year}`; // Tạo chuỗi ngày tháng theo định dạng 'mm-dd-yyyy'
            let openTime = formattedDate; 
            // console.log(row.closeTime);
            const unixTimeClose = (row.closeTime - 25569) * 86400 * 1000;
            const dateValueClose = new Date(unixTimeClose);
            const dateObjClose = new Date(dateValueClose); // Tạo đối tượng Date từ chuỗi ngày tháng
            const monthC = (dateObjClose.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và định dạng thành 2 chữ số
            const dayC = dateObjClose.getDate().toString().padStart(2, '0'); // Lấy ngày và định dạng thành 2 chữ số
            const yearC = dateObjClose.getFullYear(); // Lấy năm
            const formattedDateC = `${month}-${day}-${year}`; // Tạo chuỗi ngày tháng theo định dạng 'mm-dd-yyyy'
            let closeTime = formattedDateC; 
            let status = row.status; 
            let url1 = row.urlImage1;
            let url2 = row.urlImage2;
            let url3 = row.urlImage3;
            handleAddNewTour( name, 
                description, 
                destination, 
                region, 
                duration, 
                childPrice, 
                adultPrice, 
                openTime,
                closeTime,
                status,
                url1,
                url2,
                url3)
        }
    })
} 
