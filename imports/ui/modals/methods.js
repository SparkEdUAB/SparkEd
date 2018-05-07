/* eslint no-unused-vars: 'off' */
export function closeModal(state, props) {
  return {
    isOpen: false,
    modalIdentifier: '', // Topic Id
    modalType: '', // Add or Edit
    title: '', // Add Topic or Edit Topic
    confirm: '',
    reject: '',
    name: '',
    code: '',
  };
}

// testing if setting states outside the component would work
export function schoolStates(
  ide,
  title,
  confirm,
  reject,
  id = '',
  schoolName = '',
  code = '',
  state,
  props,
) {
  return {
    modalIdentifier: id,
    modalType: ide,
    title,
    confirm,
    reject,
    name: schoolName,
    code,
  };
}

/**
 * @param modalIdentifier {String}
 */

export function accountsModalStates(modalType, count, name, users, states, props) {
  return {
    modalType,
    title: `Are you sure to ${modalType} ${count} ${name}`,
    confirm: 'Yes',
    reject: 'No',
    ids: users,
    name,
    count,
  };
}
