// ============================================================
// delete-photo.js — Netlify Serverless Function
// Deletes a specific photo from the "gym-gallery" Blob store.
// ============================================================

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // --- CORS Headers ---
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use DELETE." }),
    };
  }

  try {
    const { filename } = JSON.parse(event.body || "{}");

    if (!filename) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing filename parameter." }),
      };
    }

    const store = getStore("gym-gallery");

    await store.delete(filename);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `File ${filename} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error deleting photo:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to delete photo.",
        details: error.message,
      }),
    };
  }
};
