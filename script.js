// Memory storage (using localStorage for persistence)
let memories = JSON.parse(localStorage.getItem('memories')) || [];
let letters = JSON.parse(localStorage.getItem('letters')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeUpload();
    initializeTimeline();
    loadTimeline();
    loadLetters();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Upload functionality
function initializeUpload() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const uploadContents = document.querySelectorAll('.upload-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            uploadContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            btn.classList.add('active');

            // Show corresponding content
            const targetContent = document.querySelector(`#${btn.dataset.tab}Upload`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Media upload
    const mediaUploadArea = document.getElementById('mediaUploadArea');
    const mediaInput = document.getElementById('mediaInput');
    const uploadMediaBtn = document.getElementById('uploadMediaBtn');

    // Set default date to today
    document.getElementById('mediaDate').valueAsDate = new Date();
    document.getElementById('letterDate').valueAsDate = new Date();

    // Click to upload
    mediaUploadArea.addEventListener('click', () => {
        mediaInput.click();
    });

    // Drag and drop functionality
    mediaUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        mediaUploadArea.style.background = 'rgba(102, 126, 234, 0.2)';
    });

    mediaUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        mediaUploadArea.style.background = '';
    });

    mediaUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        mediaUploadArea.style.background = '';
        const files = e.dataTransfer.files;
        handleMediaFiles(files);
    });

    // File input change
    mediaInput.addEventListener('change', (e) => {
        handleMediaFiles(e.target.files);
    });

    // Upload button
    uploadMediaBtn.addEventListener('click', uploadMedia);

    // Letter upload
    document.getElementById('uploadLetterBtn').addEventListener('click', uploadLetter);
}

// Handle media files
function handleMediaFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Display preview (optional - you can add preview functionality here)
                console.log('File loaded:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Upload media
function uploadMedia() {
    const title = document.getElementById('mediaTitle').value.trim();
    const description = document.getElementById('mediaDescription').value.trim();
    const date = document.getElementById('mediaDate').value;
    const files = document.getElementById('mediaInput').files;

    if (!date) {
        alert('Please select a date');
        return;
    }

    if (files.length === 0) {
        alert('Please select at least one file');
        return;
    }

    const mediaFiles = [];
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            mediaFiles.push({
                name: file.name,
                type: file.type,
                data: e.target.result,
                size: file.size
            });

            filesProcessed++;
            if (filesProcessed === files.length) {
                const memory = {
                    id: Date.now(),
                    type: 'media',
                    title: title || 'Untitled',
                    description: description || '',
                    date: date,
                    uploadDate: new Date().toISOString(),
                    files: mediaFiles
                };

                memories.push(memory);
                saveMemories();
                clearMediaForm();
                loadTimeline();

                // Switch to timeline view
                document.querySelector('.nav-link[href="#timeline"]').click();
                alert('Media uploaded successfully!');
            }
        };
        reader.readAsDataURL(file);
    });
}

