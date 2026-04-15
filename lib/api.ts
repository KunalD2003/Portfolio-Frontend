const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  const mergedHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: mergedHeaders,
    body:
      body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    cache: "no-store",
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const errorMessage =
      (json && typeof json === "object" && "error" in json && String(json.error)) ||
      "Request failed"
    throw new Error(errorMessage)
  }

  return json as T
}
