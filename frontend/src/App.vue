<script setup>
</script>

<template>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700"
    rel="stylesheet">

  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0" />

  <router-view></router-view>

</template>

<style>
@font-face {
  font-family: 'FranieBlack';
  src: url('assets/FranieFontFamily/FranieVariableTest-Black.otf') format('opentype');
}
@font-face {
  font-family: 'FranieSemiBold';
  src: url('assets/FranieFontFamily/FranieVariableTest-SemiBold.otf') format('opentype');
}

body {
  margin: 0;
  background-color: black;
  color: white;
  overflow-x: hidden;

  font-family: "Familjen Grotesk", sans-serif;
  font-size: 1.5rem;

  ::selection {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
}

h1 {
  font-family: "FranieBlack", sans-serif;
}
h2 {
  font-family: "FranieSemiBold", sans-serif;
}

.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-size: 3rem;
  user-select: none;
}

button {
  font-family: "Familjen Grotesk", sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
    padding-bottom: 0.15rem;
  }
  .material-symbols-rounded {
    font-size: 2rem !important;
    margin-right: 0.5rem;
  }
}

</style>