// Upload letter
function uploadLetter() {
    const title = document.getElementById('letterTitle').value.trim();
    const content = document.getElementById('letterContent').value.trim();
    const date = document.getElementById('letterDate').value;

    if (!title) {
        alert('Please enter a title');
        return;
    }

    if (!content) {
        alert('Please write your letter');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    const letter = {
        id: Date.now(),
        title: title,
        content: content,
        date: date,
        uploadDate: new Date().toISOString()
    };

    letters.push(letter);
    saveLetters();
    clearLetterForm();
    loadLetters();

    // Switch to letters view
    document.querySelector('.nav-link[href="#letters"]').click();
    alert('Letter saved successfully!');
}

// Clear forms
function clearMediaForm() {
    document.getElementById('mediaTitle').value = '';
    document.getElementById('mediaDescription').value = '';
    document.getElementById('mediaDate').valueAsDate = new Date();
    document.getElementById('mediaInput').value = '';
}

function clearLetterForm() {
    document.getElementById('letterTitle').value = '';
    document.getElementById('letterContent').value = '';
    document.getElementById('letterDate').valueAsDate = new Date();
}

// Timeline functionality
function initializeTimeline() {
    const timeInterval = document.getElementById('timeInterval');
    const customRange = document.getElementById('customRange');
    const applyFilter = document.getElementById('applyFilter');

    timeInterval.addEventListener('change', () => {
        if (timeInterval.value === 'custom') {
            customRange.classList.remove('hidden');
        } else {
            customRange.classList.add('hidden');
            filterTimeline();
        }
    });

    applyFilter.addEventListener('click', filterTimeline);
}

// Filter timeline
function filterTimeline() {
    const interval = document.getElementById('timeInterval').value;
    const now = new Date();
    let startDate, endDate;

    switch (interval) {
        case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'quarter':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        case 'custom':
            startDate = new Date(document.getElementById('startDate').value);
            endDate = new Date(document.getElementById('endDate').value);
            if (!startDate || !endDate) {
                alert('Please select both start and end dates');
                return;
            }
            break;
        default:
            loadTimeline();
            return;
    }

    if (!endDate) endDate = now;

    const filteredMemories = memories.filter(memory => {
        const memoryDate = new Date(memory.date);
        return memoryDate >= startDate && memoryDate <= endDate;
    });

    renderTimeline(filteredMemories);
}

// Load timeline
function loadTimeline() {
    renderTimeline(memories);
}

// Render timeline
function renderTimeline(memoriesToShow) {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    if (memoriesToShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No memories found for the selected time period.</p>';
        return;
    }

    // Sort memories by date (newest first)
    const sortedMemories = memoriesToShow.sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedMemories.forEach(memory => {
        const timelineItem = createTimelineItem(memory);
        container.appendChild(timelineItem);
    });
}

// Create timeline item
function createTimelineItem(memory) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.dataset.id = memory.id;

    const date = new Date(memory.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    item.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">
            <h3>${memory.title} <span class="edit-btn" onclick="editMemory(${memory.id})" style="cursor: pointer; font-size: 0.8em; color: #667eea;">✏️</span></h3>
            <p>${memory.description}</p>
            ${memory.files ? createMediaGrid(memory.files, memory.id) : ''}
        </div>
    `;

    return item;
}

// Create media grid
function createMediaGrid(files, memoryId) {
    if (!files || files.length === 0) return '';

    let html = '<div class="media-grid">';

    files.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const element = isVideo ? 'video' : 'img';
        const controls = isVideo ? 'controls' : '';

        html += `
            <div class="media-item" onclick="openMediaModal('${file.data}', '${file.type}', '${file.name}')">
                <${element} src="${file.data}" alt="${file.name}" ${controls}></${element}>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// Edit memory functionality
function editMemory(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    const newTitle = prompt('Edit title:', memory.title);
    if (newTitle === null) return;

    const newDescription = prompt('Edit description:', memory.description);
    if (newDescription === null) return;

    const newDate = prompt('Edit date (YYYY-MM-DD):', memory.date);
    if (newDate === null) return;

    // Validate date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Please enter date in YYYY-MM-DD format');
        return;
    }

    memory.title = newTitle.trim() || memory.title;
    memory.description = newDescription.trim();
    memory.date = newDate;

    saveMemories();
    loadTimeline();
    alert('Memory updated successfully!');
}

// Modal functionality
function openMediaModal(src, type, name) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('mediaModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mediaModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="closeMediaModal()">×</button>
                <div id="modalMediaContainer"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const container = document.getElementById('modalMediaContainer');
    const isVideo = type.startsWith('video/');
    const element = isVideo ? 'video' : 'img';
    const controls = isVideo ? 'controls autoplay' : '';

    container.innerHTML = `<${element} src="${src}" alt="${name}" ${controls}></${element}>`;
    modal.style.display = 'block';

    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeMediaModal();
        }
    };
}

function closeMediaModal() {
    const modal = document.getElementById('mediaModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load letters
function loadLetters() {
    const container = document.getElementById('lettersContainer');
    container.innerHTML = '';

    if (letters.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No letters written yet. Start writing your first letter!</p>';
        return;
    }

    // Sort letters by date (newest first)
    const sortedLetters = letters.sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedLetters.forEach(letter => {
        const letterCard = createLetterCard(letter);
        container.appendChild(letterCard);
    });
}

// Create letter card
function createLetterCard(letter) {
    const card = document.createElement('div');
    card.className = 'letter-card';
    card.dataset.id = letter.id;

    const date = new Date(letter.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const preview = letter.content.length > 150 ?
        letter.content.substring(0, 150) + '...' :
        letter.content;

    card.innerHTML = `
        <h3>${letter.title} <span class="edit-btn" onclick="editLetter(${letter.id})" style="cursor: pointer; font-size: 0.8em; color: #667eea;">✏️</span></h3>
        <p class="letter-preview">${preview}</p>
        <div class="letter-date">${formattedDate}</div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('edit-btn')) {
            openLetterModal(letter);
        }
    });

    return card;
}

// Edit letter functionality
function editLetter(letterId) {
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;

    const newTitle = prompt('Edit title:', letter.title);
    if (newTitle === null) return;

    const newContent = prompt('Edit content:', letter.content);
    if (newContent === null) return;

    const newDate = prompt('Edit date (YYYY-MM-DD):', letter.date);
    if (newDate === null) return;

    // Validate date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Please enter date in YYYY-MM-DD format');
        return;
    }

    letter.title = newTitle.trim() || letter.title;
    letter.content = newContent.trim() || letter.content;
    letter.date = newDate;

    saveLetters();
    loadLetters();
    alert('Letter updated successfully!');
}

// Open letter modal
function openLetterModal(letter) {
    let modal = document.getElementById('letterModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'letterModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="closeLetterModal()">×</button>
                <div id="modalLetterContainer"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const container = document.getElementById('modalLetterContainer');
    const date = new Date(letter.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    container.innerHTML = `
        <h2 style="color: #667eea; margin-bottom: 1rem;">${letter.title}</h2>
        <p style="color: #999; margin-bottom: 2rem; text-align: right;">${date}</p>
        <div style="line-height: 1.8; white-space: pre-wrap;">${letter.content}</div>
    `;

    modal.style.display = 'block';

    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeLetterModal();
        }
    };
}

function closeLetterModal() {
    const modal = document.getElementById('letterModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Storage functions
function saveMemories() {
    localStorage.setItem('memories', JSON.stringify(memories));
}

function saveLetters() {
    localStorage.setItem('letters', JSON.stringify(letters));
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeMediaModal();
        closeLetterModal();
    }
});

// Service worker for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}