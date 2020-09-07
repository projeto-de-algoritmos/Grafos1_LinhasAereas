<template lang='pug'>
q-page.flex.flex-center
  q-btn(
    color='secondary'
    label='Adicionar cidade'
    @click='openAirlineAddCityDialog = true')
  q-btn(
    color='secondary'
    label='Conectar cidade'
    @click='openAirlineConnectCityDialog = true')
  add-city-dialog(
    :open='openAirlineAddCityDialog'
    @close='openAirlineAddCityDialog = false'
    @add='onAddCity')
  connect-city-dialog(
    :cities='airline.cities'
    :open='openAirlineConnectCityDialog'
    @close='openAirlineConnectCityDialog = false'
    @connect='onConnectCity')
</template>

<script>
import Airline from 'src/domain/airline';
import AddCityDialog from 'src/components/AddCityDialog';
import ConnectCityDialog from 'src/components/ConnectCityDialog';

export default {
  name: 'PageIndex',
  components: {
    AddCityDialog,
    ConnectCityDialog,
  },
  data: () => ({
    airline: null,
    openAirlineAddCityDialog: false,
    openAirlineConnectCityDialog: false,
  }),
  methods: {
    onAddCity({ name, code }) {
      this.airline.addCity(name, code);
      console.log(this.airline);
    },
    onConnectCity({ city1, city2 }) {
      this.airline.addConnection(city1, city2);
      console.log(this.airline);
    },
  },
  mounted() {
    this.airline = new Airline();
  },
};
</script>
