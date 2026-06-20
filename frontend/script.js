const API_BASE = 'http://localhost:8000';
const STORAGE_KEYS = {
    uploads: 'ragPdfRecentUploads',
    messages: 'ragPdfMessages'
};

let selectedFiles = [];
let recentUploads = readStorage(STORAGE_KEYS.uploads, []);
let chatHistory = readStorage(STORAGE_KEYS.messages, []);
let currentSources = [];
let askController = null;
let lastAnswer = '';

const elements = {
    apiStatus: document.getElementById('apiStatus'),
    apiStatusText: document.getElementById('apiStatusText'),
    apiStatusDetail: document.getElementById('apiStatusDetail'),
    uploadForm: document.getElementById('uploadForm'),
    fileInput: document.getElementById('fileInput'),
    dropZone: document.getElementById('dropZone'),
    selectedFiles: document.getElementById('selectedFiles'),
    fileCount: document.getElementById('fileCount'),
    uploadStatus: document.getElementById('uploadStatus'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressBar: document.getElementById('progressBar'),
    progressLabel: document.getElementById('progressLabel'),
    progressPercent: document.getElementById('progressPercent'),
    uploadBtn: document.getElementById('uploadBtn'),
    clearFilesBtn: document.getElementById('clearFilesBtn'),
    recentUploads: document.getElementById('recentUploads'),
    clearUploadsBtn: document.getElementById('clearUploadsBtn'),
    suggestions: document.getElementById('suggestions'),
    chatMessages: document.getElementById('chatMessages'),
    questionForm: document.getElementById('questionForm'),
    questionInput: document.getElementById('questionInput'),
    sendBtn: document.getElementById('sendBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    copyLastBtn: document.getElementById('copyLastBtn'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    sourcesList: document.getElementById('sourcesList'),
    sourceCount: document.getElementById('sourceCount')
};

bindEvents();
renderSelectedFiles();
renderRecentUploads();
renderStoredMessages();
updateSources([]);
checkApiHealth();
setInterval(checkApiHealth, 30000);

elements.questionInput.focus();

function bindEvents() {
    elements.fileInput.addEventListener('change', () => {
        setSelectedFiles(Array.from(elements.fileInput.files));
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
        elements.dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            elements.dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
        elements.dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            elements.dropZone.classList.remove('dragover');
        });
    });

    elements.dropZone.addEventListener('drop', (event) => {
        const files = Array.from(event.dataTransfer.files).filter(isPdfFile);
        setSelectedFiles(files);
        if (files.length > 0) {
            uploadSelectedFiles();
        } else {
            showUploadNotice('Only PDF files can be uploaded.', 'error');
        }
    });

    elements.clearFilesBtn.addEventListener('click', () => setSelectedFiles([]));
    elements.uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        uploadSelectedFiles();
    });

    elements.clearUploadsBtn.addEventListener('click', () => {
        recentUploads = [];
        writeStorage(STORAGE_KEYS.uploads, recentUploads);
        renderRecentUploads();
    });

    elements.questionForm.addEventListener('submit', askQuestion);
    elements.cancelBtn.addEventListener('click', () => {
        if (askController) askController.abort();
    });

    elements.questionInput.addEventListener('input', () => autoResizeTextarea(elements.questionInput));
    elements.questionInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            elements.questionForm.requestSubmit();
        }
    });

    elements.suggestions.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        elements.questionInput.value = button.textContent.trim();
        autoResizeTextarea(elements.questionInput);
        elements.questionInput.focus();
    });

    elements.clearChatBtn.addEventListener('click', clearChat);
    elements.copyLastBtn.addEventListener('click', copyLastAnswer);
}

async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setApiStatus('online', 'Backend online', data.message || 'FastAPI is responding.');
    } catch (error) {
        setApiStatus('offline', 'Backend offline', 'Run: cd backend; uvicorn api:app --reload');
    }
}

function setApiStatus(state, text, detail) {
    elements.apiStatus.dataset.state = state;
    elements.apiStatusText.textContent = text;
    elements.apiStatusDetail.textContent = detail;
}

function setSelectedFiles(files) {
    selectedFiles = files.filter(isPdfFile);
    elements.fileInput.value = '';
    renderSelectedFiles();
}

