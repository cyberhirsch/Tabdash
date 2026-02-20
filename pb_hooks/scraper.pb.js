onRecordAfterCreateRequest((e) => {
    const record = e.record;
    if (record.get("type") !== "link") return;

    const config = JSON.parse(record.getString("config") || "{}");
    const url = config.url;

    if (!url) return;

    try {
        // Simple scraping logic for PocketBase JS Hooks
        // 1. Try to get the favicon URL
        const domain = url.split('/')[2];
        const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

        // 2. Fetch and skip if failure (Google favicon service is reliable)
        const res = $http.send({
            url: faviconUrl,
            method: "GET",
        });

        if (res.statusCode === 200) {
            // Update the record with the cached icon
            // Note: In PB JS hooks, we use $app.dao().saveRecord()
            const file = $http.fileFromURL(faviconUrl);
            record.set("cache_icon", file);
            $app.dao().saveRecord(record);
        }
    } catch (err) {
        console.error("Scraper Error:", err);
    }
}, "TabDash");
