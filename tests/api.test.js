const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

// Helper to make mock requests against Express app
function makeRequest(app, method, url, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const parsedUrl = new URL(url, `http://127.0.0.1:${port}`);

      const reqOptions = {
        hostname: '127.0.0.1',
        port: port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers
        }
      };

      const req = http.request(reqOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          server.close();
          try {
            const json = data ? JSON.parse(data) : null;
            resolve({ status: res.statusCode, headers: res.headers, body: json, rawText: data });
          } catch (e) { // eslint-disable-line no-unused-vars
            resolve({ status: res.statusCode, headers: res.headers, body: null, rawText: data });
          }
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      req.end();
    });
  });
}

test('GET /health returns 200 and healthy status', async () => {
  const res = await makeRequest(app, 'GET', '/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.status, 'healthy');
  assert.strictEqual(typeof res.body.data.uptimeSeconds, 'number');
});

test('GET /api/publications returns publications list', async () => {
  const res = await makeRequest(app, 'GET', '/api/publications');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.items));
  assert.ok(res.body.data.total >= 4);

  // Check JETIR paper presence
  const jetirPaper = res.body.data.items.find(p => p.id === 'jetir-2022-marigold-ensilage');
  assert.ok(jetirPaper);
  assert.strictEqual(jetirPaper.issn, '2349-5162');
});

test('GET /api/publications?category=pedagogy filters results', async () => {
  const res = await makeRequest(app, 'GET', '/api/publications?category=pedagogy');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  res.body.data.items.forEach(p => {
    assert.strictEqual(p.category, 'pedagogy');
  });
});

test('POST /api/contact rejects empty submission with 400', async () => {
  const res = await makeRequest(app, 'POST', '/api/contact', {});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/contact rejects invalid email and missing DPDP consent', async () => {
  const payload = {
    fullName: 'Dr. Ramesh Kumar',
    email: 'not-an-email',
    subject: 'research_collaboration',
    message: 'We are interested in collaborating on marigold extraction.',
    dpdpConsent: false
  };
  const res = await makeRequest(app, 'POST', '/api/contact', payload);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.success, false);
  assert.ok(res.body.error.details.email);
  assert.ok(res.body.error.details.dpdpConsent);
});

test('POST /api/contact traps bot via honeypot field', async () => {
  const botPayload = {
    fullName: 'Spam Bot',
    email: 'bot@spam.com',
    subject: 'research_collaboration',
    message: 'Check out our search ranking service here today!',
    dpdpConsent: true,
    website: 'https://spam-link.ru'
  };
  const res = await makeRequest(app, 'POST', '/api/contact', botPayload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.inquiryId.startsWith('BOT-'));
});

test('POST /api/contact succeeds with valid academic inquiry', async () => {
  const validPayload = {
    fullName: 'Prof. Anjali Deshmukh',
    email: 'anjali.deshmukh@mu.ac.in',
    affiliation: 'Department of Biotechnology, University of Mumbai',
    subject: 'research_collaboration',
    message: 'Dear Ms. Waheedunnisa, we would like to invite you to present your marigold ensilage research at our annual biotechnology symposium.',
    dpdpConsent: true
  };
  const res = await makeRequest(app, 'POST', '/api/contact', validPayload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.inquiryId.startsWith('ACAD-'));
});
