const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST;
const chatHandler = require(path.join(ROOT, 'api', 'chat.js'));
const contactHandler = require(path.join(ROOT, 'api', 'contact.js'));
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp4': 'video/mp4',
    '.otf': 'font/otf',
    '.ogg': 'audio/ogg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};
const deniedFiles = new Set(['.env', '.env.local', 'local-server.js']);
const requestCounts = new Map();

function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!match || process.env[match[1]]) continue;
        let value = match[2];
        if (
            value.length >= 2 &&
            ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'")))
        ) {
            value = value.slice(1, -1);
        }
        process.env[match[1]] = value;
    }
}

function loadLocalEnvironment() {
    parseEnvFile(path.join(ROOT, '.env.local'));
    parseEnvFile(path.join(ROOT, '.env'));
}

function sendJson(res, status, payload) {
    res.writeHead(status, {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
    });
    res.end(JSON.stringify(payload));
}

function withinRateLimit(req) {
    const now = Date.now();
    const ip = req.socket.remoteAddress || 'local';
    const current = requestCounts.get(ip);
    if (!current || now - current.start >= 60_000) {
        requestCounts.set(ip, { start: now, count: 1 });
        return true;
    }
    current.count += 1;
    return current.count <= 20;
}

function handleChat(req, res) {
    if (!withinRateLimit(req)) {
        sendJson(res, 429, { error: 'La conciergerie est très sollicitée. Merci de réessayer dans un instant.' });
        return;
    }

    let body = '';
    let bodyTooLarge = false;
    req.setEncoding('utf8');
    req.on('data', chunk => {
        if (bodyTooLarge) return;
        body += chunk;
        if (Buffer.byteLength(body, 'utf8') > 20_000) {
            bodyTooLarge = true;
            body = '';
        }
    });
    req.on('end', () => {
        if (bodyTooLarge) {
            sendJson(res, 413, { error: 'Le message dépasse la taille autorisée.' });
            return;
        }
        try {
            req.body = body ? JSON.parse(body) : null;
        } catch {
            sendJson(res, 400, { error: 'Le format du message est invalide.' });
            return;
        }

        const apiResponse = {
            statusCode: 200,
            headers: {},
            setHeader(name, value) {
                this.headers[name] = value;
            },
            end(payload) {
                res.writeHead(this.statusCode, this.headers);
                res.end(payload);
            }
        };
        Promise.resolve(chatHandler(req, apiResponse)).catch(error => {
            console.error('Local chat handler failed.', error.name);
            if (!res.headersSent) {
                sendJson(res, 500, { error: 'La conciergerie est momentanément indisponible. Merci de réessayer.' });
            }
        });
    });
}

function handleContact(req, res) {
    if (!withinRateLimit(req)) {
        sendJson(res, 429, { error: 'Trop de demandes ont été envoyées. Merci de réessayer dans un instant.' });
        return;
    }

    let body = '';
    let bodyTooLarge = false;
    req.setEncoding('utf8');
    req.on('data', chunk => {
        if (bodyTooLarge) return;
        body += chunk;
        if (Buffer.byteLength(body, 'utf8') > 12_000) {
            bodyTooLarge = true;
            body = '';
        }
    });
    req.on('end', () => {
        if (bodyTooLarge) {
            sendJson(res, 413, { error: 'Le formulaire dépasse la taille autorisée.' });
            return;
        }
        try {
            req.body = body ? JSON.parse(body) : null;
        } catch {
            sendJson(res, 400, { error: 'Le format du formulaire est invalide.' });
            return;
        }

        Promise.resolve(contactHandler(req, {
            statusCode: 200,
            headers: {},
            setHeader(name, value) {
                this.headers[name] = value;
            },
            end(payload) {
                res.writeHead(this.statusCode, this.headers);
                res.end(payload);
            }
        })).catch(error => {
            console.error('Local contact handler failed.', error.name || 'Error');
            if (!res.headersSent) {
                sendJson(res, 500, { error: 'Le formulaire est momentanément indisponible. Merci de réessayer.' });
            }
        });
    });
}

function serveStatic(req, res, pathname) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(pathname);
    } catch {
        res.writeHead(400).end('Bad request');
        return;
    }

    const segments = decodedPath.split(/[\\/]+/).filter(Boolean);
    if (
        decodedPath.includes('\0') ||
        decodedPath.includes('\\') ||
        segments.some(segment => segment.startsWith('.') || deniedFiles.has(segment.toLowerCase()) || segment.toLowerCase() === 'api')
    ) {
        res.writeHead(404).end('Not found');
        return;
    }

    const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.slice(1);
    const filePath = path.resolve(ROOT, relativePath);
    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
        res.writeHead(404).end('Not found');
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            res.writeHead(404).end('Not found');
            return;
        }
        const contentType = contentTypes[path.extname(filePath).toLowerCase()];
        if (!contentType) {
            res.writeHead(404).end('Not found');
            return;
        }
        const isVideo = path.extname(filePath).toLowerCase() === '.mp4';
        let statusCode = 200;
        let start = 0;
        let end = stats.size - 1;
        if (isVideo && req.headers.range) {
            const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
            if (!range || (!range[1] && !range[2])) {
                res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
                return;
            }
            if (!range[1]) {
                const suffixLength = Number(range[2]);
                start = Math.max(0, stats.size - suffixLength);
            } else {
                start = Number(range[1]);
            }
            end = range[2] && range[1] ? Math.min(Number(range[2]), stats.size - 1) : stats.size - 1;
            if (start >= stats.size || end < start) {
                res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
                return;
            }
            statusCode = 206;
        }

        const headers = {
            'Cache-Control': 'no-cache',
            'Content-Length': end - start + 1,
            'Content-Type': contentType,
            'X-Content-Type-Options': 'nosniff'
        };
        if (isVideo) headers['Accept-Ranges'] = 'bytes';
        if (statusCode === 206) headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
        res.writeHead(statusCode, headers);
        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        fs.createReadStream(filePath, { start, end }).pipe(res);
    });
}

loadLocalEnvironment();
const server = http.createServer((req, res) => {
    let pathname;
    try {
        pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
    } catch {
        res.writeHead(400).end('Bad request');
        return;
    }

    if (pathname === '/api/chat') {
        handleChat(req, res);
        return;
    }
    if (pathname === '/api/contact') {
        handleContact(req, res);
        return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, 405, { error: 'Cette méthode n’est pas disponible.' });
        return;
    }
    serveStatic(req, res, pathname);
});
const onListening = () => {
    console.log(`Coco Miracles local server: http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not configured. Add your rotated key to .env.local to enable chat.');
    }
};
if (HOST) server.listen(PORT, HOST, onListening);
else server.listen(PORT, onListening);
