// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const endpoint = req.query.endpoint as string;

  if (!endpoint) {
    return res.status(400).json({ error: "Missing endpoint query parameter" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY!;
  const accessToken = req.headers.authorization || "";

  const targetUrl = `${baseUrl}${endpoint}`;

  const fetchHeaders: HeadersInit = {
    Accept: "application/json",
    "x-api-key": apiKey,
    ...(accessToken ? { Authorization: accessToken } : {}),
  };

  // If not multipart/form-data, assume JSON
  if (req.headers["content-type"]?.includes("application/json")) {
    fetchHeaders["Content-Type"] = "application/json";
  }

  try {
    const fetchResponse = await fetch(targetUrl, {
      method: req.method,
      headers: fetchHeaders,
      body: req.method !== "GET" ? req.body : undefined,
    });

    const contentType = fetchResponse.headers.get("content-type") || "";
    res.status(fetchResponse.status);

    if (contentType.includes("application/json")) {
      const data = await fetchResponse.json();
      return res.json(data);
    }

    const buffer = await fetchResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
}
