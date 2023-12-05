import { handleAddNewTour, handleUpdateTourWithPlan } from "../src/services/toursService.js";
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
            let districtDes = row.Province;
            let durationType = row.durationType;
            let pickUp = row.pickUp;
            handleAddNewTour( name, 
                description, 
                destination, 
                districtDes,
                region, 
                duration, 
                durationType,
                pickUp,
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
export const updatePlan = async() => { 
    const data = await readExcel(filePath);
    const uniqueIds = new Set();
    data.forEach(row =>{
        if (!uniqueIds.has(row.id)) {
            uniqueIds.add(row.id);
            let tourId = row.id;      
            let day1 = '{' + row.day1 + '}';
            let day2 = '{' + row.day2 + '}';
            let day3 = '{' + row.day3 + '}';
            let day4 = '{' + row.day4 + '}';
            let day5 = '{' + row.day5 + '}';
            let day6 = '{' + row.day6 + '}';
            let day7 = '{' + row.day7 + '}';
            let day8 = '{' + row.day8 + '}';
            
            // if(day1 !== "{}")
            // {
            //     console.log('day1')
            //     let dataArray = day1.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day2 !== "{}")
            // {
            //     console.log('day2')
            //     let dataArray = day2.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day3 !== "{}")
            // {
            //     console.log('day3')
            //     let dataArray = day3.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day4 !== "{}")
            // {
            //     console.log('day4')
            //     let dataArray = day4.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day5 !== "{}")
            // {
            //     console.log('day5')
            //     let dataArray = day5.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day6 !== "{}")
            // {
            //     console.log('day6')
            //     let dataArray = day6.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day7 !== "{}")
            // {
            //     console.log('day7')
            //     let dataArray = day7.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            // if(day8 !== "{}")
            // {
            //     console.log('day8')
            //     let dataArray = day8.split('},{');
            //     dataArray[0] = dataArray[0].substring(1);
            //     dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
            //     let result = dataArray.map(item => {
            //         let [time, description] = item.split(': ');
            //         time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
            //         return { time, description };
            //     });
            //     result.forEach(item => {
            //         console.log(`Time: ${item.time}, Description: ${item.description}`);
            //     });
            //     console.log('\n')
            // }
            const days = [day1, day2, day3, day4, day5, day6, day7, day8];

            days.forEach((day, index) => {
            if (day !== "{}") {
                // console.log(`day${index + 1}`);
                let dataArray = day.split('},{');
                dataArray[0] = dataArray[0].substring(1);
                dataArray[dataArray.length - 1] = dataArray[dataArray.length - 1].slice(0, -1);
                let result = dataArray.map(item => {
                    let [time, description] = item.split(': ');
                    // time = time.slice(1); // Loại bỏ dấu ngoặc đơn ở đầu
                    return { time, description };
                });
                // console.log(tourId);
                // console.log(result);
                handleUpdateTourWithPlan(tourId, result);
            }
            });
        }
    })
}