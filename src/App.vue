<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <NavBar />

    <main class="container">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 300px);
}
</style>
