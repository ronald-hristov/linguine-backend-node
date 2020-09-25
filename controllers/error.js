exports.get404 = (request, response, next) => {
    response.status(404).send();
}