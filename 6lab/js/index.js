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
function hideMainContent() {
    document.getElementById("left-side").style.display = "none";
    document.getElementById("skills-side").style.display = "none";
    document.getElementById("content").style.display = "block";
}

function showMainContent() {
    document.getElementById("left-side").style.display = "block";
    document.getElementById("skills-side").style.display = "block";
    document.getElementById("content").style.display = "none";
}

async function fetchNews() {
    try {
        const content = document.getElementById("content");
        content.innerHTML = `<div class="block">Загрузка новостей...</div>`;

        const cacheKey = 'cachedNews';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(`${cacheKey}_expiry`);

        if (cachedData && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
            displayNews(JSON.parse(cachedData));
            return;
        }

        const API_KEY = "2652e88261e5eae8155512c7b5a58df9"; 
        const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=3&apikey=${API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const news = data.articles;
        
        localStorage.setItem(cacheKey, JSON.stringify(news));
        localStorage.setItem(`${cacheKey}_expiry`, Date.now() + 300000);
        
        displayNews(news);
        
    } catch (error) {
        console.error("News fetch error:", error);
        
        const fallbackNews = [
            {
                title: "Новости не загрузились",
                description: "Используются тестовые данные",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Попробуйте позже",
                description: "Сервер новостей временно недоступен",
                url: "#",
                publishedAt: new Date().toISOString()
            }
        ];
        displayNews(fallbackNews);
        showNotification("Используются тестовые данные", 'warning');
    }
}

async function fetchProfile() {
    try {
        const response = await fetch("https://randomuser.me/api/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const profile = data.results[0];
        displayProfile(profile);
        
    } catch (error) {
        console.error("Profile fetch error:", error);
        const fallbackProfile = {
            name: { first: "Гном", last: "Гимли" },
            email: "gimli@erebor.com",
            phone: "+1 234 567 890",
            location: { city: "Эребор", street: { name: "Тайная улица", number: 42 } },
            login: { username: "gimli_son_of_gloin" },
            picture: { large: "https://randomuser.me/api/portraits/men/75.jpg" }
        };
        displayProfile(fallbackProfile);
    }
}

function viewFriend(username) {
    const content = document.getElementById("content");
    hideMainContent();
    
    const friend = skillInfo.find(friend => friend[0] === username);
    
    if (!friend) {
        content.innerHTML = `<div class="block">Профиль не найден</div>`;
        return;
    }
    
    content.innerHTML = `
        <div class="block profile-card">
            <div class="profile-header">
                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Аватар" class="profile-avatar">
                <h2>${friend[0]}</h2>
                <span class="username">@${username}</span>
            </div>
            <div class="profile-details">
                <p><strong>📧 Email:</strong> example@example.com</p>
                <p><strong>📞 Телефон:</strong> +123456789</p>
                <p><strong>🏠 Город:</strong> Город Друзей</p>
            </div>
            <div class="profile-actions">
                <button onclick="fetchFriends()">👥 Назад к друзьям</button>
            </div>
        </div>
    `;
}

function updateProfile() {
    const content = document.getElementById("content");
    const name = prompt("Введите новое имя:", "Гном Гимли");
    const email = prompt("Введите новый email:", "gimli@erebor.com");
    const phone = prompt("Введите новый телефон:", "+1 234 567 890");
    const city = prompt("Введите новый город:", "Эребор");
    
    if (!name || !email || !phone || !city) {
        alert("Все поля должны быть заполнены!");
        return;
    }
    
    content.innerHTML = `
        <div class="block profile-card">
            <div class="profile-header">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Аватар" class="profile-avatar">
                <h2>${name}</h2>
                <span class="username">@gimli_son_of_gloin</span>
            </div>
            <div class="profile-details">
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📞 Телефон:</strong> ${phone}</p>
                <p><strong>🏠 Город:</strong> ${city}</p>
            </div>
            <div class="profile-actions">
                <button onclick="fetchFriends()">👥 Назад к друзьям</button>
            </div>
        </div>
    `;
    showNotification("Профиль обновлен", 'success');
}



async function fetchFriends() {
    try {
        const response = await fetch("https://randomuser.me/api/?results=3");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        displayFriends(data.results);
        
    } catch (error) {
        console.error("Friends fetch error:", error);
        const fallbackFriends = [
            {
                name: { first: "Леголас", last: "Зеленолист" },
                email: "legolas@mirkwood.com",
                location: { city: "Лихолесье" },
                login: { username: "elf_archer" },
                picture: { medium: "https://randomuser.me/api/portraits/men/1.jpg" }
            },
            {
                name: { first: "Арагорн", last: "Элессар" },
                email: "aragorn@gondor.com",
                location: { city: "Минас Тирит" },
                login: { username: "strider" },
                picture: { medium: "https://randomuser.me/api/portraits/men/2.jpg" }
            }
        ];
        displayFriends(fallbackFriends);
    }
}

function displayNews(news) {
    const content = document.getElementById("content");
    hideMainContent();
    
    content.innerHTML = `
        <div class="block">
            <h2>Последние новости</h2>
            <div class="news-container">
                ${news.map((post, index) => `
                    <article class="news-card">
                        <h3>${post.title || `Новость ${index + 1}`}</h3>
                        <p>${post.description || "Описание отсутствует"}</p>
                        ${post.url ? `<a href="${post.url}" target="_blank">Читать далее</a>` : ''}
                        <small>${new Date(post.publishedAt || new Date()).toLocaleDateString()}</small>
                    </article>
                `).join('')}
            </div>
            <button class="refresh-btn" onclick="fetchNews()">Обновить новости</button>
        </div>
    `;
}

function displayProfile(profile) {
    const content = document.getElementById("content");
    hideMainContent();
    
    content.innerHTML = `
        <div class="block profile-card">
            <div class="profile-header">
                <img src="${profile.picture?.large || 'https://via.placeholder.com/150'}" alt="Аватар" class="profile-avatar">
                <h2>${profile.name?.first || 'Имя'} ${profile.name?.last || 'Фамилия'}</h2>
                <span class="username">@${profile.login?.username || 'username'}</span>
            </div>
            
            <div class="profile-details">
                <p><strong>📧 Email:</strong> ${profile.email || 'Не указан'}</p>
                <p><strong>📞 Телефон:</strong> ${profile.phone || 'Не указан'}</p>
                <p><strong>🏠 Адрес:</strong> ${profile.location?.city || 'Город'}, ${profile.location?.street?.name || 'Улица'} ${profile.location?.street?.number || ''}</p>
                <p><strong>🌐 Сайт:</strong> <a href="#" target="_blank">${profile.email?.split('@')[1] || 'example.com'}</a></p>
            </div>
            
            <div class="profile-actions">
                <button onclick="updateProfile()">✏️ Редактировать</button>
                <button onclick="fetchFriends()">👥 Посмотреть друзей</button>
            </div>
        </div>
    `;
}

function displayFriends(friends) {
    const content = document.getElementById("content");
    hideMainContent();
    
    content.innerHTML = `
        <div class="block">
            <h2>Мои друзья</h2>
            <div class="friends-grid">
                ${friends.map(friend => `
                    <div class="friend-card">
                        <img src="${friend.picture?.medium || 'https://via.placeholder.com/100'}" alt="Аватар">
                        <h3>${friend.name?.first || 'Имя'} ${friend.name?.last || 'Фамилия'}</h3>
                        <p>📧 ${friend.email || 'Не указан'}</p>
                        <p>🏙 ${friend.location?.city || 'Город'}</p>
                        <button onclick="viewFriend('${friend.login?.username || 'id'}')">👀 Профиль</button>
                    </div>
                `).join('')}
            </div>
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