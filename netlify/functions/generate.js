// Calls fal.ai to generate image or video
const https = require('https');

async function callFalAI(prompt, type, fileBase64, mimeType) {
  const apiKey = process.env.FAL_API_KEY;
  const endpoint = type === 'image' 
    ? 'https://api.fal.ai/v1/flux/dev'
    : 'https://api.fal.ai/v1/kling/v1/standard/text-to-video';

  const payload = {
    prompt: prompt,
    ...(fileBase64 && { image: `data:${mimeType};base64,${fileBase64}` })
  };

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.fal.ai',
      path: endpoint.replace('https://api.fal.ai', ''),
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { prompt, type, fileBase64, mimeType } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt required' }) };
    }

    const result = await callFalAI(prompt, type, fileBase64, mimeType);
    const mediaUrl = type === 'image' ? result.image?.url : result.video?.url;

    if (!mediaUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get media URL from fal.ai' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: mediaUrl })
    };
  } catch (err) {
    console.error('Generate error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};