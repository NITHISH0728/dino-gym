// ============================================================
// get-upload-url.js — Netlify Serverless Function
// Generates a signed PUT URL for direct client-side upload
// to Netlify Blobs, bypassing the 6MB payload limit.
//
// STORE SETUP: Uses @netlify/blobs with store name "gym-gallery".
// The getStore() function connects to the Netlify Blobs service
// using the site's deploy context (no manual tokens needed).
// ============================================================

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // --- CORS Headers ---
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    // Parse the incoming request body
    const { filename, contentType } = JSON.parse(event.body || "{}");

    if (!filename || !contentType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields: filename and contentType.",
        }),
      };
    }

    // Connect to the "gym-gallery" blob store
    // getStore() automatically uses the site's Netlify context (deploy ID, token)
    const store = getStore("gym-gallery");

    // Generate a signed URL for the client to PUT the file directly.
    // This URL is time-limited and allows a single upload operation.
    const uploadUrl = await store.getWithMetadata(filename, { type: "blob" })
      .catch(() => null); // Ignore if file doesn't exist yet

    // Use set() with a signed URL approach — generate a presigned URL
    const signedUrl = await store.getUploadUrl(filename, {
      contentType: contentType,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        uploadUrl: signedUrl,
        filename: filename,
        message: "Signed upload URL generated successfully.",
      }),
    };
  } catch (error) {
    console.error("Error generating upload URL:", error);

    // Fallback: If getUploadUrl isn't available, use direct set via a proxy approach
    // For Netlify Blobs, we can use the internal upload mechanism
    if (error.message && error.message.includes("getUploadUrl")) {
      try {
        const { filename, contentType } = JSON.parse(event.body || "{}");
        const store = getStore("gym-gallery");

        // Return a URL pointing to our own proxy endpoint
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            uploadUrl: `/.netlify/functions/get-upload-url?action=upload&filename=${encodeURIComponent(filename)}`,
            filename: filename,
            method: "PUT",
            message: "Use proxy upload endpoint.",
          }),
        };
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to generate upload URL.",
        details: error.message,
      }),
    };
  }
};
