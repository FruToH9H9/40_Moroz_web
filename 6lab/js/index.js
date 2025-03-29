class Block {
    constructor(data) {
        this.data = data;
        this.type = this.constructor.name;
    }

    getHTML() {
        return `<div class="block">${this.data}</div>`;
    }
}

class TextBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        return `<div class="block"><p>${this.data}</p></div>`;
    }
}

class BioBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        return `
        <div class="block">
            <h2>Биография:<br></h2>
            <p>${this.data}</p>
        </div>`
    }
}

class ImageBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        return `
            <div class="block">
                <img id='avatar' src="${this.data}" alt="Image">
                ${this.isEditMode ? '<button class="edit-image-btn">Изменить URL</button>' : ''}
            </div>
        `;
    }
}

class SkillsBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        const skillsList = this.data.map((skill, index) => `<img onclick="renderSkill(${index})" src="${skill}" class="skills-ico">`).join('');
        return `<div class="block skills">${skillsList}</div>
        <div class="block">
            <div id="skill-info">
            </div>
        </div>`;
    }
}

// данные гномика
const built_in_blocks = [
    new TextBlock("Гном Гимли, сын Глоина"),
    new SkillsBlock(["./img/icon2.png", "./img/icon3.png", "./img/icon1.png"]),
    new BioBlock('Гном из рода Дьюрина, член Братства Кольца. Родился в Эреборе, сын Глоина (участника похода Торина Дубощита). Мастер боевого топора, кузнечного дела и пивоварения. В 3018 г. присоединился к Братству Кольца. Прошёл через Морию, сражался в Хельмовой Пади (убил 42 орка), восхитился Галадриэлью. После войны основал гномье королевство в Сияющих Пещерах. Позже, нарушив традиции, отплыл в Валинор с другом-эльфом Леголасом, став единственным гномом, ступившим на Бессмертные Земли."Никто не назовёт меня клятвопреступником или трусом!"'),
    new ImageBlock("https://ae01.alicdn.com/kf/S866953b1bfd54bf8849916dff2b5ce8bo.jpg"),
];

const built_in_skills = [
    ["Боевой топор", "Урон +15", "Шанс крита 20%"],
    ["Кузнечное дело", "Позволяет создать оружие мифического класса"],
    ["Пивоварение", "+50% к продолжительности времени действия зелий"]
]

let blocks = [...built_in_blocks];

let skillInfo = [...built_in_skills];

function renderSkill(index) {
    const descriptionElement = document.getElementById('skill-info');
    descriptionElement.innerHTML = '';
    if (skillInfo[index]) {
        const paramsList = document.createElement('ul');
        paramsList.className = 'skill-params';
        skillInfo[index].forEach(param => {
            const paramItem = document.createElement('li');
            paramItem.textContent = param;
            paramsList.appendChild(paramItem);
        });
        descriptionElement.innerHTML = skillInfo[index].join('<br>');
    } else {
        descriptionElement.textContent = "Информация о навыке отсутствует";
    }
}

function isValidUrl(to_test) {
    let url;
  
    try {
      url = new URL(to_test);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}

function delete_mode(blockElement, index) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Удалить';
    deleteButton.addEventListener('click', () => removeBlock(index));
    blockElement.appendChild(deleteButton);
}

function renderPage() {
    const content = document.getElementById('left-side');
    const content_skills = document.getElementById('skills-side');
    content_skills.innerHTML = '';
    content.innerHTML = '';

    blocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.innerHTML = block.getHTML();

        if (block instanceof SkillsBlock) {
            if (content.classList.contains('edit-mode')) {
                delete_mode(blockElement, index);
            }
            content_skills.appendChild(blockElement);
        } else {
            if (content.classList.contains('edit-mode')) {
                delete_mode(blockElement, index);
            }
            content.appendChild(blockElement);
        }
    });
}


function renderPage() {
    const content = document.getElementById('left-side');
    const content_skills = document.getElementById('skills-side');
    content_skills.innerHTML = '';
    content.innerHTML = '';
    blocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.innerHTML = block.getHTML();
        if (block.type === 'SkillsBlock') {
            if (content.classList.contains('edit-mode')) {delete_mode(blockElement, index)}
            content_skills.appendChild(blockElement)
        }
        else {
            if (content.classList.contains('edit-mode')) {delete_mode(blockElement, index)}
            content.appendChild(blockElement);
        }
    });
}

