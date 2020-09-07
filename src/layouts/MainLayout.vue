<template lang='pug'>
  q-layout(view='lHh Lpr lFf')
    q-header(elevated)
      q-toolbar
        img(src='logo.png').logo.q-pa-sm
        q-toolbar-title Linhas Aereas
    q-footer(elevated)
      q-toolbar
        span.logo-attribution
          | Icons made by&nbsp;
          a(href="https://www.flaticon.com/authors/freepik" title="Freepik") Freepik
          | &nbsp;from&nbsp;
          a(href="https://www.flaticon.com/" title="Flaticon") www.flaticon.com
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'MainLayout',
  data: () => ({
  }),
};
</script>

<style lang="stylus">
.logo
  width 50px
  height auto
.logo-attribution
  a
    color white
</style>
