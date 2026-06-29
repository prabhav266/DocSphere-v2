const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

test('generateDocumentSummary returns a local fallback summary when OpenAI is unavailable', async () => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_BASE_URL;
  delete process.env.OPENAI_MODEL;

  const servicePath = path.join(__dirname, 'aiService.js');
  delete require.cache[require.resolve(servicePath)];

  const { generateDocumentSummary } = require(servicePath);
  const summary = await generateDocumentSummary({
    title: 'Quarterly Report',
    description: 'Budget planning for the next quarter',
    fileType: 'text/plain',
    extractedText: 'Revenue increased 12% this quarter.',
  });

  assert.ok(summary);
  assert.match(summary, /Quarterly Report/i);
  assert.match(summary, /budget planning/i);
});
