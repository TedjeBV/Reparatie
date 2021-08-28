// Session object to store data
const session = {};

session.language = 'nl';

// Renderer functions
function render(data) {

    data[session.language].forEach(category => {
        const container = renderCategory(category);
        document.getElementById('categories').appendChild(container);
    });

};

function renderCategory(category) {

    // Container
    const container = document.createElement('div');
    container.classList.add('category-container');
    container.setAttribute('tabindex', '1');

    // Header
    const header = document.createElement('h3');
    header.innerText = getTranslation(category.type, true);
    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.classList.add('category-content');
    container.appendChild(content);

    // Categories
    category.categories.forEach(subcategory => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('subcategory-container');

        const categoryHeader = document.createElement('h4');
        categoryHeader.innerText = getTranslation(subcategory.type, true);

        const categoryContent = document.createElement('div');
        categoryContent.classList.add('subcategory-content');

        // Guides
        const guides = document.createElement('ul');

        subcategory.files.forEach(guide => {
            const guideContainer = document.createElement('li');
            guideContainer.classList.add('guide');
            
            const guideLink = document.createElement('a');
            guideLink.classList.add('guide-link');
            guideLink.href = `guide.html?guide=${guide.path}`;
            guideLink.innerText = guide.name;

            guideContainer.appendChild(guideLink);

            guides.appendChild(guideContainer);
        });

        categoryContent.appendChild(guides);

        categoryContainer.appendChild(categoryHeader);
        categoryContainer.appendChild(categoryContent);

        content.appendChild(categoryContainer);
    });

    return container;

};

// Main function
function main() {

    render(session.data);

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/translation.json').then(r => r.json()).then(json => session.translation = json),
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.data = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );