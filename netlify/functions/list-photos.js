// ============================================================
// list-photos.js — Netlify Serverless Function
// Lists all uploaded photos from the "gym-gallery" Netlify Blob.
// Generates signed GET URLs for client-side rendering.
// ============================================================

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // --- CORS Headers ---
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use GET." }),
    };
  }

  try {
    const store = getStore("gym-gallery");

    // List all objects in the store
    const { blobs } = await store.list();

    if (!blobs || blobs.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }

    // Generate signed URLs for each blob
    // For netlify blobs, we usually don't need signed urls for public reading if it's via a function
    // Or we proxy through the function, or provide direct links if the blob store allows it.
    // Assuming we proxy through a get endpoint or use signed urls if supported:
    const photos = await Promise.all(
      blobs.map(async (blob) => {
        // Fallback or explicit signed URL usage
        let url = "";
        try {
            url = await store.getDownloadUrl(blob.key);
        } catch {
            url = `/.netlify/functions/get-photo?key=${encodeURIComponent(blob.key)}`;
        }
        
        return {
          key: blob.key,
          url: url,
        };
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(photos),
    };
  } catch (error) {
    console.error("Error listing photos:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to list photos from the gallery.",
        details: error.message,
      }),
    };
  }
};
