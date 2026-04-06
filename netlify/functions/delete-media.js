const crypto = require('crypto');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { public_id, resource_type } = JSON.parse(event.body);

    if (!public_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'public_id is required' }) };
    }

    const cloudName = 'ddq8m4oec';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Cloudinary credentials not configured. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Netlify environment variables.' })
      };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const type = resource_type || 'image';

    // Generate signature: public_id=xxx&timestamp=xxx + api_secret
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    // Call Cloudinary destroy API
    const formBody = new URLSearchParams({
      public_id,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${type}/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString()
      }
    );

    const result = await response.json();

    if (result.result === 'ok') {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Media deleted successfully' })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: result.result || 'Delete failed' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
