var http = require("http");
var lan_parser = require("accept-language-parser");
var ua_parser = require("ua-parser-js");

var getClientAdress = function(req) {
    return (req.headers["x-forwarded-for"] || "").split(",")[0] || req.connection.remoteAddress;
};

var getClientLanguage = function(req) {
    var language = lan_parser.parse(req.headers["accept-language"])[0];
    return language.code + (language.region !== undefined ? ("-" + language.region) : "");
};

var getClientOS = function(req) {
    var ua = ua_parser(req.headers["user-agent"]);
    return ua.os.name + " " + ua.os.version;
};

var server = http.createServer((req, res) => {
    var clientInfo = {
        ipadress: getClientAdress(req),
        language: getClientLanguage(req),
        software: getClientOS(req)
    };

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(clientInfo));
    res.end();
});

server.listen(process.env.PORT || 8080, () => {
    console.log("Server listening on port: ", server.address().port);
});
