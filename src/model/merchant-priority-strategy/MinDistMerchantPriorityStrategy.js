const { MerchantPriorityStrategy } = require('./MerchantPriorityStrategy');

class MinDistMerchantPriorityStrategy extends MerchantPriorityStrategy {
  reduceToPrioritizedMerchants(offer) {
    if (!offer['merchants'] || !(offer['merchants'] instanceof Array)) {
      console.log(`Invalid merchants field. Skip offer, id: ${offer['id']}`);
      return false;
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

    if (res) {
      offer['merchants'] = [res];
      return true;
    } else {
      console.log(`No min distance merchant found. Skip offer, id: ${offer['id']}`);
      return false;
    }
  }
}

module.exports = { MinDistMerchantPriorityStrategy };
