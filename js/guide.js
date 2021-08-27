// Session object
const session = {};

session.lang = 'nl';

session.guide = decodeURI((new URL(document.location)).searchParams.get('guide'));

// Renderer
function render(guide, info) {



}

// Main function
function main() {

    // Get correct guide from data
    const split = session.guide.split('-');
    let guide = session.data[session.lang];
    guide = guide.find( ({ type }) => type === split[0].toUpperCase());
    guide = guide.categories.find( ({ type }) => type === split[1].toUpperCase());
    guide = guide.files.find( ({ content }) => content === split[2].toUpperCase());

    console.log(guide)
    render(session.guideText, guide)

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.data = json),
    fetch('assets/guides/' + session.lang + '/' + session.guide + '.md').then(r => r.text()).then(md => session.guideText = md),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );