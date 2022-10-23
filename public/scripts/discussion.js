function ViewAllDiscussions(fields) {
    fetch("/api/discussions").then(showResponse).catch(showResponse);
}

function ViewDiscussionsOfFreet(fields) {
    fetch(`/api/discussions?freetId=${fields.id}`)
        .then(showResponse)
        .catch(showResponse);
}
