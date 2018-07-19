export default function mapDispatchToProps(dispatch) {
  return {
    updateTheme: (mainColor, buttonColors, sidebarColor) => {
      const action = {
        type: 'UPDATE_COLOR',
        mainColor,
        buttonColors,
        sidebarColor,
      };
      dispatch(action);
    },
  };
}
/*
    main-color ==> header, unit-container, cards, titles
    button-color
    sidebar-color

  */
