const daysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) || 1;
};

module.exports = { daysBetween };
