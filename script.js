// --- 請用此版本完整取代您的 script.js 檔案 ---

let hymns = [];

// 字體大小控制邏輯
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const fontButtons = {
        small: document.getElementById('font-small'),
        medium: document.getElementById('font-medium'),
        large: document.getElementById('font-large'),
    };

    function applyFontSize(size) {
        mainContent.classList.remove('font-small', 'font-medium', 'font-large');
        mainContent.classList.add(`font-${size}`);
        for (const key in fontButtons) {
            fontButtons[key].classList.remove('active');
        }
        fontButtons[size].classList.add('active');
        localStorage.setItem('hymnFontSize', size);
    }

    const savedSize = localStorage.getItem('hymnFontSize') || 'medium';
    applyFontSize(savedSize);

    fontButtons.small.addEventListener('click', () => applyFontSize('small'));
    fontButtons.medium.addEventListener('click', () => applyFontSize('medium'));
    fontButtons.large.addEventListener('click', () => applyFontSize('large'));
});

// 函式：顯示初始提示訊息
function displayInitialMessage() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="text-center text-gray-500 pt-8 px-4 font-size-message">
            <h3 class="text-lg font-semibold">歡迎使用詩歌搜尋</h3>
            <p class="mt-2">請在上方搜尋框中，輸入詩歌的<br>代碼、名稱、或部分歌詞來開始搜尋。</p>
        </div>
    `;
}

// 函式：資料載入
fetch('hymns.json')
    .then(response => {
        if (!response.ok) throw new Error('無法載入 hymns.json，請檢查檔案路徑或網路連線。');
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            hymns = data;
        } else {
            Object.keys(data).forEach(group => {
                if (Array.isArray(data[group])) {
                    data[group].forEach(hymn => {
                        hymns.push({ ...hymn, group });
                    });
                }
            });
        }
        displayInitialMessage();
    })
    .catch(error => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded-md">
            <p class="font-bold">資料載入錯誤</p>
            <p class="text-sm">無法處理 hymns.json 檔案，可能是檔案格式不正確。</p>
            <p class="text-xs mt-2">錯誤訊息：${error.message}</p>
        </div>`;
        console.error("Fetch Error:", error);
    });

// 搜尋函式
function searchHymns(query) {
    const lowerCaseQuery = query.toLowerCase();
    if (!hymns || hymns.length === 0) return [];
    
    return hymns.filter(hymn => {
        const code = hymn.code ? String(hymn.code).toLowerCase() : '';
        const title = hymn.title ? hymn.title.toLowerCase() : '';
        const content = hymn.content ? hymn.content.toLowerCase() : '';
        return code.includes(lowerCaseQuery) || title.includes(lowerCaseQuery) || content.includes(lowerCaseQuery);
    });
}

// 函式：顯示搜尋結果
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center text-gray-500 pt-8 font-size-message">找不到符合條件的詩歌。</p>';
        return;
    }
    
    results.forEach(hymn => {
        const hymnDiv = document.createElement('div');
        hymnDiv.className = 'border-b pb-4';
        hymnDiv.innerHTML = `
            <h2 class="text-lg font-semibold text-blue-600 font-size-title">${hymn.code} - ${hymn.title}（第 ${hymn.group} 集）</h2>
            <pre class="text-sm whitespace-pre-wrap font-size-content">${hymn.content}</pre>
        `;
        resultsDiv.appendChild(hymnDiv);
    });
}

// ***** 主要修改處：更新輸入事件的監聽器 *****

// 先取得詩歌集列表的元素
const hymnCollectionsDiv = document.getElementById('hymn-collections');

document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query === '') {
        // 當搜尋框為空時...
        displayInitialMessage();
        // **新增**：顯示詩歌集列表
        if (hymnCollectionsDiv) {
            hymnCollectionsDiv.classList.remove('hidden');
        }
    } else {
        // 當搜尋框有文字時...
        const results = searchHymns(query);
        displayResults(results);
        // **新增**：隱藏詩歌集列表
        if (hymnCollectionsDiv) {
            hymnCollectionsDiv.classList.add('hidden');
        }
    }
});

// 語音辨識功能
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const searchInput = document.getElementById('searchInput');
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