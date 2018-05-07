

export function handleCheckboxChange(id) {
  const checkbox = $(`.chk${id}`);
  const checkBoxes = $('.chk').toArray();
  const checkBoxAl = $('.chk-all');
  let isCheckAll = true;
  checkbox.prop('checked', !checkbox.prop('checked')), // toggle state
  checkBoxes.forEach((v, k, boxes) => {
    const isChecked = $(v).prop('checked');
    if (!isChecked) {
      isCheckAll = false;
      return false;
    }
  });

  if (isCheckAll) {
    checkBoxAl.prop('checked', true);
  } else {
    checkBoxAl.prop('checked', false);
  }
}

/* get marked checkbox values
  Returns array of id
  */
export function getCheckBoxValues(checkboxes) {
  const checkBoxes = $(`.${checkboxes}`).toArray();
  const values = [];

  checkBoxes.forEach((v, k, boxes) => {
    const isChecked = $(v).prop('checked');
    if (isChecked) {
      const id = $(v).attr('id');
      values.push(id);
    }
  });
  return values;
}


export function handleCheckAll(parent, children) {
  const checkBox = $('.chk-all');
  const checkBoxes = $('.chk');
  checkBoxes.prop('checked', !checkBox.prop('checked'));
  checkBox.prop('checked', !checkBox.prop('checked'));
}
