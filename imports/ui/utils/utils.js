/**
 * @description Properly arranges the text to be written to a log file
 * @param {String} info
 * @param {String} id
 * @returns {String} text
 */
export const formatText = (info, id) => {
  const currentTime = moment().format();
  const textContent = `Time: ${currentTime},  message: ${info},  Page: ${FlowRouter.getRouteName()},  userId: ${id}\n`;

  return textContent;
};
