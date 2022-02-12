<template>
  <div
    v-if="showHintOwnershipTable || showHintWealthTable"
    class="corp-name-mobile"
    :style="{
      'background-color': inputFocusedCorporation.color,
      color: inputFocusedCorporation.text,
    }"
  >
    {{ inputFocusedCorporation.name }}
  </div>
</template>

<script>
export default {
  name: "CorpHintMobile",

  props: {
    showHintWealthTable: Boolean,
    showHintOwnershipTable: Boolean,
    inputFocusedCorporation: Object,
  },
};
</script>

<style lang="less" src="../assets/less/_CorpHintMobile.less" scoped></style>
