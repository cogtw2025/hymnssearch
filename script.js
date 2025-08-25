// --- 請用此版本完整取代您的 script.js 檔案 ---

let hymns = [];
let collections = {}; // 用於按詩歌集分組數據

// --- 新增：擘餅詩歌分類資料 ---
const breakingBreadCategories = [
    { title: "第一奇-主永為人", codes: ['H027', 'H036', 'H043', 'HH092', 'HH093', 'HH094', 'HH097', 'HH122', '10094', '10128', '10133', '11047', '11048', '1204', '1218', '1220', '1222', '1223', '1236', '1239', '1240', '1320', '1332', '1343', '1531', '1536', '1615', '1623', '1714', '1716', '1718', '1719', '2036'] },
    { title: "第二奇-主為我釘十字架", codes: ['H040', 'H052', 'H054', 'H060', 'HH098', 'HH108', 'HH123', '10150', '10151', '11051', '11053', '11055', '1326', '1327', '1329', '1339', '1566', '1616', '1617', '1764', '1933', '1969', '1978', '11179', '1257'] },
    { title: "第三奇-主復活", codes: ['H069', 'H078', 'H159', 'H258', 'HH109', 'HH119', '1382', '1385', '1432', '1433', '1434', '1435', '1442', '1445', '1457', '1465', '1477', '1534', '1605', '1613', '1630', '1736', '2116', '2124', '2132', '11138', '1244'] },
    { title: "第四奇-主為我升天", codes: ["H090", "H162", "H165", "H1180", "H329", "HH112", "HH117", '1357', '1437', '1440', '1441', '1475', '1619', '1624', '1628', '1939', '1945', '2047', '2280'] },
    { title: "第五奇-聖靈降臨，父，主永住我心", codes: ["H092", "H287", "HH002", "HH003", "HH199", '10124', '1318', '1323', '1325', '1335', '1341', '1348', '1353', '1519', '1526', '1527', '1548', '1549', '1560', '1565', '1567', '1572', '1576', '1578', '1580', '1582', '1586', '1606', '1625', '1709', '1715', '1731', '1745', '1759', '1762', '1763', '1779', '1787', '1809', '1911', '1917', '1951', '1960', '2076', '2156', '2170', '11096', '11199', '11207', '1247', '1253'] },
    { title: "第六奇-主再來提接我們", codes: ["H100", "H101", "H1112", "H114", "H115", "HH083", "HH128", "HH183", '10142', '10145', '10204', '11206', '11209', '1276', '1278', '1279', '1280', '1316', '1337', '1345', '1358', '1370', '1479', '1529', '1559', '1610', '1612', '1638', '1658', '1987', '2048', '2354', '2369'] },
    { title: "第七奇-我們與主一同降臨", codes: ["H104", "H105", "H106", "H120", "H130", "HH107", "HH111", "HH160", "HH163", '10154', '1242', '1362', '1374', '1538', '1614', '1631', '1632', '1633', '1644', '1646', '1649', '1653', '1657', '1661', '1665', '1667', '1668', '1670', '1677', '1678', '1679', '1680', '1681', '1684', '1721', '1734', '1744', '1750', '1792', '2123', '2173', '2176', '2236', '2361', '2370', '2379', '2381', '2383', '2385', '2387'] }
];

// ... (其他程式碼與之前相同，此處省略以保持簡潔) ...
// 為了避免過於冗長，以下的程式碼與您上一個版本完全相同，
// 但我會提供完整的檔案內容，以便您直接複製貼上。
// 新增的邏輯主要在檔案載入成功後，以及點擊事件處理的部分。

// --- 完整的 script.js 檔案 ---

