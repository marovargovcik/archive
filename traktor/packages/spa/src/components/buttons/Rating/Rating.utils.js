function getRatingFromValue(value) {
  if (value === -1) {
    return 0;
  }
  return value;
}

function getRatingLabelFromValue(value) {
  switch (value) {
    case -1:
      return 'Unrate';
    case 1:
      return '1 - Weak sauce';
    case 2:
      return '2 - Terrible';
    case 3:
      return '3 - Bad';
    case 4:
      return '4 - Poor';
    case 5:
      return '5 - Meh';
    case 6:
      return '6 - Fair';
    case 7:
      return '7 - Good';
    case 8:
      return '8 - Great';
    case 9:
      return '9 - Superb';
    case 10:
      return '10 - Excellent!';
    default:
      return 'Rate';
  }
}

export { getRatingFromValue, getRatingLabelFromValue };
