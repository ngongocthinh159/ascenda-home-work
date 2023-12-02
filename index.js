const fs = require('fs').promises;
const moment = require('moment');
const { PriorityQueue } = require('@datastructures-js/priority-queue');
const acceptedDateFormats = ['YYYY-MM-DD'];
const selectedCategoryIds = new Set([1, 2, 4]);
const validRange = {
  milliseconds: 0,
  seconds: 0,
  minutes: 0,
  hours: 0,
  date: 5,
  month: 0,
  year: 0,
};
const MAX_NUMBER_OF_RETURNED_OFFERS = 2;

(async function run() {
  try {
    // Validate input
    const checkInDate = convertStringDateToDateObject(process.argv[2], acceptedDateFormats);
    if (!checkInDate) throw new Error('invalid check-in date format');
    const parsedInput = JSON.parse(await fs.readFile('input.json', 'utf8'));
    if (!parsedInput['offers'] || !(parsedInput['offers'] instanceof Array)) throw new Error('invalid input format');

    // Filter offers
    const offerDetails = parsedInput['offers'];
    const filteredOffers = filter(selectedCategoryIds, offerDetails, checkInDate);
    const result = { offers: filteredOffers };

    // Output result
    await fs.writeFile('output.json', JSON.stringify(result, undefined, 4));
  } catch (err) {
    console.error(err);
  }
})();

function filter(selectedCategoryIds, offerDetails, checkInDate) {
  const result = [];
  const visitedCategoryIds = new Set();
  const pq = new PriorityQueue((a, b) => {
    if (a['merchants'][0]['distance'] > b['merchants'][0]['distance']) return 1; // min pq
    return -1;
  });

  console.log(`filtering offer..`);
  for (let offer of offerDetails) {
    // Validate category
    if (!isValidCategory(offer, selectedCategoryIds)) continue;

    // Validate offer valid_to date
    if (!isValidOfferDate(offer, checkInDate)) continue;

    // Get min dist merchant of current offer
    const minMerchant = getMinDistanceMerchant(offer);
    if (!minMerchant) {
      console.log(`No min merchant found. Skip offer, id: ${offer['id']}`);
      continue;
    }
    offer['merchants'] = [minMerchant]; // Get only min merchant

    // Valid offer => Handle priority
    console.log(
      `PQ: push offer id: ${offer['id']}, category: ${offer['category']},` +
        ` minDist: ${offer['merchants'][0]['distance']}, valid_to: ${offer['valid_to']}`
    );
    pq.push(offer);
  }
  console.log('filtering done!');

  console.log('\nget min distance offer');
  while (pq.size() && result.length < MAX_NUMBER_OF_RETURNED_OFFERS) {
    const offer = pq.front();
    pq.pop();
    const categoryId = offer['category'];
    if (!visitedCategoryIds.has(categoryId)) {
      visitedCategoryIds.add(categoryId);
      result.push(offer);
      console.log(
        `RES: push offer id: ${offer['id']}, category: ${offer['category']},` +
          ` minDist: ${offer['merchants'][0]['distance']}, valid_to: ${offer['valid_to']}`
      );
    } else {
      console.log(
        `Skip offer id: ${offer['id']}, distance: ${offer['merchants'][0]['distance']}` +
          ` due to another offer in the same category: ${offer['category']} with smaller distance was found`
      );
    }
  }

  return result;
}

function isValidCategory(offer, selectedCategoryIds) {
  if (!offer['category'] || typeof offer['category'] !== 'number' || !selectedCategoryIds.has(offer['category'])) {
    console.log(`Invalid category. Skip offer, id: ${offer['id']}`);
    return false;
  }
  return true;
}

function isValidOfferDate(offer, checkInDate) {
  const offerValidToDate = convertStringDateToDateObject(offer['valid_to'], acceptedDateFormats);
  if (
    !offer['valid_to'] ||
    !offerValidToDate ||
    !isOfferStillAvailableUntil(checkInDate, offerValidToDate, validRange)
  ) {
    console.log(`Invalid valid_to. Skip offer, id: ${offer['id']}`);
    return false;
  }
  return true;
}

function getMinDistanceMerchant(offer) {
  if (!offer['merchants'] || !(offer['merchants'] instanceof Array)) {
    console.log(`Invalid merchants field. Skip offer, id: ${offer['id']}`);
    return undefined;
  }

  const merchants = offer['merchants'];
  let min = Number.MAX_VALUE;
  let res;
  for (const merchant of merchants) {
    if (!merchant['distance'] || typeof merchant['distance'] !== 'number') continue;
    if (min > merchant['distance']) {
      min = merchant['distance'];
      res = merchant;
    }
  }

  return res;
}

function convertStringDateToDateObject(stringDate, acceptedDateFormats) {
  return moment(stringDate, acceptedDateFormats, true).isValid() ? new Date(stringDate) : undefined;
}

function isOfferStillAvailableUntil(checkInDate, offerValidToDate, validRange) {
  const copyCheckInDate = new Date(checkInDate);
  copyCheckInDate.setMilliseconds(copyCheckInDate.getMilliseconds() + validRange['milliseconds']);
  copyCheckInDate.setSeconds(copyCheckInDate.getSeconds() + validRange['seconds']);
  copyCheckInDate.setMinutes(copyCheckInDate.getMinutes() + validRange['minutes']);
  copyCheckInDate.setHours(copyCheckInDate.getHours() + validRange['hours']);
  copyCheckInDate.setDate(copyCheckInDate.getDate() + validRange['date']);
  copyCheckInDate.setMonth(copyCheckInDate.getMonth() + validRange['month']);
  copyCheckInDate.setFullYear(copyCheckInDate.getFullYear() + validRange['year']);
  return copyCheckInDate <= offerValidToDate;
}