function isPdfFile(file) {
    return file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
}

function renderSelectedFiles() {
    elements.fileCount.textContent = `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'}`;

    if (selectedFiles.length === 0) {
        elements.selectedFiles.innerHTML = '<p class="muted">No files selected.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'file-list';

    selectedFiles.forEach((file, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
            <span class="file-name">${escapeHtml(file.name)}</span>
            <span class="file-size">${formatBytes(file.size)}</span>
            <button type="button" class="remove-file" aria-label="Remove ${escapeHtml(file.name)}" data-index="${index}">x</button>
        `;
        list.appendChild(item);
    });

    list.addEventListener('click', (event) => {
        const button = event.target.closest('.remove-file');
        if (!button) return;
        selectedFiles.splice(Number(button.dataset.index), 1);
        renderSelectedFiles();
    });

    elements.selectedFiles.replaceChildren(list);
}

async function uploadSelectedFiles() {
    if (selectedFiles.length === 0) {
        showUploadNotice('Choose at least one PDF first.', 'error');
        return;
    }

    const files = [...selectedFiles];
    elements.uploadBtn.disabled = true;
    elements.clearFilesBtn.disabled = true;
    elements.uploadProgress.classList.add('active');
    elements.uploadProgress.setAttribute('aria-hidden', 'false');
    showUploadNotice('', '');

    let completed = 0;
    let failed = 0;

    for (const [index, file] of files.entries()) {
        setProgress((index / files.length) * 100, `Uploading ${file.name}`);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Upload failed');

            completed += 1;
            addRecentUpload(file.name, data.chunks_stored || 0);
        } catch (error) {
            failed += 1;
            addRecentUpload(file.name, 0, error.message);
        }

        setProgress(((index + 1) / files.length) * 100, `Processed ${index + 1} of ${files.length}`);
    }

    if (failed > 0) {
        showUploadNotice(`${completed} uploaded, ${failed} failed. Check recent uploads.`, 'error');
    } else {
        showUploadNotice(`${completed} PDF ${completed === 1 ? 'was' : 'were'} uploaded and indexed.`, 'success');
        setSelectedFiles([]);
    }

    elements.uploadBtn.disabled = false;
    elements.clearFilesBtn.disabled = false;
    setTimeout(() => {
        elements.uploadProgress.classList.remove('active');
        elements.uploadProgress.setAttribute('aria-hidden', 'true');
        setProgress(0, 'Ready');
    }, 900);
}

function setProgress(percent, label) {
    const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
    elements.progressBar.style.width = `${safePercent}%`;
    elements.progressPercent.textContent = `${safePercent}%`;
    elements.progressLabel.textContent = label;
}

function showUploadNotice(message, type) {
    elements.uploadStatus.textContent = message;
    elements.uploadStatus.className = `notice ${type || ''}`.trim();
}

function addRecentUpload(name, chunks, error) {
    recentUploads.unshift({ name, chunks, error, uploadedAt: new Date().toISOString() });
    recentUploads = recentUploads.slice(0, 8);
    writeStorage(STORAGE_KEYS.uploads, recentUploads);
    renderRecentUploads();
}

function renderRecentUploads() {
    if (recentUploads.length === 0) {
        elements.recentUploads.innerHTML = '<p class="muted">Uploaded files will appear here.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'recent-items';

    recentUploads.forEach((upload) => {
        const item = document.createElement('li');
        item.className = upload.error ? 'failed' : 'complete';
        const detail = upload.error ? upload.error : `${upload.chunks} chunks indexed`;
        item.innerHTML = `
            <span class="recent-name">${escapeHtml(upload.name)}</span>
            <span class="recent-detail">${escapeHtml(detail)}</span>
        `;
        list.appendChild(item);
    });

    elements.recentUploads.replaceChildren(list);
}

async function askQuestion(event) {
    event.preventDefault();
    const question = elements.questionInput.value.trim();
    if (!question || askController) return;

    appendMessage('user', question);
    elements.questionInput.value = '';
    autoResizeTextarea(elements.questionInput);
    setAskState(true);

    const loadingMessage = appendMessage('assistant', 'Searching your PDFs and drafting an answer...', true);
    askController = new AbortController();

    try {
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question }),
            signal: askController.signal
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();

        loadingMessage.remove();
        const answer = data.answer || 'No answer was returned.';
        appendMessage('assistant', answer);
        lastAnswer = answer;
        updateSources(data.sources || []);
    } catch (error) {
        loadingMessage.remove();
        const message = error.name === 'AbortError' ? 'Request cancelled.' : `Error: ${error.message}`;
        appendMessage('assistant', message);
        updateSources([]);
    } finally {
        askController = null;
        setAskState(false);
        elements.questionInput.focus();
    }
}

function appendMessage(role, content, loading = false) {
    removeWelcomeMessage();

    const message = document.createElement('article');
    message.className = `message ${role}${loading ? ' loading' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'You' : 'AI';

    const body = document.createElement('div');
    body.className = 'message-body';
    if (loading) {
        body.innerHTML = '<span class="spinner" aria-hidden="true"></span><p></p>';
        body.querySelector('p').textContent = content;
    } else {
        body.textContent = content;
    }

    message.append(avatar, body);
    elements.chatMessages.appendChild(message);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    if (!loading) {
        chatHistory.push({ role, content });
        chatHistory = chatHistory.slice(-30);
        writeStorage(STORAGE_KEYS.messages, chatHistory);
    }

    return message;
}

function removeWelcomeMessage() {
    const welcome = elements.chatMessages.querySelector('.welcome');
    if (welcome) welcome.remove();
}

function renderStoredMessages() {
    if (chatHistory.length === 0) return;
    elements.chatMessages.innerHTML = '';
    chatHistory.forEach((message) => appendMessageFromStorage(message.role, message.content));
    const lastAssistant = [...chatHistory].reverse().find((message) => message.role === 'assistant');
    lastAnswer = lastAssistant ? lastAssistant.content : '';
}

function appendMessageFromStorage(role, content) {
    const message = document.createElement('article');
    message.className = `message ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'You' : 'AI';
    const body = document.createElement('div');
    body.className = 'message-body';
    body.textContent = content;
    message.append(avatar, body);
    elements.chatMessages.appendChild(message);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function clearChat() {
    chatHistory = [];
    lastAnswer = '';
    writeStorage(STORAGE_KEYS.messages, chatHistory);
    updateSources([]);
    elements.chatMessages.innerHTML = `
        <article class="message assistant welcome">
            <div class="avatar" aria-hidden="true">AI</div>
            <div class="message-body">
                <p>Upload one or more PDFs, then ask a question. Answers will cite the chunks used from your documents.</p>
            </div>
        </article>
    `;
}

async function copyLastAnswer() {
    if (!lastAnswer) {
        appendMessage('assistant', 'There is no answer to copy yet.');
        return;
    }

    try {
        await navigator.clipboard.writeText(lastAnswer);
        elements.copyLastBtn.textContent = 'Copied';
        setTimeout(() => {
            elements.copyLastBtn.textContent = 'Copy answer';
        }, 1200);
    } catch (error) {
        appendMessage('assistant', 'Could not copy the answer from this browser context.');
    }
}

function setAskState(isAsking) {
    elements.questionInput.disabled = isAsking;
    elements.sendBtn.disabled = isAsking;
    elements.cancelBtn.hidden = !isAsking;
    elements.sendBtn.textContent = isAsking ? 'Sending' : 'Send';
}

function updateSources(sources) {
    currentSources = sources;
    elements.sourceCount.textContent = String(currentSources.length);

    if (currentSources.length === 0) {
        elements.sourcesList.innerHTML = '<p class="muted center">Sources from the latest answer will appear here.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    currentSources.forEach((source, index) => {
        const item = document.createElement('article');
        item.className = 'source-item';
        item.innerHTML = `
            <span class="source-rank">${index + 1}</span>
            <div>
                <h3>${escapeHtml(source.source || 'Unknown source')}</h3>
                <p>Chunk ${escapeHtml(String(source.chunk_id ?? 'n/a'))}</p>
            </div>
        `;
        fragment.appendChild(item);
    });

    elements.sourcesList.replaceChildren(fragment);
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Local storage can be unavailable in private or restricted contexts.
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
