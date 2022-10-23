function upvoteReply(fields) {
    console.log("fetching", fields);
    fetch(`/api/upvotes/${fields.id}/inc`, {
        method: "PUT",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}

function downvoteReply(fields) {
    fetch(`/api/upvotes/${fields.id}/dec`, {
        method: "PUT",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
    })
        .then(showResponse)
        .catch(showResponse);
}
