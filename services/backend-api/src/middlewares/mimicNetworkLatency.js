function mimicNetworkLatency(req, res, next) {
    const msForLatency = 1000;
  setTimeout(next, msForLatency);
}

module.exports = {
  mimicNetworkLatency
};