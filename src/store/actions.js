import gameData from "@/assets/gameData.json";
import helpers from "@/assets/helpers";

export default {
  setupGameOptions({ commit }) {
    commit(
      "SET_GAME_OPTIONS",
      gameData.map((game) => game.gameName)
    );
  },

  setupCachedGame({ commit }, savedXXGame) {
    commit("SET_GAME", savedXXGame.selectedGame);

    const selectedGameData = helpers.findSelectedGameData(
      gameData,
      savedXXGame.selectedGame
    );

    commit("SET_GAME_DATA", selectedGameData);
    commit("SET_PLAYER_COUNT", savedXXGame.players.length);
    commit("SET_SIMULATED_ROUNDS", savedXXGame.simulatedRounds);
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
  },

  setupNewGame({ commit, dispatch, state }, gameName) {
    commit("SET_GAME", gameName);
    commit("SET_SIMULATED_ROUNDS", 0);
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

  updateCorporationWealth({ state }, payload) {
    const tempMatrix = helpers.updateMatrix(
      state,
      "corporationsWealth",
      payload
    );

    this.commit("SET_CORPORATIONS_WEALTH", tempMatrix);
    helpers.updateLocalStorage(state);
  },

  updateCorporationOwnership({ state }, payload) {
    const tempMatrix = helpers.updateMatrix(
      state,
      "playerCorporationOwnership",
      payload
    );
    this.commit("SET_PLAYERS_CORPORATION_OWNERSHIP", tempMatrix);
    helpers.updateLocalStorage(state);
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

  setSimulatedRounds({ commit, state }, payload) {
    commit("SET_SIMULATED_ROUNDS", payload ? payload : 0);
    helpers.updateLocalStorage(state);
  },
};
