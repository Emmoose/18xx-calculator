import { version } from "../../package";

export default {
  updateMatrix: function (state, matrix, payload) {
    const tempMatrix = state[matrix].map((row) => row.map((data) => data));
    tempMatrix[payload.rowIndex][payload.cellIndex] = payload.cellValue
      ? payload.cellValue
      : null;

    return tempMatrix;
  },

  sumMatrix: function (state, rowIndex, simulatedRounds = 1) {
    const summaryMatrix = state.playerCorporationOwnership.map(
      (corpOwningList, idx) =>
        corpOwningList.map(
          (corpOwning) =>
            ((corpOwning * state.corporationsWealth[idx][rowIndex]) / 10) *
            simulatedRounds
        )
    );

    return summaryMatrix[0].map((x, idx) =>
      summaryMatrix.reduce((sum, curr) => sum + curr[idx], 0)
    );
  },

  findSelectedGameData(gameData, selectedGame) {
    return gameData.filter((game) => game.gameName == selectedGame)[0];
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