function editButton(blocks, index, blockElement) {
    const editButton = document.createElement('button');
    editButton.innerText = 'Изменить URL';
    editButton.classList.add('edit-image-btn');
    editButton.addEventListener('click', () => {
        const newUrl = prompt("Введите новый URL:");
        if (newUrl == null) return;
        if (isValidUrl(newUrl)) {
            blocks[index].data = newUrl; 
            saveToLocalStorage();
            renderPage();  
            }
        else {
            alert("Некорректный URL. Пожалуйста, введите правильный URL.");
        }
    });
    blockElement.appendChild(editButton);
}

function toggleEditMode() {
    const content = document.getElementById('content');
    const isEditMode = content.classList.toggle('edit-mode');

    renderPage();

    if (!isEditMode) return;

    const blocksElements = document.querySelectorAll('.block');
    blocksElements.forEach((blockElement, index) => {
        const block = blocks[index];

        if (block instanceof TextBlock || block instanceof BioBlock) {
            const textElement = blockElement.querySelector('p');
            if (textElement) {
                textElement.setAttribute('contenteditable', 'true');
                textElement.addEventListener('blur', () => {
                    blocks[index].data = textElement.innerText;
                    saveToLocalStorage();
                });
            }
        }

        if (block instanceof ImageBlock) {
            editButton(blocks, index, blockElement);
        }

        if (block instanceof SkillsBlock) {
            const skillsImages = blockElement.querySelectorAll('.skills-ico');
            skillsImages.forEach((img, skillIndex) => {
                img.addEventListener('click', () => {
                    const newSkillText = prompt("Введите новое описание навыка:");
                    if (newSkillText) {
                        skillInfo[skillIndex][0] = newSkillText;
                        saveToLocalStorage();
                        renderPage();
                    }
                });
            });
        }

        delete_mode(blockElement, index);
    });
}


function removeBlock(index) {
    if (blocks[index] instanceof SkillsBlock) {
        skillInfo.splice(index, 1); 
    }
    blocks.splice(index, 1);
    renderPage();
    saveToLocalStorage();
}


function saveToLocalStorage() {
    localStorage.setItem('blocks', JSON.stringify(blocks.map(block => ({
        type: block.constructor.name,
        data: block.data
    })))); 
    localStorage.setItem('skillInfo', JSON.stringify(skillInfo));
}

function loadFromLocalStorage() {
    const savedBlocks = localStorage.getItem('blocks');
    const savedSkills = localStorage.getItem('skillInfo');
    if (savedBlocks) {
        blocks = JSON.parse(savedBlocks).map(blockData => {
            switch (blockData.type) {
                case 'TextBlock':
                    return new TextBlock(blockData.data);
                case 'ImageBlock':
                    return new ImageBlock(blockData.data);
                case 'SkillsBlock':
                    return new SkillsBlock(blockData.data);
                case 'BioBlock':
                    return new BioBlock(blockData.data)
                default:
                    return null;
            }
        }).filter(block => block !== null);
    }
    else {
        reset() //если дуралей все удалил, то подгружаем заводские настройки
    }
    if (savedSkills) {
        skillInfo = JSON.parse(savedSkills); 
    }
}

function reset() {
    if (!content.classList.contains('edit-mode')) {
        blocks = [...built_in_blocks];
        skillInfo = [...built_in_skills] 
        renderPage(); 
        saveToLocalStorage(); 
        alert("Данные сброшены до начальных характеристик!");
    }
    else {
        alert("Сначала выйдите из режима редактирования!");
        return;
    }
}


//6 лаба POST PUT GET
//news
async function fetchNews() {
    try {
        const content = document.getElementById("content");
        content.innerHTML = `<div class="block">Загрузка новостей...</div>`;
        
        const cacheKey = 'cachedNews';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(`${cacheKey}_expiry`);
        
        if (cachedData && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
            displayNews(JSON.parse(cachedData));
            returnButton();
            return;
        }
        
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const news = await response.json();
        
        localStorage.setItem(cacheKey, JSON.stringify(news));
        localStorage.setItem(`${cacheKey}_expiry`, Date.now() + 300000);
        
        displayNews(news);
        returnButton();
        
    } catch (error) {
        console.error("News fetch error:", error);
        showNotification(`Ошибка загрузки новостей: ${error.message}`, 'error');
        
        const cachedNews = localStorage.getItem('cachedNews');
        if (cachedNews) {
            displayNews(JSON.parse(cachedNews));
            showNotification("Показаны кэшированные новости", 'warning');
        } else {
            document.getElementById("content").innerHTML = `
                <div class="block">
                    <h3>Новости</h3>
                    <p>Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>
                    <button onclick="fetchNews()">Попробовать снова</button>
                </div>
            `;
        }
    }
}

