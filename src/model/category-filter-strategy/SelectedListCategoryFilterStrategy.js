const { CategoryFilterStrategy } = require('./CategoryFilterStrategy');

class SelectedListCategoryFilterStrategy extends CategoryFilterStrategy {
  selectedCategoryIds;

  constructor(selectedList) {
    super();
    this.selectedCategoryIds = new Set(selectedList);
  }

  isChosen(offer) {
    if (
      !offer['category'] ||
      typeof offer['category'] !== 'number' ||
      !this.selectedCategoryIds.has(offer['category'])
    ) {
      console.log(`Invalid category. Skip offer, id: ${offer['id']}`);
      return false;
    }
    return true;
  }
}

module.exports = { SelectedListCategoryFilterStrategy };
