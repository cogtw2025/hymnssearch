// --- 請用此版本完整取代您的 script.js 檔案 ---

let hymns = [];
let collections = {}; // 用於按詩歌集分組數據

// 獲取頁面上需要操作的核心元素
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const hymnCollectionsDiv = document.getElementById('hymn-collections');
const searchContainer = document.querySelector('.flex.items-center.space-x-2');
const topControlsContainer = document.getElementById('top-controls-container'); 
const backToHomeBtn = document.getElementById('back-to-home-btn');


// --- 字體大小與主題控制 ---
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const decreaseBtn = document.getElementById('decrease-font');
    const increaseBtn = document.getElementById('increase-font');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // --- 深色模式邏輯 ---
    // 檢查 localStorage 中是否有主題設定，或根據使用者系統偏好設定
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
                      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    }
    
    // 初始載入時套用主題
    applyTheme(isDarkMode);

    // 切換按鈕事件
    themeToggleBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        applyTheme(!isCurrentlyDark);
    });


    // --- 字體大小邏輯 (六種大小) ---
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
    const oldToNewSizeMap = {
        'small': 'font-size-2', 'medium': 'font-size-3', 'large': 'font-size-5'
    };
    if (oldToNewSizeMap[savedSize]) {
        savedSize = oldToNewSizeMap[savedSize];
    }
    
    const defaultSize = 'font-size-3'; 
    let initialIndex = fontSizes.indexOf(savedSize);
    if (initialIndex === -1) {
        initialIndex = fontSizes.indexOf(defaultSize);
    }
    
    applyFontSize(initialIndex);

    increaseBtn.addEventListener('click', () => {
        if (currentSizeIndex < fontSizes.length - 1) {
            applyFontSize(currentSizeIndex + 1);
        }
    });

    decreaseBtn.addEventListener('click', () => {
        if (currentSizeIndex > 0) {
            applyFontSize(currentSizeIndex - 1);
        }
    });
    
    backToHomeBtn.addEventListener('click', () => {
        searchInput.value = '';
        displayInitialMessage(true);
    });
});


// 函式：顯示初始提示訊息
function displayInitialMessage(showUI = true) {
    resultsDiv.innerHTML = `
        <div class="text-center text-gray-500 pt-8 px-4 font-size-message">
            <h3 class="text-lg font-semibold">歡迎使用詩歌搜尋</h3>
            <p class="mt-2">請在上方搜尋框中，輸入詩歌的<br>代碼、名稱、或部分歌詞來開始搜尋，<br>或點擊下方詩歌集列表進行瀏覽。</p>
        </div>
    `;

    backToHomeBtn.classList.add('hidden');
    // --- 修改 --- 使用 replace 避免重複添加 class
    topControlsContainer.classList.replace('justify-between', 'justify-center');

    if (showUI) {
        searchContainer.classList.remove('hidden');
        topControlsContainer.classList.remove('hidden');
        hymnCollectionsDiv.classList.remove('hidden');
    }
}

