// Session object
const session = {};

session.lang = 'nl';

session.guide = decodeURI((new URL(document.location)).searchParams.get('guide'));

// Renderer
function render(guide, info) {

    const container = document.querySelector('main');

    const infoContainer = document.createElement('p');
    infoContainer.classList.add('info');

    const author = document.createElement('span');
    author.innerHTML = 'Door ' + info.author;
    infoContainer.appendChild(author);

    container.appendChild(infoContainer);

    const guideText = document.createElement('div');
    guideText.innerHTML = MarkdownToHtml.parse(guide);

    container.appendChild(guideText);

}

// Error renderer
function renderError(error) {

    console.error('Guide Renderer Error: ' + error);

}

// Main function
function main() {

    // Check if guide is selected
    if (session.guide === 'null') { renderError('NO_SELECT'); return };

    // console.log('Loading guide: ' + session.guide);

    // Get correct guide from data
    const split = session.guide.split('-');
    let guide = session.data[session.lang];
    if (guide === undefined) { renderError('INVALID_LANG'); return };
    guide = guide.find( ({ type }) => type === split[0].toUpperCase());
    if (guide === undefined) { renderError('INVALID-CATEGORY'); return };
    guide = guide.categories.find( ({ type }) => type === split[1].toUpperCase());
    if (guide === undefined) { renderError('INVALID_SUBCATEGORY'); return };
    guide = guide.files.find( ({ content }) => content === split[2].toUpperCase());
    if (guide === undefined) { renderError('INVALID_GUIDE'); return };

    console.log(guide)

    // Fetch text and render
    fetch(`assets/guides/${session.lang}/${guide.path}.md`)
        .then(r => r.text())
        .then(text => render(text, guide));

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.data = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );