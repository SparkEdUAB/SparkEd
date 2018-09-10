/**
 * @description Properly arranges the text to be written to a log file
 * @param {String} info
 * @param {String} id
 * @param {String} topic
 * @returns {String} text
 */
export const formatText = (info, id, topic = '') => {
  const currentTime = moment().format();
  const textContent = `Time: ${currentTime},  message: ${info} ${topic},  Page: ${FlowRouter.getRouteName()},  userId: ${id}\n`;

  return textContent;
};
