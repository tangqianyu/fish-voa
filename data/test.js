function convertToSQLiteDate(dateStr) {
  // Split the input date string into day, month, and year components
  const [year, month, day] = dateStr.slice(1, -1).split('-');
  const fixYear = `20${year}`;
  const fixMonth = month < 10 ? `0${month}` : month;
  const fixDay = day < 10 ? `0${day}` : day;

  return `${fixYear}-${fixMonth}-${fixDay}`;
}

console.log(convertToSQLiteDate('(23-7-25)'));
