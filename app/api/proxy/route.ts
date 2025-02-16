import { NextRequest, NextResponse } from "next/server";

/**
 * Example usage from client side:
 *   fetch("/api/proxy?endpoint=recipes&id=1")
 *   => calls http://88.80.187.193:8080/api/recipes/1 behind the scenes
 *
 *   fetch("/api/proxy?endpoint=recipes&query=name=chicken")
 *   => calls http://88.80.187.193:8080/api/recipes?name=chicken
 *
 * CORS HEADERS are included so cross-origin calls from another domain are allowed.
 */

// This handles GET requests
export async function GET(request: NextRequest) {
  // Attempt to parse request.nextUrl. If there's an environment that returns a relative path,
  // fallback to building a URL with a base.
  let urlWithParams;
  try {
    urlWithParams = request.nextUrl;
  } catch (err) {
    // Fallback if nextUrl is missing an origin
    urlWithParams = new URL(request.url, "http://localhost");
  }

  const searchParams = urlWithParams.searchParams;
  const endpoint = searchParams.get("endpoint") ?? "";
  const id = searchParams.get("id") ?? "";
  const queryParam = searchParams.get("query") ?? "";

  // Build the Linode URL
  let linodeUrl = `http://88.80.187.193:8080/api/${endpoint}`;

  if (id.trim() !== "") {
    linodeUrl += `/${id}`;
  }

  if (queryParam.trim() !== "") {
    linodeUrl += `?${queryParam}`;
  }

  try {
    const response = await fetch(linodeUrl);

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Linode fetch failed" }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            // CORS HEADERS
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // CORS HEADERS
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(JSON.stringify({ error: "Proxy request failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        // CORS HEADERS
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

/**
 * Handle OPTIONS preflight requests if your client or browser triggers them
 * (e.g., for POST requests or custom headers).
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
