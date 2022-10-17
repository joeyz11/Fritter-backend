// synchronizations of concepts

function createFreetAndStampOfHumor(fields) {
    console.log("fields", fields);

    fetch("/api/sync/freetAndStampOfHumor", {
        method: "POST",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}