const specialContent = {
    title: "甜跪＆歡呼",
    content: `主啊！寶貴今日是袮所訂定的日子，使我在其中因袮高興歡喜
主啊！寶貴袮已經復活了！袮是我的倚靠，必定會幫助我
寶貴袮榮耀託付了我，今天必定最有意義、最喜樂
阿爸！無限寶貴袮是我的親阿爸，我是袮的親孩子，我從袮而生，袮最愛我、最喜歡我！
主啊！無限寶貴袮與我永遠聯合！袮是我的真良人，我是袮的至愛佳偶，袮的能力全屬我！主啊！我愛袮！
主啊！人生有袮，袮必使我人生極其精彩難忘，成爲教會與多人的祝福！`
};

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const hymnCollectionsDiv = document.getElementById('hymn-collections');
const mainControlsContainer = document.getElementById('main-controls-container');
const backToHomeBtn = document.getElementById('back-to-home-btn');

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const decreaseBtn = document.getElementById('decrease-font');
    const increaseBtn = document.getElementById('increase-font');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }
    themeToggleBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        applyTheme(!isCurrentlyDark);
    });

    const fontSizes = ['font-size-1', 'font-size-2', 'font-size-3', 'font-size-4', 'font-size-5', 'font-size-6'];
    let currentSizeIndex;

    function applyFontSize(index) {
        currentSizeIndex = index;
        mainContent.classList.remove(...fontSizes);
        const newSize = fontSizes[currentSizeIndex];
        mainContent.classList.add(newSize);
        localStorage.setItem('hymnFontSize', newSize);
        decreaseBtn.disabled = currentSizeIndex === 0;
        increaseBtn.disabled = currentSizeIndex === fontSizes.length - 1;
    }

    let savedSize = localStorage.getItem('hymnFontSize');
    const oldToNewSizeMap = { 'small': 'font-size-2', 'medium': 'font-size-3', 'large': 'font-size-5' };
    if (oldToNewSizeMap[savedSize]) savedSize = oldToNewSizeMap[savedSize];
    const defaultSize = 'font-size-3';
    let initialIndex = fontSizes.indexOf(savedSize);
    if (initialIndex === -1) initialIndex = fontSizes.indexOf(defaultSize);
    applyFontSize(initialIndex);

    increaseBtn.addEventListener('click', () => { if (currentSizeIndex < fontSizes.length - 1) applyFontSize(currentSizeIndex + 1); });
    decreaseBtn.addEventListener('click', () => { if (currentSizeIndex > 0) applyFontSize(currentSizeIndex - 1); });
    backToHomeBtn.addEventListener('click', () => { searchInput.value = ''; displayInitialMessage(true); });
});

function displayInitialMessage(showUI = true) {
    resultsDiv.innerHTML = `
        <div class="text-center text-gray-500 pt-8 px-4 font-size-message">
             <div id="instruction-toggle" class="inline-block cursor-pointer font-semibold hover:text-blue-500 transition-colors font-size-title">
                使用詩歌搜尋教學 <span id="instruction-arrow" class="inline-block transition-transform text-xs align-middle">▼</span>
            </div>
            <div id="instruction-details" class="hidden mt-4 text-left space-y-2 border-t pt-4 ">
                <p><strong>關鍵字搜尋：</strong> 在上方搜尋框輸入詩歌代碼、名稱或部分歌詞。</p>
                <p><strong>詩歌集瀏覽：</strong> 點擊下方的詩歌集列表，瀏覽完整內容。</p>
                <p><strong>語音輸入：</strong> 按下麥克風圖示，直接說出您想找的詩歌。</p>
                <p><strong>調整字體大小：</strong> 點擊上方的 [+] 或 [-] 按鈕，即可放大或縮小頁面字體。</p>
            </div>
        </div>
    `;
    const toggle = document.getElementById('instruction-toggle'), details = document.getElementById('instruction-details'), arrow = document.getElementById('instruction-arrow');
    toggle.addEventListener('click', () => {
        const isHidden = details.classList.toggle('hidden');
        arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
    });
    backToHomeBtn.classList.add('hidden');
    if (showUI) { mainControlsContainer.classList.remove('hidden'); hymnCollectionsDiv.classList.remove('hidden'); }
}

