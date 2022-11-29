<template>
  <div class="test-component">
    test-component s
  </div>
</template>

<style>

</style>

<script lang="ts">
import Vue from "vue";

export default class extends Vue {

  ttt: string = "s";

  onClick() {
    console.log('awd');
  }

}
</script>
