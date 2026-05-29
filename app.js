// --- STATE MANAGEMENT ---
let state = {
    documents: JSON.parse(localStorage.getItem('passportfolio_data')) || [],
    activeCountry: null,
    filterType: 'all',
    searchQuery: '',
    continentFilter: 'All',
    showCollectedOnly: false
};

// Biến lưu danh sách quốc gia được tải từ server
let COUNTRIES_DB = [];

// --- DỮ LIỆU TỪ GOOGLE SHEETS ---
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfqgVHkf2p4X8pmriSdSsJEvUmyFz1rvk_qtaze7esA_itLdgEPF9xvtWrlWldsQ/pub?gid=787333621&single=true&output=csv';

async function loadCountries() {
    try {
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.text();
        // Chuyển đổi dữ liệu CSV thành mảng đối tượng
        COUNTRIES_DB = parseCSV(data);
        renderCountryList();
        updateStats();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu quốc gia:", error);
    }
}

// Hàm chuyển đổi CSV sang JSON
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    // Bỏ qua dòng tiêu đề đầu tiên
    return lines.slice(1).map(line => {
        // Sử dụng regex để xử lý các dấu phẩy bên trong dấu ngoặc kép (nếu có)
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        return {
            code: values[0]?.replace(/"/g, '').trim(),
            name: values[1]?.replace(/"/g, '').trim(),
            code3: values[2]?.replace(/"/g, '').trim(),
            flag: values[3]?.replace(/"/g, '').trim(),
            continent: values[4]?.replace(/"/g, '').trim(),
            iata: values[5] ? values[5].replace(/"/g, '').split(';').map(i => i.trim()) : []
        };
    });
}

// Gọi hàm loadCountries khi ứng dụng bắt đầu
window.onload = () => {
    loadCountries();
};
