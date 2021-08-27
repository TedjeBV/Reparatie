// Session object to store data
const session = {};

session.lang = 'nl';

// Renderer functions
function render(data) {

    data[session.lang].forEach(category => {
        const container = renderCategory(category);
        document.getElementById('categories').appendChild(container);
    });

};

function renderCategory(category) {

    // Container
    const container = document.createElement('div');
    container.classList.add('category-container');

    // Header
    const header = document.createElement('h3');
    header.innerText = category.type;
    container.appendChild(header);

    return container;

};

// Main function
function main() {

    render(session.guides);

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.guides = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );