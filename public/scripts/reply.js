function viewAllReplies(fields) {
    fetch("/api/replies").then(showResponse).catch(showResponse);
}

function viewRepliesByAuthor(fields) {
    fetch(`/api/replies?author=${fields.author}`)
        .then(showResponse)
        .catch(showResponse);
}

function createReply(fields) {
    fetch(`/api/replies/${fields.id}`, {
        method: "POST",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}
