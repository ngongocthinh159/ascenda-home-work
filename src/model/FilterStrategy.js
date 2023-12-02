class FilterStrategy {
  categoryFilterStrategy;
  offerDateFilterStrategy;
  merchantPriorityStrategy;
  offerPriorityStrategy;

  constructor(categoryFilterStrategy, offerDateFilterStrategy, merchantPriorityStrategy, offerPriorityStrategy) {
    this.categoryFilterStrategy = categoryFilterStrategy;
    this.offerDateFilterStrategy = offerDateFilterStrategy;
    this.merchantPriorityStrategy = merchantPriorityStrategy;
    this.offerPriorityStrategy = offerPriorityStrategy;
  }

  getCategoryFilterStrategy() {
    return this.categoryFilterStrategy;
  }

  getOfferDateFilterStrategy() {
    return this.offerDateFilterStrategy;
  }

  getMerchantPriorityStrategy() {
    return this.merchantPriorityStrategy;
  }

  getOfferPriorityStrategy() {
    return this.offerPriorityStrategy;
  }
}

module.exports = { FilterStrategy };
