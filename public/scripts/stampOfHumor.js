function createStampOfHumor(fields) {
    fetch("/api/stampOfHumor", {
        method: "POST",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}
