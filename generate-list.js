// File: generate-list.js
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// This tells the script where to look for your apps.
const webappsDir = path.join(__dirname, 'site_files/webapps');
// This tells the script where to save the generated list.
const outputFile = path.join(__dirname, 'site_files/personal/pages.json');
// --------------------

console.log(`Scanning directory: ${webappsDir}`);

try {
    const files = fs.readdirSync(webappsDir);
    const pages = [];

    files.forEach(file => {
        // Only include .html files
        if (path.extname(file) === '.html') {
            // Create a nice title from the filename
            const title = path.basename(file, '.html')
                              .replace(/-/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase());

            // Add the app to our list
            pages.push({
                url: `../webapps/${file}`, // Path is relative to page.html
                title: title
            });
        }
    });

    // Write the list to the pages.json file
    fs.writeFileSync(outputFile, JSON.stringify(pages, null, 2));
    console.log(`✅ Success! Created pages.json with ${pages.length} apps.`);

} catch (error) {
    console.error(`❌ Error: Could not scan directory or write file.`, error);
}