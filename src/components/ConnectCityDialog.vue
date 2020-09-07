<template lang="pug">
q-dialog(
  :value='open'
  @hide='$emit("close")')
  q-card.add-city-dialog
    q-card-section
      .text-h6 Conectar cidades
      .text-subtitle Selecione as cidades para adicionar uma conexão da primeira para a segunda
    q-card-section.column
      q-select(
        outlined
        emit-value
        label='Primeira cidade'
        :options='city1Options'
        v-model='city1')
      q-icon(name='arrow_downward' size='lg').self-center.q-my-md
      q-select(
        outlined
        emit-value
        label='Segunda cidade'
        :options='city2Options'
        :disabled='!city1'
        :readonly='!city1'
        v-model='city2')
    q-card-actions(align='right')
      q-btn(
        flat
        color='negative'
        label='Cancelar'
        @click='$emit("close")')
      q-btn(
        color='secondary'
        label='Adicionar'
        @click='onConnect')
</template>

<script>
export default {
  name: 'ConnectCityDialog',
  components: {
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    cities: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    city1: '',
    city2: '',
  }),
  computed: {
    city1Options() {
      return this.cities.map((city) => ({ label: `${city.name} - ${city.code}`, value: city.code }));
    },
    city2Options() {
      return this.cities
        .filter((city) => city.code !== this.city1)
        .map((city) => ({ label: `${city.name} - ${city.code}`, value: city.code }));
    },
  },
  methods: {
    onConnect() {
      this.$emit('connect', { city1: this.city1, city2: this.city2 });
      this.city1 = '';
      this.city2 = '';
      this.$emit('close');
    },
  },
};
</script>

<style lang='stylus' scoped>
.add-city-dialog
  color $accent
</style>
