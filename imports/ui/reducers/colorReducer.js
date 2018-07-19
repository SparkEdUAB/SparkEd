const initialState = {
  mainColor: 'blue',
  buttonColors: 'blue',
  sidebarColor: 'blue',
};

export default function resourceReducer(state = initialState, action) {
  const {
    mainColor, buttonColors, sidebarColor, type,
  } = action;
  switch (type) {
    case 'UPDATE_COLOR':
      return Object.assign({}, state, {
        mainColor,
        buttonColors,
        sidebarColor,
      });
    default:
      return state;
  }
}
