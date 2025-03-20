class Block {
    constructor(data) {
        this.data = data;
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

class ImageBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        return `
            <div class="block">
                <img src="${this.data}" alt="Image">
                ${this.isEditMode ? '<button class="edit-image-btn">Изменить URL</button>' : ''}
            </div>
        `;
    }
}

class LinkBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        return `<div class="block"><a href="${this.data.url}" target="_blank">${this.data.text}</a></div>`;
    }
}

class SkillsBlock extends Block {
    constructor(data) {
        super(data);
    }

    getHTML() {
        const skillsList = this.data.map(skill => `<li>${skill}</li>`).join('');
        return `<div class="block"><h3>Навыки:</h3><ul>${skillsList}</ul></div>`;
    }
}

// данные гномика
const built_in_blocks = [
    new TextBlock("Гном Гимли, сын Глоина"),
    new ImageBlock("https://ae01.alicdn.com/kf/S866953b1bfd54bf8849916dff2b5ce8bo.jpg"),
    new TextBlock("Гном из рода Дьюрина, один из членов Братства Кольца."),
    new SkillsBlock(["Боевой топор", "Кузнечное дело", "Пивоварение"]),
    new LinkBlock({ url: "https://vedmak.fandom.com/wiki/%D0%93%D0%B5%D1%80%D0%B0%D0%BB%D1%8C%D1%82_%D0%B8%D0%B7_%D0%A0%D0%B8%D0%B2%D0%B8%D0%B8", text: "Профиль в гильдии" })
];

let blocks = [...built_in_blocks];

function isValidUrl(to_test) {
    let url;
  
    try {
      url = new URL(to_test);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function renderPage() {
    console.log("Перерисовка страницы!");
    const content = document.getElementById('content');
    content.innerHTML = '';
    blocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.innerHTML = block.getHTML();
        if (content.classList.contains('edit-mode')) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Удалить';
            deleteButton.addEventListener('click', () => removeBlock(index));
            blockElement.appendChild(deleteButton);
        }
        content.appendChild(blockElement);
    });
}

function toggleEditMode() {
    const content = document.getElementById('content');
    const isEditMode = content.classList.toggle('edit-mode');

    if (!isEditMode) {
        renderPage();
        return;
    }

    const blocksElements = content.querySelectorAll('.block');
    blocksElements.forEach((blockElement, index) => {
        if (content.classList.contains('edit-mode')) {
            const textElement = blockElement.querySelector('p');
            if (textElement) {
                textElement.setAttribute('contenteditable', 'true');
                textElement.addEventListener('blur', () => {
                    blocks[index].data = textElement.innerText;
                    saveToLocalStorage();
                });
            }

            const imageElement = blockElement.querySelector('img');
            if (imageElement) {
                const editButton = document.createElement('button');
                editButton.innerText = 'Изменить URL';
                editButton.classList.add('edit-image-btn');
                editButton.addEventListener('click', () => {
                    const newUrl = prompt("Введите новый URL изображения:");
                    if (newUrl == null) return;
                    if (checkURL(newUrl)) {
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
            
            const profileElement = blockElement.querySelector('a');
            if (profileElement) {
                const editButton = document.createElement('button');
                editButton.innerText = 'Изменить URL';
                editButton.classList.add('edit-profile-btn');
                editButton.addEventListener('click', () => {
                    const newUrl = prompt("Введите новый URL профиля:");
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

            const listItems = blockElement.querySelectorAll('li');
            if (listItems.length > 0) {
                listItems.forEach((li, skillIndex) => {
                    li.setAttribute('contenteditable', 'true');
                    li.addEventListener('blur', () => {
                        blocks[index].data[skillIndex] = li.innerText;
                        saveToLocalStorage();
                    });
                });
            }

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Удалить';
            deleteButton.addEventListener('click', () => removeBlock(index));
            blockElement.appendChild(deleteButton);
        } 
        else {
            const textElement = blockElement.querySelector('p');
            if (textElement) {
                textElement.setAttribute('contenteditable', 'false');
            }
        }
    });
}

function addBlock() {
    const blockType = prompt("Введите тип блока (text, img, link, skills):");
    let data;
    switch (blockType) {
        case 'text':
            data = prompt("Введите текст:");
            blocks.push(new TextBlock(data));
            break;

        case 'img':
            data = prompt("Введите URL изображения:");
            if (checkURL(data)) {
                blocks.push(new ImageBlock(data));
            }
            else {
                alert("Проверьте правильность ссылки!");
                return;
            }
            break;

        case 'link':
            const url = prompt("Введите URL:");
            const text = prompt("Введите текст ссылки:");

            if (isValidUrl(url)) {
                blocks.push(new LinkBlock({ url, text }));
            }
            else {
                alert("Проверьте правильность ссылки!");
                return;
            }

            break;
        case 'skills':
            const skills = prompt("Введите навыки через запятую:").split(',');
            blocks.push(new SkillsBlock(skills));
            break;

        case null:
            return;

        default:
            alert("Неверный тип блока!");
            return;
    }
    renderPage();
    saveToLocalStorage();
}

function removeBlock(index) {
    blocks.splice(index, 1);
    renderPage();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('blocks', JSON.stringify(blocks.map(block => ({
        type: block.constructor.name,
        data: block.data
    })))); 
}

function loadFromLocalStorage() {
    const savedBlocks = localStorage.getItem('blocks');
    if (savedBlocks) {
        blocks = JSON.parse(savedBlocks).map(blockData => {
            switch (blockData.type) {
                case 'TextBlock':
                    return new TextBlock(blockData.data);
                case 'ImageBlock':
                    return new ImageBlock(blockData.data);
                case 'LinkBlock':
                    return new LinkBlock(blockData.data);
                case 'SkillsBlock':
                    return new SkillsBlock(blockData.data);
                default:
                    return null;
            }
        }).filter(block => block !== null);
    }
    else {
        blocks = [...built_in_blocks] //если дуралей все удалил, то подгружаем заводские настройки
    }
}

function reset() {
    if (!content.classList.contains('edit-mode')) {
        blocks = [...built_in_blocks]; 
        renderPage(); 
        saveToLocalStorage(); 
        alert("Данные сброшены до начальных характеристик!");
    }
    else {
        alert("Сначала выйдите из режима редактирования!");
        return;
    }
}

document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
document.getElementById('add-block').addEventListener('click', addBlock);
document.getElementById('reset').addEventListener('click', reset)

window.onload = () => {
    loadFromLocalStorage();
    renderPage();
};