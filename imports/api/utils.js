export const findExisting = (coll, id) => {
  let count = 0;
  // eslint-disable-next-line
  coll.find(item => {
    if (item._id === id) {
      count++; // eslint-disable-line
    }
  });
  return count;
};
