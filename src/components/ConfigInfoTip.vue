<template>
  <div class="tooltip">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
      <rect x="7" y="6" width="1" height="5" fill-rule="evenodd" clip-rule="evenodd" fill="#666766" />
      <rect x="7" y="4" width="1" height="1" fill-rule="evenodd" clip-rule="evenodd" fill="#666766" />
      <path d="M7.5,1C3.9,1,1,3.9,1,7.5S3.9,14,7.5,14 S14,11.1,14,7.5S11.1,1,7.5,1z M7.5,13C4.5,13,2,10.5,2,7.5C2,4.5,4.5,2,7.5,2S13,4.5,13,7.5C13,10.5,10.5,13,7.5,13z" fill-rule="evenodd" clip-rule="evenodd" fill="#666766" />
    </svg>
    <span class="tooltiptext">
      Visit the Tableau Extension Gallery at extensiongallery.tableau.com to learn how to set up and use this extension!
    </span>
  </div>
</template>

<script>
export default {
  name: 'ConfigInfoTip',
};
</script>

<style scoped>
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

.tooltip {
  position: relative;
  display: inline-block;
  margin-left: 5px;
  padding-top: 2px;
}

.tooltip .tooltiptext {
  visibility: hidden;
  border: 1px solid #d4d4d4;
  border-radius: 1px;
  background: #fff;
  font-family: 'Benton Sans', Arial, Helvetica, sans-serif;
  font-size: 11px;
  padding: 8px;
  width: 200px;
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 20px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltiptext ol {
  padding: 0px 8px 0px 16px;
  margin: 0px;
}

.tooltiptext li {
  margin-top: 8px;
}
</style>
