const { OfferPriorityStrategy } = require('./OfferPriorityStrategy');
const { PriorityQueue } = require('@datastructures-js/priority-queue');

class SimpleOfferPriorityStrategy extends OfferPriorityStrategy {
  pq;
  maxReturnedOfferNumbers;
  container;

  constructor(maxReturnedOfferNumbers) {
    super();
    this.maxReturnedOfferNumbers = maxReturnedOfferNumbers;
    this.pq = new PriorityQueue(this.minHeapStrategy);
    this.container = {
      pushValidOffer: (offer) => {
        this.pq.push(offer);
      },
      getMostPrioritizedOffers: () => {
        return this.getListOfOffersBasedOnConstraints();
      },
    };
  }

  getContainer() {
    return this.container;
  }

  getListOfOffersBasedOnConstraints() {
    const backup = this.pq;

    const result = [];
    const visitedCategoryIds = new Set();
    while (this.pq.size() && result.length < this.maxReturnedOfferNumbers) {
      const offer = this.pq.front();
      this.pq.pop();
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

    this.pq = backup;
    return result;
  }

  minHeapStrategy(offer1, offer2) {
    if (offer1['merchants'][0]['distance'] > offer2['merchants'][0]['distance']) return 1;
    return -1;
  }
}

module.exports = { SimpleOfferPriorityStrategy };