fetch('hymns.json')
    .then(response => { if (!response.ok) throw new Error('無法載入 hymns.json'); return response.json(); })
    .then(data => {
        hymns = data;
        collections = hymns.reduce((acc, hymn) => {
            if (hymn.content && hymn.content.trim() !== "") {
                const collectionName = hymn.collection || '未分類詩歌';
                if (!acc[collectionName]) acc[collectionName] = [];
                acc[collectionName].push(hymn);
            }
            return acc;
        }, {});

        const hRegex = /(?<![a-zA-Z])H([0-9]{3})/;
        const hCollection = hymns.filter(hymn => {
            if (!hymn.title) return false;
            const match = hymn.title.match(hRegex);
            if (!match) return false;
            const num = parseInt(match[1], 10);
            return num >= 1 && num <= 335;
        }).sort((a, b) => {
            const numA = parseInt(a.title.match(hRegex)[1], 10);
            const numB = parseInt(b.title.match(hRegex)[1], 10);
            return numA - numB;
        });
        if (hCollection.length > 0) collections['神家詩歌合訂本(1)'] = hCollection;

        const hhRegex = /HH([0-9]{3})/;
        const hhCollection = hymns.filter(hymn => {
            if (!hymn.title) return false;
            const match = hymn.title.match(hhRegex);
            if (!match) return false;
            const num = parseInt(match[1], 10);
            return num >= 1 && num <= 199;
        }).sort((a, b) => {
            const numA = parseInt(a.title.match(hhRegex)[1], 10);
            const numB = parseInt(b.title.match(hhRegex)[1], 10);
            return numA - numB;
        });
        if (hhCollection.length > 0) collections['神家詩歌合訂本(2)'] = hhCollection;

        // --- 新增：處理擘餅詩歌分類 ---
        function findHymn(code) {
            if (typeof code === 'string' && code.startsWith('合訂本')) {
                const parts = code.split('第');
                const collectionNum = parts[0] === '合訂本1' ? 1 : 2;
                const hymnIndex = parseInt(parts[1], 10) - 1;
                const sourceCollection = collectionNum === 1 ? hCollection : hhCollection;
                return sourceCollection[hymnIndex] || null;
            }
            return hymns.find(h => h.code === String(code) || (h.title && h.title.includes(String(code))));
        }

        breakingBreadCategories.forEach(category => {
            const hymnList = category.codes.map(code => findHymn(code)).filter(Boolean); // .filter(Boolean) removes any nulls
            collections[category.title] = hymnList;
        });
        
        displayInitialMessage();
        makeCollectionsClickable();
    })
    .catch(error => {
        resultsDiv.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded-md"><p class="font-bold">資料載入錯誤</p><p>${error.message}</p></div>`;
        console.error("Fetch Error:", error);
    });

// --- 新增：顯示擘餅詩歌七大分類的頁面 ---
function renderWondersPage() {
    mainControlsContainer.classList.add('hidden');
    hymnCollectionsDiv.classList.add('hidden');
    
    resultsDiv.innerHTML = `
        <button id="backToHomeFromWonders" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回主頁</button>
        <h2 class="text-xl font-bold text-center mb-4">精選擘餅詩歌 (宇宙七奇)</h2>
    `;

    const wondersList = document.createElement('div');
    wondersList.className = 'grid grid-cols-1 gap-3';
    
    breakingBreadCategories.forEach(category => {
        const categoryLink = document.createElement('div');
        categoryLink.className = 'p-4 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors font-size-ui dark:border-gray-700 dark:hover:bg-gray-800';
        categoryLink.textContent = category.title;
        categoryLink.addEventListener('click', () => renderHymnList(category.title));
        wondersList.appendChild(categoryLink);
    });

    resultsDiv.appendChild(wondersList);
    document.getElementById('backToHomeFromWonders').addEventListener('click', () => displayInitialMessage(true));
}

function renderSpecialContent() {
    mainControlsContainer.classList.add('hidden');
    hymnCollectionsDiv.classList.add('hidden');
    resultsDiv.innerHTML = `
        <button id="backToCollections" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回詩歌集列表</button>
        <div class="border-b pb-4"><h2 class="text-lg font-semibold text-blue-600 font-size-title">${specialContent.title}</h2><pre class="mt-4 text-gray-800 whitespace-pre-wrap font-size-content">${specialContent.content}</pre></div>
    `;
    document.getElementById('backToCollections').addEventListener('click', () => displayInitialMessage(true));
}

