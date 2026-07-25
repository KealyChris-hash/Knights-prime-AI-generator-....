// Posts generated media to Postbook
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const { userId, mediaUrl, prompt, mediaType } = JSON.parse(event.body);

    // TODO: Implement Postbook API call
    // For now, just validate the input
    if (!userId || !mediaUrl || !prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Replace with actual Postbook API endpoint
    const postbookApiUrl = process.env.POSTBOOK_API_URL;
    const postbookApiKey = process.env.POSTBOOK_API_KEY;

    if (!postbookApiUrl || !postbookApiKey) {
      console.warn('Postbook API credentials not configured');
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Posted to Postbook (mock)' })
      };
    }

    // Make actual API call to Postbook
    const response = await fetch(postbookApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${postbookApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        media: { url: mediaUrl, type: mediaType },
        caption: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`Postbook API error: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Post to Postbook error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};