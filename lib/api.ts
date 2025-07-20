const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const apiKey = process.env.NEXT_PUBLIC_API_KEY!;

type FetchOptions = {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
};

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

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ Request failed: ${res.status} - ${errorText}`);
    throw new Error(`Request failed: ${res.status} - ${errorText}`);
  }

  return res.json();
};

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
// const apiKey = process.env.NEXT_PUBLIC_API_KEY!;

// type FetchOptions = {
//   headers?: Record<string, string>;
//   method?: string;
//   body?: any;
// };

// export const fetchData = async (
//   endpoint: string,
//   options: FetchOptions = {}
// ) => {
//   const isFormData = options.body instanceof FormData;

//   const res = await fetch(`${baseUrl}${endpoint}`, {
//     method: options.method || "GET",
//     headers: {
//       "Accept": "application/json",
//       "x-api-key": apiKey,
//       ...options.headers,
//     },
//     body: isFormData ? options.body : JSON.stringify(options.body),
//   });

//   if (!res.ok) {
//     const errorBody = await res.text();  // Get the response body to log the error
//     console.error(`Request failed: ${res.status} - ${errorBody}`);
//     throw new Error(`Request failed: ${res.status}`);
//   }

//   return res.json();
// };
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
// const apiKey = process.env.NEXT_PUBLIC_API_KEY!

// type FetchOptions = {
//   headers?: Record<string, string>
//   method?: string
//   body?: any
// }

// export const fetchData = async (
//   endpoint: string,
//   options: FetchOptions = {}
// ) => {
//   const isFormData = options.body instanceof FormData
//   const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "x-api-key": apiKey,
//     ...(!isFormData && { "Content-Type": "application/json" }), // only add if not FormData
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   }

//   const res = await fetch(`${baseUrl}${endpoint}`, {
//     method: options.method || "GET",
//     headers,
//     body: isFormData ? options.body : JSON.stringify(options.body),
//   })

//   if (!res.ok) {
//     const errorBody = await res.text()
//     console.error(`Request failed: ${res.status} - ${errorBody}`)
//     throw new Error(`Request failed: ${res.status}`)
//   }

//   return res.json()
// }