function makeCollectionsClickable() {
    const breakingBreadBtn = document.getElementById('breaking-bread-btn');
    if (breakingBreadBtn) {
        breakingBreadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderWondersPage();
        });
    }

    const collectionElements = hymnCollectionsDiv.querySelectorAll('div > p');
    collectionElements.forEach(p => {
        const text = p.textContent.trim();

        if (text === '甜跪＆歡呼') {
            p.parentElement.addEventListener('click', (e) => { e.preventDefault(); renderSpecialContent(); });
            return;
        }
        
        if (text === '精選擘餅詩歌') return; // Already handled by ID

        const collectionName = text.substring(text.indexOf(' ')).trim();
        if (collections[collectionName]) {
            p.parentElement.addEventListener('click', (e) => { e.preventDefault(); renderHymnList(collectionName); });
        }
    });
}

// 在 script.js 中找到舊的 renderHymnList 函式，並用這段新的程式碼完整取代它

function renderHymnList(collectionName) {
    const hymnsInCollection = collections[collectionName]; 

    mainControlsContainer.classList.add('hidden');
    hymnCollectionsDiv.classList.add('hidden');
    
    const isWonderCategory = breakingBreadCategories.some(c => c.title === collectionName);
    const backButtonHTML = isWonderCategory
        ? `<button id="backToWonders" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回擘餅詩歌分類</button>`
        : `<button id="backToCollections" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回詩歌集列表</button>`;

    resultsDiv.innerHTML = `${backButtonHTML}<h2 class="text-xl font-bold text-center mb-4 font-size-title">${collectionName}</h2>`;

    const hymnList = document.createElement('div');
    // 【修改一】在這裡加上 'font-size-ui'，讓整個列表容器可以縮放
    hymnList.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2 font-size-ui';
    
    if (hymnsInCollection) {
        const hRegex = /(?<![a-zA-Z])H([0-9]{3})/;
        const hhRegex = /HH([0-9]{3})/;

        hymnsInCollection.forEach(hymn => {
            const hymnLink = document.createElement('div');
            // 【修改二】從這裡移除 'font-size-ui'，讓項目繼承父容器的大小
            hymnLink.className = 'p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors dark:border-gray-700 dark:hover:bg-gray-800';
            let displayText = `${hymn.code} - ${hymn.title}`;

            const isHCollection = collectionName === '神家詩歌合訂本(1)';
            const isHHCollection = collectionName === '神家詩歌合訂本(2)';

            if (isHCollection || isHHCollection) {
                const regex = isHCollection ? hRegex : hhRegex;
                const match = hymn.title.match(regex);
                if (match) {
                    const compilationCode = match[0];
                    const mainTitleEnd = hymn.title.indexOf('(');
                    const mainTitle = mainTitleEnd !== -1 ? hymn.title.substring(0, mainTitleEnd).trim() : hymn.title.trim();
                    displayText = `${compilationCode} - ${mainTitle} (${hymn.code})`;
                }
            }

            hymnLink.textContent = displayText;
            hymnLink.addEventListener('click', () => renderHymnContent(hymn, collectionName));
            hymnList.appendChild(hymnLink);
        });
    }
    
    resultsDiv.appendChild(hymnList);
    
    if (isWonderCategory) {
        document.getElementById('backToWonders').addEventListener('click', renderWondersPage);
    } else {
        document.getElementById('backToCollections').addEventListener('click', () => displayInitialMessage(true));
    }
}

function renderHymnContent(hymn, collectionName) {
    mainControlsContainer.classList.remove('hidden');
    backToHomeBtn.classList.add('hidden');

    // --- 新增：判斷返回按鈕的目的地 ---
    const isWonderCategory = breakingBreadCategories.some(c => c.title === collectionName);
    const backButtonHTML = isWonderCategory
        ? `<button id="backToHymnList" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回 "${collectionName}" 列表</button>`
        : `<button id="backToHymnList" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回 "${collectionName}" 列表</button>`;
    
    resultsDiv.innerHTML = `${backButtonHTML}
        <div class="border-b pb-4">
            <h2 class="text-lg font-semibold text-blue-600 font-size-title">${hymn.code} - ${hymn.title}</h2>
            <p class="text-gray-500 text-sm mt-1 font-size-ui">詩歌集: ${hymn.collection}</p>
            <pre class="mt-4 text-gray-800 whitespace-pre-wrap font-size-content">${hymn.content || '（無歌詞內容）'}</pre>
        </div>
    `;
    
    document.getElementById('backToHymnList').addEventListener('click', () => {
        mainControlsContainer.classList.add('hidden');
        renderHymnList(collectionName);
    });
}

