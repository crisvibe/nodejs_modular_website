//--------------------------------------------
// Idea. MVC with modules for each HTML component
//
// - Routing Requests
//      - Have server.js handle different
//        routes and assemble pages.
// - 
//-------------------------------------------
// server.js
const http = require('http');
const fs   = require('fs');
const url  = require('url');

const PORT = 8080;

// Read components synchronously at the start
const headerComp = fs.readFileSync('./components/header.html', 'utf8');
const navComp    = fs.readFileSync('./components/navbar.html', 'utf8');
const footerComp = fs.readFileSync('./components/footer.html', 'utf8');

// Function to assemble the page
function assemblePage(pageType, bodyCont) {
    if (pageType == "page") {
        let fullPage = headerComp;
        fullPage += navComp;
        fullPage += bodyCont;
        fullPage += footerComp;
        return fullPage;

    } else if (pageType == "error") {
        let fullPage = headerComp;
        fullPage += navComp;
        fullPage += "<h2>🤦‍♂️ 404 🤦‍♂️</h2>";
        fullPage += footerComp;
        return fullPage;
    }
};


// Create HTTP server
http.createServer( function(req, res) {
    try {
        
        let q = url.parse(req.url, true);
        let currentUrl = './pages' + q.pathname;
        let currentPageContent = fs.readFileSync(currentUrl, 'utf8');
        let fullPage = assemblePage("page", currentPageContent);

        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(fullPage);
        res.end();

    } catch (err) {

        console.error("Fucksie whoopsies - " + err);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        let errorPage = assemblePage("error");
        res.write(errorPage);
        res.end();

    }
}).listen(PORT, function() { console.log(`Server is running on localhost:${PORT}`); });

// Error Messages and Debugging
// let consoleMessage = typeof(currentUrl) + currentUrl;
// res.write(fullPage + consoleMessage);
// let newUrl = currentUrl.replace("modular-website", "pages"); // Target: './pages/index.html'
// let errorPage = assembleErrorPage(err);