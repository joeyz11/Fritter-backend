function ViewDiscussionsOfFreet(fields) {
    fetch(`/api/discussions?freetId=${fields.id}`)
        .then(showResponse)
        .catch(showResponse);
}