function searchHymns(query) {
    const lowerCaseQuery = query.toLowerCase().trim().replace(/\^/g, '');
    if (!hymns || lowerCaseQuery === '') return [];
    
    return hymns.filter(hymn => {
        if (!hymn.content) return false;
        const code = String(hymn.code).toLowerCase();
        const title = hymn.title.toLowerCase();
        const content = hymn.content.toLowerCase().replace(/\^/g, '');
        return code.includes(lowerCaseQuery) || title.includes(lowerCaseQuery) || content.includes(lowerCaseQuery);
    });
}

function displayResults(results) {
    resultsDiv.innerHTML = '';
    backToHomeBtn.classList.remove('hidden');
    if (results.length === 0) { resultsDiv.innerHTML = '<p class="text-center text-gray-500 pt-8 font-size-message">找不到符合條件的詩歌。</p>'; return; }
    
    const countDiv = document.createElement('div');
    countDiv.className = 'text-sm text-gray-600 mb-4 font-size-ui';
    countDiv.textContent = `共找到 ${results.length} 首相關詩歌`;
    resultsDiv.appendChild(countDiv);

    results.forEach(hymn => {
        const hymnDiv = document.createElement('div');
        hymnDiv.className = 'border-b pb-4 mb-4';
        hymnDiv.innerHTML = `
            <h2 class="text-lg font-semibold text-blue-600 font-size-title">${hymn.code} - ${hymn.title}</h2>
            <p class="text-gray-500 text-sm mt-1 font-size-ui">詩歌集: ${hymn.collection}</p>
            <pre class="mt-4 text-gray-800 whitespace-pre-wrap font-size-content">${hymn.content}</pre>
        `;
        resultsDiv.appendChild(hymnDiv);
    });
}

function debounce(func, delay) { let timeoutId; return function(...args) { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; }
const handleSearch = (query) => { if (query === '') { displayInitialMessage(true); return; } const isNumeric = /^\d+$/.test(query); if (isNumeric && query.length < 4) { resultsDiv.innerHTML = ''; return; } hymnCollectionsDiv.classList.add('hidden'); const results = searchHymns(query); displayResults(results); };
const debouncedSearchHandler = debounce(handleSearch, 300);
searchInput.addEventListener('input', (e) => { debouncedSearchHandler(e.target.value.trim()); });

const voiceSearchBtn = document.getElementById('voiceSearchBtn'), voiceMicIcon = document.getElementById('voice-mic-icon'), voiceStopIcon = document.getElementById('voice-stop-icon');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let isRecognizing = false;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = true; recognition.interimResults = true;
    voiceSearchBtn.addEventListener('click', () => { if (isRecognizing) recognition.stop(); else { searchInput.value = ''; recognition.start(); } });
    recognition.onstart = () => { isRecognizing = true; voiceMicIcon.classList.add('hidden'); voiceStopIcon.classList.remove('hidden'); };
    recognition.onend = () => { isRecognizing = false; voiceMicIcon.classList.remove('hidden'); voiceStopIcon.classList.add('hidden'); searchInput.dispatchEvent(new Event('input', { bubbles: true })); };
    recognition.onerror = (event) => { console.error('語音辨識錯誤:', event.error); isRecognizing = false; voiceMicIcon.classList.remove('hidden'); voiceStopIcon.classList.add('hidden'); };
    recognition.onresult = (event) => { let interimTranscript = '', finalTranscript = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript; else interimTranscript += event.results[i][0].transcript; } searchInput.value = finalTranscript + interimTranscript; searchInput.dispatchEvent(new Event('input', { bubbles: true })); };
} else { if(voiceSearchBtn) voiceSearchBtn.style.display = 'none'; console.warn('您的瀏覽器不支援 Web Speech API'); }
