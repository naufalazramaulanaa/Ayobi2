const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const apiKey = process.env.NEXT_PUBLIC_API_KEY!;

export type FetchOptions = {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  silent401?: boolean; // Optional: prevent redirect if true
};

// Optional: clean token logout + redirect handler
function handleUnauthorized() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
}

export const fetchData = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const isFormData = options.body instanceof FormData;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-api-key": apiKey,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: isFormData ? options.body : JSON.stringify(options.body),
  });

  if (res.status === 403) {
    handleUnauthorized();
    throw new Error("Forbidden");
  }

  if (res.status === 401) {
    if (!options.silent401) {
      handleUnauthorized();
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let errorText;
    try {
      errorText = await res.text();
    } catch {
      errorText = res.statusText;
    }
    console.error(`❌ Request failed: ${res.status} - ${errorText}`);
    throw new Error(`Request failed: ${res.status} - ${errorText}`);
  }

  return res.json();
};
