import gameData from "@/assets/gameData.json";
import helpers from "@/assets/helpers";

const PERCENTAGE100 = 100;

export default {
  setupGameOptions({ commit }) {
    commit(
      "SET_GAME_OPTIONS",
      gameData.map((game) => game.gameName)
    );
  },

  setupCachedGame({ commit, dispatch }, savedXXGame) {
    commit("SET_GAME", savedXXGame.selectedGame);

    const selectedGameData = helpers.findSelectedGameData(
      gameData,
      savedXXGame.selectedGame
    );

    commit("SET_GAME_DATA", selectedGameData);
    commit("SET_PLAYER_COUNT", savedXXGame.players.length);
    commit("SET_SIMULATED_ROUNDS", savedXXGame.simulatedRounds);
    commit("TOGGLE_ADVANCED_SIMULATION", savedXXGame.advancedSimulation);
    commit("SET_PLAYERS_CASH", savedXXGame.playersCash.slice());
    commit("SET_PLAYERS", savedXXGame.players.slice());
    commit(
      "SET_CORPORATIONS_WEALTH",
      savedXXGame.corporationsWealth.map((row) => row.map((data) => data))
    );

    commit(
      "SET_PLAYERS_CORPORATION_OWNERSHIP",
      savedXXGame.playerCorporationOwnership.map((row) =>
        row.map((data) => data)
      )
    );

    commit("TOGGLE_MULTIPLE_SHARE", savedXXGame.shareStructure.multipleShare);

    commit("SET_MULTIPLE_SHARE_SELECTED", savedXXGame.multipleShareSelected);
    dispatch("checkPercentageLimits", savedXXGame.playerCorporationOwnership);
  },

  setupNewGame({ commit, dispatch, state }, gameName) {
    commit("SET_GAME", gameName);
    commit("SET_SIMULATED_ROUNDS", 0);
    commit("SET_ABOVE_100_PERCENTAGE", []);
    dispatch("setupSelectedGameData");
    dispatch("setupMatrixes");

    helpers.updateLocalStorage(state);
  },

  setupSelectedGameData({ commit, state }) {
    const selectedGameData = helpers.findSelectedGameData(
      gameData,
      state.selectedGame
    );

    commit("SET_GAME_DATA", selectedGameData);
    commit("SET_PLAYER_COUNT", selectedGameData.minPlayer);
    commit("SET_PLAYERS_CASH", Array(selectedGameData.minPlayer).fill(null));
    commit(
      "TOGGLE_MULTIPLE_SHARE",
      selectedGameData.shareStructure.multipleShare
    );

    if (selectedGameData.shareStructure.multipleShare) {
      commit(
        "SET_MULTIPLE_SHARE_SELECTED",
        Array(selectedGameData.corporations.length).fill(
          selectedGameData.shareStructure.shareVersions[0]
        )
      );
    }
  },

  setShareOption({ commit, state }, payload) {
    const copyMultipleShareSelected = state.multipleShareSelected.slice();

    copyMultipleShareSelected[payload.index] = parseInt(payload.value);
    commit("SET_MULTIPLE_SHARE_SELECTED", copyMultipleShareSelected);
    helpers.updateLocalStorage(state);
  },

  setupMatrixes({ commit, state }) {
    commit(
      "SET_PLAYERS",
      Array.from(
        new Array(state.selectedPlayerCount),
        (val, idx) => "player-" + (idx + 1)
      )
    );

    commit(
      "SET_CORPORATIONS_WEALTH",
      Array.from(Array(state.selectedGameData.corporations.length), () =>
        new Array(2).fill(null)
      )
    );

    commit(
      "SET_PLAYERS_CORPORATION_OWNERSHIP",
      Array.from(Array(state.selectedGameData.corporations.length), () =>
        new Array(state.selectedPlayerCount).fill(null)
      )
    );
  },

  updateCorporationWealth({ commit, state }, payload) {
    const tempMatrix = helpers.updateMatrix(
      state,
      "corporationsWealth",
      payload
    );

    commit("SET_CORPORATIONS_WEALTH", tempMatrix);
    helpers.updateLocalStorage(state);
  },

  addColumnCorporationWealth({ commit, state }, payload) {
    const tempMatrix = state.corporationsWealth.map((row) => [
      ...row.map((data) => data),
      ...Array(payload).fill(null),
    ]);

    commit("SET_CORPORATIONS_WEALTH", tempMatrix);
  },

  removeColumnCorporationWealth({ commit, state }, payload) {
    const tempMatrix = state.corporationsWealth.map((row) =>
      row.slice(0, -payload)
    );
    commit("SET_CORPORATIONS_WEALTH", tempMatrix);
  },

  copyColumnCorporatioNWealth({ commit, state }, payload) {
    const tempMatrix = state.corporationsWealth.map((row) => {
      row[payload.indexTo] = row[payload.indexFrom];

      return row;
    });

    commit("SET_CORPORATIONS_WEALTH", tempMatrix);
  },

  checkPercentageLimits({ commit, state }, payload) {
    const tempCheck = payload.map(
      (row) =>
        row.reduce((value1, value2) => value1 + value2, 0) <= PERCENTAGE100
    );

    const tempWarnings = [];

    tempCheck.forEach((value, index) => {
      if (!value) {
        tempWarnings.push(state.selectedGameData.corporations[index].name);
      }
    });

    commit("SET_ABOVE_100_PERCENTAGE", tempWarnings);
  },

  updateCorporationOwnership({ commit, dispatch, state }, payload) {
    if (payload.cellValue <= PERCENTAGE100) {
      const tempMatrix = helpers.updateMatrix(
        state,
        "playerCorporationOwnership",
        payload
      );

      dispatch("checkPercentageLimits", tempMatrix);

      commit("SET_PLAYERS_CORPORATION_OWNERSHIP", tempMatrix);
      helpers.updateLocalStorage(state);
    }
  },

  updatePlayerCash({ state, commit }, payload) {
    const cash = state.playersCash.slice();
    cash[payload.index] = payload.value ? payload.value : null;

    commit("SET_PLAYERS_CASH", cash);
    helpers.updateLocalStorage(state);
  },

  updatePlayerName({ state, commit }, payload) {
    const players = state.players.slice();
    players[payload.index] = payload.value;

    commit("SET_PLAYERS", players);
    helpers.updateLocalStorage(state);
  },

  changePlayerCount({ state, commit }, payload) {
    const changePlayerCount = payload - state.selectedPlayerCount;

    if (changePlayerCount > 0) {
      commit(
        "SET_PLAYERS",
        state.players.concat(
          Array.from(
            new Array(changePlayerCount),
            (val, idx) => "player-" + (state.selectedPlayerCount + idx + 1)
          )
        )
      );

      commit(
        "SET_PLAYERS_CASH",
        state.playersCash.concat(Array(changePlayerCount).fill(null))
      );

      commit(
        "SET_PLAYERS_CORPORATION_OWNERSHIP",
        state.playerCorporationOwnership.map((row) =>
          row.concat(Array(changePlayerCount).fill(null))
        )
      );
    } else if (changePlayerCount < 0) {
      commit("SET_PLAYERS_CASH", state.playersCash.slice(0, changePlayerCount));
      commit("SET_PLAYERS", state.players.slice(0, changePlayerCount));
      commit(
        "SET_PLAYERS_CORPORATION_OWNERSHIP",
        state.playerCorporationOwnership.map((row) =>
          row.slice(0, changePlayerCount)
        )
      );
    }

    commit("SET_PLAYER_COUNT", payload);
    helpers.updateLocalStorage(state);
  },

  setSimulatedRounds({ commit, dispatch, state }, payload) {
    if (state.advancedSimulation) {
      if (payload > state.simulatedRounds) {
        if (state.simulatedRounds === 0) {
          dispatch("addColumnCorporationWealth", payload - 1);
        } else {
          dispatch(
            "addColumnCorporationWealth",
            payload - state.simulatedRounds
          );
        }
      } else if (state.simulatedRounds > payload) {
        if (payload == 0 && state.simulatedRounds !== 1) {
          dispatch("removeColumnCorporationWealth", state.simulatedRounds - 1);
        } else if (state.simulatedRounds !== 1) {
          dispatch(
            "removeColumnCorporationWealth",
            state.simulatedRounds - payload
          );
        }
      }
    }

    commit("SET_SIMULATED_ROUNDS", payload ? payload : 0);
    helpers.updateLocalStorage(state);
  },

  toggleAdvancedSimulation({ commit, state }, payload) {
    let tempMatrix = [];

    if (payload && state.simulatedRounds > 1) {
      tempMatrix = state.corporationsWealth.map((row) => [
        row[0],
        row[1],
        ...Array(state.simulatedRounds - 1).fill(null),
      ]);

      commit("SET_CORPORATIONS_WEALTH", tempMatrix);
    } else if (!payload) {
      tempMatrix = state.corporationsWealth.map((row) => [row[0], row[1]]);
      commit("SET_CORPORATIONS_WEALTH", tempMatrix);
    }

    commit("TOGGLE_ADVANCED_SIMULATION", payload);
    helpers.updateLocalStorage(state);
  },
};
