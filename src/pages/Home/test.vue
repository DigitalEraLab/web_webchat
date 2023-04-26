<template>
  <div class="slider-demo-block">
    <el-slider v-model="value" show-input />
  </div>
</template>

<script setup>
import { ref } from "vue";
const value = ref(0);
</script>

<style lang="scss" scoped>
.slider {
  width: 200px;
  height: 10px;
  background-color: #ccc;
  cursor: pointer;
  position: relative;
}

.knob {
  width: 20px;
  height: 20px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  left: 0;
  transform: translateX(-50%);
  cursor: pointer;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
