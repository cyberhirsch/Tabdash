routerAdd("GET", "/api/tabtop/proxy", (c) => {
    const targetUrl = c.queryParam("url");

    if (!targetUrl) {
        return c.json(400, { error: "Missing url parameter" });
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        return c.json(400, { error: "Invalid URL protocol" });
    }

    try {
        const res = $http.send({
            url: targetUrl,
            method: "GET",
            headers: {
                "User-Agent": "Tabtop/1.0",
                "Accept": "*/*"
            },
            timeout: 10,
        });

        // Set CORS headers so the frontend can actually read the response
        c.response().header().set("Access-Control-Allow-Origin", "*");
        c.response().header().set("Access-Control-Allow-Methods", "GET, OPTIONS");

        // Get content type from response headers
        const contentType = res.headers["content-type"] || res.headers["Content-Type"] || "text/plain";

        // Return the raw response body with the correct content type
        return c.blob(res.statusCode, contentType, res.raw);
    } catch (err) {
        // Even on error, we should probably allow the origin to see the error message
        c.response().header().set("Access-Control-Allow-Origin", "*");
        return c.json(502, { error: "Failed to fetch external resource", detail: String(err) });
    }
});
