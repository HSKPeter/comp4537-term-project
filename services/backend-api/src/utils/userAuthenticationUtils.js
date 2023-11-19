const getHash = (password) => {
    return "" + password + "_hash"
}

const getToken = () => {
    return "one_time_token"
}

module.exports = {
    getHash,
    getToken
}
