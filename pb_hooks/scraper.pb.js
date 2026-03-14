onRecordAfterCreateSuccess((e) => {
    const record = e.record;

    // Only run for "link" types
    if (record.get("type") !== "link") return;

    // Handle config field (works if it's already an object or a JSON string)
    const configData = record.get("config");
    const config = typeof configData === 'string' ? JSON.parse(configData || "{}") : configData;
    const url = config?.url;

    if (!url) return;

    try {
        // Extract domain for the favicon service
        const domain = url.split('/')[2];
        const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

        const res = $http.send({
            url: faviconUrl,
            method: "GET",
        });

        if (res.statusCode === 200) {
            // Fetch and set the file to the 'cache_icon' field
            const file = $http.fileFromURL(faviconUrl);
            record.set("cache_icon", file);

            // In v0.23, $app.save(record) is the standard way to persist changes
            $app.save(record);
        }
    } catch (err) {
        console.error("Tabtop Scraper Error:", err);
    }
}, "Tabtop");
