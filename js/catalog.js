// Session object to store data
const session = {};

// Renderer function
function render(data) {}

// Main function
function main() {

};


// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/guides/guides.json').then(r => r.json()).then(json => session.guides = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( main );