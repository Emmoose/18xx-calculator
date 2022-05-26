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
    return state.advancedSimulation
      ? helpers.sumMatrixAdvancedSimulation(state, state.simulatedRounds, 0.1)
      : helpers.sumMatrix(state, 1, state.simulatedRounds, 0.1);
  },

  placeholderValuesWealth(state) {
    let data;
    if (state.advancedSimulation) {
      data = Array.from(
        new Array(state.simulatedRounds ? state.simulatedRounds : 1),
        (val, idx) => "OR " + (idx + 1)
      );

      data.unshift("Stock");
    } else {
      data = [" Stock", "Revenue"];
    }

    return data;
  },

  placeholderValuesHoldings(state) {
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
