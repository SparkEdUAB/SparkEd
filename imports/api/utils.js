export const findExisting = (coll, id) => {
  let count = 0;
  coll.find((item) => {
    if (item._id === id) {
      count++;
    }
  });
  return count;
};
