// ============================================================
// POST /api/receipt
// Body: { image: "<base64 jpeg/png, no data: prefix>", mediaType: "image/jpeg" }
//
// Reads a receipt photo with Claude's vision model and returns a
// structured JSON breakdown (merchant, date, currency, total, line
// items). The browser then shows it for confirmation and deducts the
// total from a chosen net-worth account.
//
// The API key lives ONLY on the server (never shipped to the browser).
// Set it in Vercel:
//   Project → Settings → Environment Variables → ANTHROPIC_API_KEY
//
// Raw fetch (no SDK) to match /api/nova and keep this dependency-free.
// ============================================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'Receipt scanning is not configured yet — set ANTHROPIC_API_KEY in your Vercel environment variables.'
    });
  }

  // Vercel parses JSON bodies, but be defensive in case it arrives as a string.
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Accept either a raw base64 string or a full data: URL.
  let image = String(body.image || '');
  let mediaType = String(body.mediaType || 'image/jpeg');
  const m = image.match(/^data:([^;]+);base64,(.*)$/);
  if (m) { mediaType = m[1]; image = m[2]; }
  if (!image) return res.status(400).json({ error: 'image required' });

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED.includes(mediaType)) mediaType = 'image/jpeg';

  const tool = {
    name: 'record_receipt',
    description: 'Record the structured contents of a receipt / invoice image.',
    input_schema: {
      type: 'object',
      properties: {
        is_receipt: { type: 'boolean', description: 'True only if the image actually looks like a receipt, invoice or bill.' },
        merchant:   { type: 'string',  description: 'Store / merchant name. Empty string if unreadable.' },
        date:       { type: 'string',  description: 'Purchase date as YYYY-MM-DD if visible, else empty string.' },
        currency:   { type: 'string',  description: 'ISO 4217 currency code, e.g. CHF, USD, EUR, GBP. Best guess from symbols/language if not explicit.' },
        total:      { type: 'number',  description: 'Grand total actually paid (after tax). 0 if unreadable.' },
        subtotal:   { type: 'number',  description: 'Pre-tax subtotal if shown, else 0.' },
        tax:        { type: 'number',  description: 'Total tax/VAT if shown, else 0.' },
        category:   { type: 'string',  description: 'One short spending category, e.g. Groceries, Dining, Transport, Shopping, Utilities, Health, Other.' },
        items: {
          type: 'array',
          description: 'Individual line items, best effort. Omit if not legible.',
          items: {
            type: 'object',
            properties: {
              name:  { type: 'string' },
              price: { type: 'number' }
            },
            required: ['name', 'price']
          }
        }
      },
      required: ['is_receipt', 'merchant', 'currency', 'total']
    }
  };

  const system =
`You read photos of receipts, invoices and bills and extract their contents.
- Call the record_receipt tool exactly once with your best reading of the image.
- Numbers must be plain numbers (no currency symbols, no thousands separators).
- "total" is the final amount the customer paid, after tax.
- Infer the currency from symbols (Fr/CHF, $, €, £), language, or location text. If genuinely unclear, use CHF.
- If the image is clearly NOT a receipt/invoice/bill, set is_receipt to false and leave the money fields at 0.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        system,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'record_receipt' },
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: 'Read this receipt and record its contents.' }
          ]
        }],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      const msg = (data && data.error && data.error.message) || 'Claude API error';
      return res.status(r.status).json({ error: msg });
    }

    const block = (data.content || []).find(b => b && b.type === 'tool_use' && b.name === 'record_receipt');
    if (!block || !block.input) {
      return res.status(502).json({ error: 'Could not read that image. Try a clearer, well-lit photo.' });
    }

    return res.status(200).json({ receipt: block.input });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
