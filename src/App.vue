<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body, p, div, h1, h2,h3, h4, h5, ul, li{
  user-select: none;
  margin: 0;
  padding: 0;
  position: relative;
  color: black;
  font-size: 16px;
}
ul, li{
  list-style: none;
}
a{
  text-decoration: none;
}
.cesium-viewer-bottom{
  display: none !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