// 函式：資料載入
fetch('hymns.json')
    .then(response => {
        if (!response.ok) throw new Error('無法載入 hymns.json，請檢查檔案路徑或網路連線。');
        return response.json();
    })
    .then(data => {
        hymns = data;
        
        collections = hymns.reduce((acc, hymn) => {
            if (hymn.content && hymn.content.trim() !== "") {
                const collectionName = hymn.collection || '未分類詩歌';
                if (!acc[collectionName]) {
                    acc[collectionName] = [];
                }
                acc[collectionName].push(hymn);
            }
            return acc;
        }, {});

        displayInitialMessage();
        makeCollectionsClickable();
    })
    .catch(error => {
        resultsDiv.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded-md">
            <p class="font-bold">資料載入錯誤</p>
            <p class="text-sm">無法處理 hymns.json 檔案，可能是檔案格式不正確。</p>
            <p class="text-xs mt-2">錯誤訊息：${error.message}</p>
        </div>`;
        console.error("Fetch Error:", error);
    });

// 讓詩歌集列表可以被點擊的函式
function makeCollectionsClickable() {
    const collectionElements = hymnCollectionsDiv.querySelectorAll('p');
    collectionElements.forEach(p => {
        const text = p.textContent.trim();
        const collectionName = text.substring(text.indexOf(' ')).trim();

        if (collections[collectionName]) {
            p.style.cursor = 'pointer';
            p.addEventListener('click', (e) => {
                e.preventDefault();
                renderHymnList(collectionName);
            });
        }
    });
}

// 顯示特定詩歌集內的詩歌列表
function renderHymnList(collectionName) {
    const hymnsInCollection = collections[collectionName];
    
    searchContainer.classList.add('hidden');
    topControlsContainer.classList.add('hidden');
    hymnCollectionsDiv.classList.add('hidden');
    
    resultsDiv.innerHTML = `
        <button id="backToCollections" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回詩歌集列表</button>
        <h2 class="text-xl font-bold text-center mb-4">${collectionName}</h2>
    `;

    const hymnList = document.createElement('div');
    hymnList.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2';
    
    hymnsInCollection.forEach(hymn => {
        const hymnLink = document.createElement('div');
        hymnLink.className = 'p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors font-size-ui';
        hymnLink.textContent = `${hymn.code} - ${hymn.title}`;
        hymnLink.addEventListener('click', () => renderHymnContent(hymn, collectionName));
        hymnList.appendChild(hymnLink);
    });
    
    resultsDiv.appendChild(hymnList);
    document.getElementById('backToCollections').addEventListener('click', () => {
        displayInitialMessage(true);
    });
}

// 顯示單首詩歌的完整內容
function renderHymnContent(hymn, collectionName) {
    topControlsContainer.classList.remove('hidden'); // 顯示控制項
    // 瀏覽時返回按鈕在左，字體控制在右
    backToHomeBtn.classList.add('hidden'); // 這裡不需要返回首頁按鈕，已有返回列表按鈕
    topControlsContainer.classList.replace('justify-center', 'justify-between');

    resultsDiv.innerHTML = `
        <button id="backToHymnList" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回 "${collectionName}" 列表</button>
        <div class="border-b pb-4">
            <h2 class="text-lg font-semibold text-blue-600 font-size-title">${hymn.code} - ${hymn.title}</h2>
            <p class="text-gray-500 text-sm mt-1 font-size-ui">詩歌集: ${hymn.collection}</p>
            <pre class="mt-4 text-gray-800 whitespace-pre-wrap font-size-content">${hymn.content || '（無歌詞內容）'}</pre>
        </div>
    `;
    document.getElementById('backToHymnList').addEventListener('click', () => {
        topControlsContainer.classList.add('hidden'); // 返回列表時隱藏
        renderHymnList(collectionName);
    });
}

// 搜尋函式
function searchHymns(query) {
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!hymns || hymns.length === 0 || lowerCaseQuery === '') return [];
    
    return hymns.filter(hymn => {
        if (!hymn.content || hymn.content.trim() === '') return false;

        const code = hymn.code ? String(hymn.code).toLowerCase() : '';
        const title = hymn.title ? hymn.title.toLowerCase() : '';
        const content = hymn.content ? hymn.content.toLowerCase() : '';
        return code.includes(lowerCaseQuery) || title.includes(lowerCaseQuery) || content.includes(lowerCaseQuery);
    });
}

// 函式：顯示搜尋結果
function displayResults(results) {
    resultsDiv.innerHTML = '';

    backToHomeBtn.classList.remove('hidden');
    topControlsContainer.classList.replace('justify-center', 'justify-between');
    
    if (results.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'text-center text-gray-500 pt-8 font-size-message';
        noResultsMessage.textContent = '找不到符合條件的詩歌。';
        resultsDiv.appendChild(noResultsMessage);
        return;
    }
    
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

// 輸入事件的監聽器
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query === '') {
        displayInitialMessage(true);
    } else {
        hymnCollectionsDiv.classList.add('hidden');
        const results = searchHymns(query);
        displayResults(results);
    }
});

// 語音辨識功能
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceSearchBtn.addEventListener('click', () => {
        voiceSearchBtn.classList.add('text-blue-600');
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        const inputEvent = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(inputEvent);
    };
    
    recognition.onend = () => {
        voiceSearchBtn.classList.remove('text-blue-600');
    };
    
    recognition.onerror = (event) => {
        console.error('語音辨識錯誤:', event.error);
        voiceSearchBtn.classList.remove('text-blue-600');
    };
    
} else {
    if(voiceSearchBtn) voiceSearchBtn.style.display = 'none';
    console.warn('您的瀏覽器不支援 Web Speech API');
}
