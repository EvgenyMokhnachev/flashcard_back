<template>
  <div id="app">
    My Vue app ddds sss TEST
    <Test />
  </div>
</template>

<style>

</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import Test from "@components/Test";

@Component({
  components: {Test}
})
export default class extends Vue {

}
</script>
