const { FilterStrategy } = require('./model/FilterStrategy');
const {
  SelectedListCategoryFilterStrategy,
} = require('./model/category-filter-strategy/SelectedListCategoryFilterStrategy');
const { RangeOfferDateFilterStrategy } = require('./model/offer-date-filter-strategy/RangeOfferDateFilterStrategy');
const {
  MinDistMerchantPriorityStrategy,
} = require('./model/merchant-priority-strategy/MinDistMerchantPriorityStrategy');
const { SimpleOfferPriorityStrategy } = require('./model/offer-priority-strategy/SimpleOfferPriorityStrategy');
const { convertStringDateToDateObject } = require('./utils/utils');
const fs = require('fs').promises;
const path = require('path');

// Setup
const acceptedDateFormats = ['YYYY-MM-DD'];
const selectedCategoryIds = [1, 2, 4];
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
    const parsedInput = JSON.parse(await fs.readFile(path.join(__dirname, 'input.json'), 'utf8'));
    if (!parsedInput['offers'] || !(parsedInput['offers'] instanceof Array)) throw new Error('invalid input format');

    // Filter offers
    const offerDetails = parsedInput['offers'];
    const filterStrategy = new FilterStrategy(
      new SelectedListCategoryFilterStrategy(selectedCategoryIds),
      new RangeOfferDateFilterStrategy(checkInDate, validRange, acceptedDateFormats),
      new MinDistMerchantPriorityStrategy(), // Use can try MaxDistMerchantPriorityStrategy
      new SimpleOfferPriorityStrategy(MAX_NUMBER_OF_RETURNED_OFFERS)
    );
    const filteredOffers = filter(offerDetails, filterStrategy);
    const result = { offers: filteredOffers };

    // Output result
    await fs.writeFile(path.join(__dirname, 'output.json'), JSON.stringify(result, undefined, 4));
  } catch (err) {
    console.error(err);
  }
})();

function filter(offerDetails, filterStrategy) {
  const offersContainer = filterStrategy.getOfferPriorityStrategy().getContainer();

  console.log(`filtering offer..`);
  // Filter offers based on strategies
  // For a valid offer => Push it into the container (latter use container to get the most prioritized offers)
  for (let offer of offerDetails) {
    if (!filterStrategy.getCategoryFilterStrategy().isChosen(offer)) continue;

    if (!filterStrategy.getOfferDateFilterStrategy().isChosen(offer)) continue;

    if (!filterStrategy.getMerchantPriorityStrategy().reduceToPrioritizedMerchants(offer)) continue;

    // Valid offer => Store offer to container
    console.log(`PQ: push offer id: ${offer['id']}, category: ${offer['category']},`);
    offersContainer.pushValidOffer(offer);
  }
  console.log('filtering done!\n');

  // Get most prioritized offers from container (based on constraints)
  return offersContainer.getMostPrioritizedOffers();
}
