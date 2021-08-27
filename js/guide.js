// Session object
const session = {};

session.lang = 'nl';

session.guide = (new URL(document.location)).searchParams.get('guide');

// Main function
function main() {

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.data = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );