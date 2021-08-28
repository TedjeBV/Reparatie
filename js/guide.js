// Session object
const session = {};

session.language = 'nl';

session.guide = decodeURI((new URL(document.location)).searchParams.get('guide'));

// Get correct tranlation
function getTranslation(key) {
    // Check if language is available
    if (session.translation[session.language] === undefined) { return key; };

    // Split the key
    const keys = key.split('.');
    let translation = session.translation[session.language];

    // Loop through the keys to get the correct translation
    for (let i = 0; i < keys.length; i++) {
        translation = translation[keys[i]];
        if (translation === undefined) {
            console.error(`Translation for ${key} in ${session.language} not found`);
            return key
        };
        if (typeof translation !== 'object') { return translation; }
    }

    console.error(`Translation for ${key} in ${session.language} not found`);
    return key

};

// Renderer
function render(guide, info) {

    const container = document.querySelector('main');

    const infoContainer = document.createElement('p');
    infoContainer.classList.add('info');

    const author = document.createElement('span');
    author.innerHTML = getTranslation('WORDS.BY') + ' ' + info.author;
    infoContainer.appendChild(author);

    container.appendChild(infoContainer);

    const guideText = document.createElement('div');
    guideText.innerHTML = MarkdownToHtml.parse(guide);

    container.appendChild(guideText);

    console.log(`Rendered guide "${info.path}"`);

}

// Error renderer
function renderError(error) {

    console.error('Guide Renderer Error: ' + error);

    const container = document.querySelector('main');

    const errorHeader = document.createElement('h1');
    errorHeader.innerHTML = getTranslation('ERROR.HEADER');

    const errorText = document.createElement('p');
    errorText.innerText = getTranslation('ERROR.GUIDE_NOT_FOUND');

    const errorInfo = document.createElement('p');
    errorInfo.classList.add('warning');
    errorInfo.innerText = error;

    container.appendChild(errorHeader);
    container.appendChild(errorText);
    container.appendChild(errorInfo);

}

// Main function
function main() {

    // Check if guide is selected
    if (session.guide === 'null') { renderError('NO_SELECT'); return };

    // Get correct guide from data
    const split = session.guide.split('-');
    let guide = session.data[session.language];
    if (guide === undefined) { renderError('INVALID_LANG'); return };
    guide = guide.find( ({ type }) => type === split[0].toUpperCase());
    if (guide === undefined) { renderError('INVALID-CATEGORY'); return };
    guide = guide.categories.find( ({ type }) => type === split[1].toUpperCase());
    if (guide === undefined) { renderError('INVALID_SUBCATEGORY'); return };
    guide = guide.files.find( ({ content }) => content === split[2].toUpperCase());
    if (guide === undefined) { renderError('INVALID_GUIDE'); return };

    // Fetch text and render
    fetch(`assets/guides/${session.language}/${guide.path}.md`)
        .then(r => r.text())
        .then(text => render(text, guide));

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