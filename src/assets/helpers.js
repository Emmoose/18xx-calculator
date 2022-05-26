import { version } from "../../package";

export default {
  updateMatrix: function (state, matrix, payload) {
    const tempMatrix = state[matrix].map((row) => row.map((data) => data));
    tempMatrix[payload.rowIndex][payload.cellIndex] = payload.cellValue
      ? payload.cellValue
      : null;

    return tempMatrix;
  },

  sumMatrix: function (state, rowIndex, simulatedRounds = 1, fraction = 1) {
    const summaryMatrix = state.playerCorporationOwnership.map(
      (corpOwningList, idx) => {
        let numberShare = 10;

        if (state.multipleShare && rowIndex === 0) {
          numberShare = state.multipleShareSelected[idx];
        }

        return corpOwningList.map(
          (corpOwning) =>
            ((corpOwning * fraction * state.corporationsWealth[idx][rowIndex]) /
              100) *
            numberShare * // 100 is to make it into %
            simulatedRounds
        );
      }
    );

    return summaryMatrix[0].map((x, idx) =>
      summaryMatrix.reduce((sum, curr) => sum + curr[idx], 0)
    );
  },

  sumMatrixAdvancedSimulation: function (state, simulatedRounds, fraction = 1) {
    const summaryMatrix = state.playerCorporationOwnership.map(
      (corpOwningList, idx) =>
        corpOwningList.map((corpOwning) => {
          let value = 0;
          for (let index = 1; index <= simulatedRounds; index++) {
            value +=
              (corpOwning * fraction * state.corporationsWealth[idx][index]) /
              10;
          }
          return value;
        })
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
        advancedSimulation: state.advancedSimulation,
        shareStructure: state.selectedGameData.shareStructure,
        multipleShareSelected: state.multipleShareSelected,
        version: version,
      })
    );
  },
};
