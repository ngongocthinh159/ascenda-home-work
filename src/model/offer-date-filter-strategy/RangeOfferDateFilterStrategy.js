const { OfferDateFilterStrategy } = require('./OfferDateFilterStrategy');
const { convertStringDateToDateObject } = require('../../utils/utils');

class RangeOfferDateFilterStrategy extends OfferDateFilterStrategy {
  checkInDate;
  validRange;
  acceptedDateFormats;

  constructor(checkInDate, validRange, acceptedDateFormats) {
    super();
    this.checkInDate = checkInDate;
    this.validRange = validRange;
    this.acceptedDateFormats = acceptedDateFormats;
  }

  isChosen(offer) {
    const offerDate = convertStringDateToDateObject(offer['valid_to'], this.acceptedDateFormats);
    if (!offer['valid_to'] || !offerDate || !this.isOfferStillAvailableUntil(offerDate)) {
      console.log(`Invalid valid_to. Skip offer, id: ${offer['id']}`);
      return false;
    }
    return true;
  }

  isOfferStillAvailableUntil(offerDate) {
    const copyCheckInDate = new Date(this.checkInDate);
    copyCheckInDate.setMilliseconds(copyCheckInDate.getMilliseconds() + this.validRange['milliseconds']);
    copyCheckInDate.setSeconds(copyCheckInDate.getSeconds() + this.validRange['seconds']);
    copyCheckInDate.setMinutes(copyCheckInDate.getMinutes() + this.validRange['minutes']);
    copyCheckInDate.setHours(copyCheckInDate.getHours() + this.validRange['hours']);
    copyCheckInDate.setDate(copyCheckInDate.getDate() + this.validRange['date']);
    copyCheckInDate.setMonth(copyCheckInDate.getMonth() + this.validRange['month']);
    copyCheckInDate.setFullYear(copyCheckInDate.getFullYear() + this.validRange['year']);
    return copyCheckInDate <= offerDate;
  }
}

module.exports = { RangeOfferDateFilterStrategy };
