let lastQuoteId: null | number = null;
let lostQuotes = 0;

export const recalculateLostQuotes = (id: number) => {
  if (lastQuoteId !== null) {
    lostQuotes += id - lastQuoteId - 1;
  }
  lastQuoteId = id;
  return lostQuotes;
};

export const getLastLostQuotes = () => {
  return lostQuotes;
}

export const resetLastLostQuotes = () => {
  lastQuoteId = null;
  lostQuotes = 0;
}
