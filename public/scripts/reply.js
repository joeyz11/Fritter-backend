function viewAllReplies(fields) {
    fetch("/api/replies").then(showResponse).catch(showResponse);
}

function viewRepliesByAuthor(fields) {
    fetch(`/api/replies?author=${fields.author}`)
        .then(showResponse)
        .catch(showResponse);
}

function viewRepliesByDiscussion(fields) {
    fetch(`/api/replies?discussionId=${fields.id}`)
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

function editReply(fields) {
    fetch(`/api/replies/${fields.id}`, {
        method: "PUT",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}

function deleteReply(fields) {
    fetch(`/api/replies/${fields.id}`, { method: "DELETE" })
        .then(showResponse)
        .catch(showResponse);
}
