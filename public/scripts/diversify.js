function getDiversify(fields) {
    fetch("/api/diversify").then(showResponse).catch(showResponse);
}

function removeDiversify(fields) {
    fetch("/api/diversify/remove").then(showResponse).catch(showResponse);
}
