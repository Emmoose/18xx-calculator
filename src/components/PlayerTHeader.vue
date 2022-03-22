<template>
  <th>
    <input type="text" v-model.number="nameComputed" @focus="focusName" />
  </th>
</template>

<script>
export default {
  name: "PlayerTHeader",
  props: {
    index: Number,
    name: String,
  },

  methods: {
    focusName() {
      this.setName("");
    },

    setName(name) {
      this.$store.dispatch("updatePlayerName", {
        index: this.index,
        value: name,
      });
    },
  },
  computed: {
    nameComputed: {
      get() {
        return this.name;
      },
      set(value) {
        this.setName(String(value));
      },
    },
  },
};
</script>
