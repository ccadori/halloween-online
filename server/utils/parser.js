module.exports = {
  convert: (data) => {
    if (!data) return data;

    return typeof data === "string"? JSON.parse(data) : data;
  }
};
