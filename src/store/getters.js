import helpers from "@/assets/helpers";

export default {
  currency(state) {
    return state.selectedGameData.currency;
  },

  corporations(state) {
    return state.selectedGameData.corporations;
  },

  focusedCorporation(state) {
    return state.selectedGameData.corporations[state.focusedCorpIndex];
  },

  playerStockValue(state) {
    return helpers.sumMatrix(state, 0);
  },

  playerSimulatedIncome(state) {
    return helpers.sumMatrix(state, 1, state.simulatedRounds);
  },

  PlaceholderValuesHoldings(state) {
    return new Array(+state.selectedPlayerCount).fill("Share");
  },

  playerScore(state, getter) {
    return getter.playerStockValue.map(
      (val, idx) =>
        val + state.playersCash[idx] + getter.playerSimulatedIncome[idx]
    );
  },

  playerRanking(state, getters) {
    return getters.playerScore.map(
      (x, idx, z) => z.filter((w) => w > x).length + 1
    );
  },

  bankSummation(state, getter) {
    const cash = state.playersCash.reduce((acc, obj, idx) => {
      if (idx == 1) {
        return Number(acc) + Number(obj);
      } else {
        return Number(acc) + Number(obj);
      }
    });
    const simulatedIncome = getter.playerSimulatedIncome.reduce(
      (previousValue, currentValue) => {
        return previousValue + currentValue;
      }
    );

    return {
      simulatedIncome,
      cash,
      total: cash + simulatedIncome,
    };
  },

  playerCounts(state) {
    return new Array(
      state.selectedGameData.maxPlayer - state.selectedGameData.minPlayer + 1
    )
      .fill()
      .map((d, idx) => idx + state.selectedGameData.minPlayer);
  },
};
