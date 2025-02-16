import { NextRequest, NextResponse } from "next/server";

/**
 * Example usage from your client code:
 *   fetch("/api/proxy?endpoint=recipes&id=123")
 *   => Internally calls http://88.80.187.193:8080/api/recipes/123
 *
 *   fetch("/api/proxy?endpoint=recipes&query=name=chicken")
 *   => Internally calls http://88.80.187.193:8080/api/recipes?name=chicken
 */
export async function GET(request: NextRequest) {
  let urlWithParams;

  try {
    urlWithParams = request.nextUrl;
  } catch (err) {
    console.error("request.nextUrl parse error, building fallback URL", err);
    urlWithParams = new URL(request.url, "http://localhost");
  }

  // Now we have a workable URL
  const searchParams = urlWithParams.searchParams;

  const endpoint = searchParams.get("endpoint") ?? "";
  const id = searchParams.get("id") ?? "";
  const queryParam = searchParams.get("query") ?? "";

  //    e.g. "http://88.80.187.193:8080/api/recipes" + optional "/id" + optional "?foo=bar"
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
      return NextResponse.json(
        { error: `Linode fetch failed (status ${response.status})` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
