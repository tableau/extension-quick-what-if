<template>
  <div class="cover">
    <div class="error">
      The extension needs to be
      <a v-if="mode === 'authoring'" href="javascript:" @click="$emit('configure')"> configured.</a>
      <span v-else>
        configured.
        <br />
        Please contact the dashboard author
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvalidConfig',
  props: {
    mode: String,
  },
};
</script>

<style scoped>
.cover {
  width: 100%;
  height: 100%;
  z-index: 10;
  background: #ebe9e9;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

a {
  color: #1a699e;
  font-weight: bold;
  text-decoration: none;
}

a:hover {
  color: #2a79af;
  text-decoration: underline;
}

a:active {
  color: #15557f;
  text-decoration: underline;
}

a:focus {
  border-color: #3498db;
  box-shadow: 0 0 4px 0 #3498db;
  outline: none;
}
</style>