function displayNews(news) {
    const content = document.getElementById("content");
    hideMainContent();
    
    content.innerHTML = `
        <div class="block">
            <h2>Последние новости</h2>
            <div class="news-container">
                ${news.map(post => `
                    <article class="news-card">
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <small>ID: ${post.id}</small>
                    </article>
                `).join('')}
            </div>
            <button class="refresh-btn" onclick="fetchNews()">Обновить новости</button>
        </div>
    `;
}

//profile
async function fetchProfile() {
    try {
        showLoading("content", "Загрузка профиля...");
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const profile = await response.json();
        displayProfile(profile);
        returnButton();
        
    } catch (error) {
        console.error("Profile fetch error:", error);
        showNotification(`Ошибка загрузки профиля: ${error.message}`, 'error');
        
        document.getElementById("content").innerHTML = `
            <div class="block">
                <h3>Профиль</h3>
                <p>Не удалось загрузить профиль.</p>
                <button onclick="fetchProfile()">Попробовать снова</button>
            </div>
        `;
    }
}

async function updateProfile() {
    const profile = await (await fetch("https://jsonplaceholder.typicode.com/users/1")).json();
    
    const newName = prompt("Введите новое имя:", profile.name);
    if (newName === null) return;
    
    if (!newName.trim()) {
        showNotification("Имя не может быть пустым!", 'error');
        return;
    }

    try {
        showLoading("content", "Обновление профиля...");
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const updatedProfile = await response.json();
        displayProfile(updatedProfile);
        showNotification("Профиль успешно обновлен!", 'success');
        
    } catch (error) {
        console.error("Update error:", error);
        showNotification(`Ошибка обновления: ${error.message}`, 'error');
        fetchProfile();
    }
}

function displayProfile(profile) {
    const content = document.getElementById("content");
    hideMainContent();
    
    content.innerHTML = `
        <div class="block profile-card">
            <div class="profile-header">
                <h2>${profile.name}</h2>
                <span class="username">@${profile.username}</span>
            </div>
            
            <div class="profile-details">
                <p><strong>📧 Email:</strong> ${profile.email}</p>
                <p><strong>📞 Телефон:</strong> ${profile.phone}</p>
                <p><strong>🏠 Адрес:</strong> ${profile.address.city}, ${profile.address.street}</p>
                <p><strong>💼 Компания:</strong> ${profile.company.name}</p>
                <p><strong>🌐 Сайт:</strong> <a href="http://${profile.website}" target="_blank">${profile.website}</a></p>
            </div>
            
            <div class="profile-actions">
                <button onclick="updateProfile()">✏️ Редактировать</button>
                <button onclick="fetchFriends()">👥 Посмотреть друзей</button>
            </div>
        </div>
    `;
}

//friends
async function fetchFriends() {
    try {
        showLoading("content", "Загрузка друзей...");
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const friends = await response.json();
        displayFriends(friends.slice(0, 3));
        returnButton();
        
    } catch (error) {
        console.error("Friends fetch error:", error);
        showNotification(`Ошибка загрузки друзей: ${error.message}`, 'error');
        
        document.getElementById("content").innerHTML = `
            <div class="block">
                <h3>Друзья</h3>
                <p>Не удалось загрузить список друзей.</p>
                <button onclick="fetchFriends()">Попробовать снова</button>
            </div>
        `;
    }
}

function displayFriends(friends) {
    const content = document.getElementById("content");
    hideMainContent();
    
    if (!friends || friends.length === 0) {
        content.innerHTML = `
            <div class="block">
                <h3>Друзья</h3>
                <p>Список друзей пуст.</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <div class="block">
            <h2>Мои друзья</h2>
            <div class="friends-grid">
                ${friends.map(friend => `
                    <div class="friend-card">
                        <h3>${friend.name}</h3>
                        <p>📧 ${friend.email}</p>
                        <p>🏙 ${friend.address.city}</p>
                        <button onclick="viewFriend(${friend.id})">👀 Профиль</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function viewFriend(id) {
    alert(`Здесь будет подробный профиль друга с ID ${id}`);
}

function hideMainContent() {
    document.getElementById("left-side").style.display = "none";
    document.getElementById("skills-side").style.display = "none";
    document.getElementById("content").style.display = "block";
}

function showLoading(elementId, message = "Загрузка...") {
    document.getElementById(elementId).innerHTML = `
        <div class="block loading">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}


document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
document.getElementById('reset').addEventListener('click', reset)
document.getElementById("nav-news").addEventListener("click", fetchNews);
document.getElementById("nav-profile").addEventListener("click", fetchProfile);
document.getElementById("nav-friends").addEventListener("click", fetchFriends);

window.onload = () => {
    loadFromLocalStorage();
    renderPage();
};