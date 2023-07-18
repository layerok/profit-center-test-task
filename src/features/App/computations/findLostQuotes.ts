let lastQuoteId: null | number = null;
let lostQuotes = 0;

export const findLostQuotes = (id: number) => {
  if (lastQuoteId !== null) {
    lostQuotes += id - lastQuoteId - 1;
  }
  lastQuoteId = id;
  return lostQuotes;
};
