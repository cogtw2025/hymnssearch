// --- 請用此版本完整取代您的 script.js 檔案 ---

let hymns = [];
let collections = {}; // 用於按詩歌集分組數據

// 獲取頁面上需要操作的核心元素
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const hymnCollectionsDiv = document.getElementById('hymn-collections');
const mainControlsContainer = document.getElementById('main-controls-container'); 
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


// 函式：顯示初始提示訊息 (已更新為可收合版本)
function displayInitialMessage(showUI = true) {
    resultsDiv.innerHTML = `
        <div class="text-center text-gray-500 pt-8 px-4 font-size-message">
            <div id="instruction-toggle" class="inline-block cursor-pointer font-semibold hover:text-blue-500 transition-colors font-size-title">
                使用詩歌搜尋教學 <span id="instruction-arrow" class="inline-block transition-transform text-xs align-middle">▼</span>
            </div>
            <div id="instruction-details" class="hidden mt-4 text-left space-y-2 border-t pt-4">
                <p><strong>- 關鍵字搜尋：</strong> 在上方搜尋框輸入詩歌代碼、名稱或部分歌詞。</p>
                <p><strong>- 詩歌集瀏覽：</strong> 點擊下方的詩歌集列表，瀏覽完整內容。</p>
                <p><strong>- 語音輸入：</strong> 按下麥克風圖示，直接說出您想找的詩歌。</p>
                <p><strong>- 調整字體大小：</strong> 點擊上方的 [+] 或 [-] 按鈕，即可放大或縮小頁面字體。</p>
            </div>
        </div>
    `;

    // 為新的收合元素加上事件監聽
    const toggle = document.getElementById('instruction-toggle');
    const details = document.getElementById('instruction-details');
    const arrow = document.getElementById('instruction-arrow');

    toggle.addEventListener('click', () => {
        const isHidden = details.classList.toggle('hidden');
        arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
    });


    backToHomeBtn.classList.add('hidden');

    if (showUI) {
        mainControlsContainer.classList.remove('hidden');
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
    const collectionElements = hymnCollectionsDiv.querySelectorAll('div > p'); // More specific selector
    collectionElements.forEach(p => {
        const text = p.textContent.trim();
        const collectionName = text.substring(text.indexOf(' ')).trim();

        if (collections[collectionName]) {
            p.parentElement.style.cursor = 'pointer'; // Make the whole card clickable
            p.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                renderHymnList(collectionName);
            });
        }
    });
}

// 顯示特定詩歌集內的詩歌列表
function renderHymnList(collectionName) {
    const hymnsInCollection = collections[collectionName]; 

    mainControlsContainer.classList.add('hidden');
    hymnCollectionsDiv.classList.add('hidden');
    
    resultsDiv.innerHTML = `
        <button id="backToCollections" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回詩歌集列表</button>
        <h2 class="text-xl font-bold text-center mb-4">${collectionName}</h2>
    `;

    const hymnList = document.createElement('div');
    hymnList.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2';
    
    if (hymnsInCollection) {
        hymnsInCollection.forEach(hymn => {
            const hymnLink = document.createElement('div');
            hymnLink.className = 'p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors font-size-ui dark:border-gray-700 dark:hover:bg-gray-800';
            hymnLink.textContent = `${hymn.code} - ${hymn.title}`;
            hymnLink.addEventListener('click', () => renderHymnContent(hymn, collectionName));
            hymnList.appendChild(hymnLink);
        });
    }
    
    resultsDiv.appendChild(hymnList);
    document.getElementById('backToCollections').addEventListener('click', () => {
        displayInitialMessage(true);
    });
}

// 顯示單首詩歌的完整內容
function renderHymnContent(hymn, collectionName) {
    mainControlsContainer.classList.remove('hidden');
    backToHomeBtn.classList.add('hidden');

    resultsDiv.innerHTML = `
        <button id="backToHymnList" class="font-button text-sm border rounded-md px-4 py-2 hover:bg-gray-200 transition-colors w-full mb-4">← 返回 "${collectionName}" 列表</button>
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

// *** NEW: Debounce function for performance improvement ***
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// The actual search logic that will be debounced
const handleSearch = (query) => {
    if (query === '') {
        displayInitialMessage(true);
        return;
    }
    
    // *** NEW: Only search numbers if length is 4 or more ***
    const isNumeric = /^\d+$/.test(query);
    if (isNumeric && query.length < 4) {
        resultsDiv.innerHTML = ''; // Clear results while typing short numbers
        return; // Stop here and don't search
    }

    hymnCollectionsDiv.classList.add('hidden');
    const results = searchHymns(query);
    displayResults(results);
};

// Create a debounced version of the search handler
const debouncedSearchHandler = debounce(handleSearch, 300); // 300ms delay

// Listen for input events and call the debounced handler
searchInput.addEventListener('input', (e) => {
    debouncedSearchHandler(e.target.value.trim());
});


// --- 語音辨識功能 (全新版本) ---
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const voiceMicIcon = document.getElementById('voice-mic-icon');
const voiceStopIcon = document.getElementById('voice-stop-icon');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let isRecognizing = false; // 追蹤辨識狀態

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = true; 
    recognition.interimResults = true;

    voiceSearchBtn.addEventListener('click', () => {
        if (isRecognizing) {
            recognition.stop();
        } else {
            searchInput.value = ''; 
            recognition.start();
        }
    });

    recognition.onstart = () => {
        isRecognizing = true;
        voiceMicIcon.classList.add('hidden');
        voiceStopIcon.classList.remove('hidden');
    };

    recognition.onend = () => {
        isRecognizing = false;
        voiceMicIcon.classList.remove('hidden');
        voiceStopIcon.classList.add('hidden');
        const finalInputEvent = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(finalInputEvent);
    };

    recognition.onerror = (event) => {
        console.error('語音辨識錯誤:', event.error);
        isRecognizing = false;
        voiceMicIcon.classList.remove('hidden');
        voiceStopIcon.classList.add('hidden');
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        searchInput.value = finalTranscript + interimTranscript;
        const inputEvent = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(inputEvent);
    };
    
} else {
    if(voiceSearchBtn) voiceSearchBtn.style.display = 'none';
    console.warn('您的瀏覽器不支援 Web Speech API');
}
