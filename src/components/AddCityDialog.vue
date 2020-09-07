<template lang="pug">
q-dialog(
  :value='open'
  @hide='$emit("close")')
  q-card.add-city-dialog
    q-card-section
      .text-h6 Adicionar cidade
      .text-subtitle Digite o nome e o código IATA da cidade
    q-card-section
      q-input(
        outlined
        label='Nome'
        v-model='city.name').q-mb-md
      q-input(
        outlined
        label='Código IATA'
        v-model='city.code')
    q-card-actions(align='right')
      q-btn(
        flat
        color='negative'
        label='Cancelar'
        @click='$emit("close")')
      q-btn(
        color='secondary'
        label='Adicionar'
        @click='onAdd')
</template>

<script>
export default {
  name: 'AddCityDialog',
  components: {
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    city: {
      name: '',
      code: '',
    },
  }),
  computed: {
  },
  methods: {
    onAdd() {
      this.$emit('add', this.city);
      Object.assign(this.city, {
        name: '',
        code: '',
      });
      this.$emit('close');
    },
  },
};
</script>

<style lang='stylus' scoped>
.add-city-dialog
  color $accent
</style>
