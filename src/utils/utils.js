const moment = require('moment');

function convertStringDateToDateObject(stringDate, acceptedDateFormats) {
  return moment(stringDate, acceptedDateFormats, true).isValid() ? new Date(stringDate) : undefined;
}

module.exports = { convertStringDateToDateObject };
