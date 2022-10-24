function createDiversify(fields) {
    fetch("/api/diversify", {
        method: "POST",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}

function deleteDiversify(fields) {
    fetch("/api/diversify/", { method: "DELETE" })
        .then(showResponse)
        .catch(showResponse);
}
