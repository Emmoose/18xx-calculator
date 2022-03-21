import helpers from "@/assets/helpers";
import { version } from "../../package";

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

  playerScore(state, getter) {
    const playersScore = getter.playerStockValue.map(
      (val, idx) =>
        val + state.playersCash[idx] + getter.playerSimulatedIncome[idx]
    );

    return playersScore;
  },

  playerRanking(state, getters) {
    return getters.playerScore.map(
      (x, y, z) => z.filter((w) => w > x).length + 1
    );
  },

  bankSummation(state, getter) {
    const cash = state.playersCash.reduce((acc, obj, index) => {
      if (index == 1) {
        return Number(acc) + Number(obj);
      } else {
        return Number(acc) + Number(obj);
      }
    });

    return (
      getter.playerSimulatedIncome.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
      }) + cash
    );
  },

  playerCounts(state) {
    return new Array(
      state.selectedGameData.maxPlayer - state.selectedGameData.minPlayer + 1
    )
      .fill()
      .map((d, i) => i + state.selectedGameData.minPlayer);
  },

  updateLocalStorage(state) {
    localStorage.setItem(
      "savedXXGame",
      JSON.stringify({
        players: state.players,
        playersCash: state.playersCash,
        selectedGame: state.selectedGame,
        corporationsWealth: state.corporationsWealth,
        playerCorporationOwnership: state.playerCorporationOwnership,
        simulatedRounds: state.simulatedRounds,
        version: version,
      })
    );
  },
};
