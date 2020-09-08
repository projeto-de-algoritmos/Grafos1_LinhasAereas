<template lang='pug'>
q-page.row.index
  .col-xs-12.col-sm-6.col-md-4.column.items-center
    //- q-btn(
      color='secondary'
      label='Adicionar cidade'
      @click='openAirlineAddCityDialog = true').q-mt-md
    //- q-btn(
      color='secondary'
      label='Conectar cidade'
      @click='openAirlineConnectCityDialog = true').q-mt-md
    //- q-card.add-city-dialog
    //-   q-card-section
    //-     .text-h6 Achar
    //-     .text-subtitle Selecione as cidades para adicionar uma conexão da primeir
    //-   q-card-section.column
    //-     q-select(
    //-       outlined
    //-       emit-value
    //-       label='Primeira cidade'
    //-       :options='city1Options'
    //-       v-model='city1')
    //-     q-icon(name='arrow_downward' size='lg').self-center.q-my-md
    //-     q-select(
    //-       outlined
    //-       emit-value
    //-       label='Segunda cidade'
    //-       :options='city2Options'
    //-       :disabled='!city1'
    //-       :readonly='!city1'
    //-       v-model='city2')
      q-card-actions(align='center')
        q-btn(
          color='secondary'
          label='Buscar rota'
          @click='onBFS')
  .col-xs-12.col-sm-6.col-md-8.column
    .col-1.column.items-center.justify-center
      .text-h3.graph-title Conexões
    .col-11.q-pa-md
      #sigma-container
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
import citiesData from 'src/domain/airline-data.json';

export default {
  name: 'PageIndex',
  components: {
    AddCityDialog,
    ConnectCityDialog,
  },
  data: () => ({
    airline: new Airline(),
    openAirlineAddCityDialog: false,
    openAirlineConnectCityDialog: false,
    sigmaObject: {},
    path: [],
  }),
  computed: {
    graph() {
      return {
        nodes: this.nodes,
        edges: this.edges,
      };
    },
    nodes() {
      return this.airline.cities.map((city) => ({
        id: city.code,
        label: city.name,
        x: Math.random(),
        y: Math.random(),
        size: 2,
        color: '#a5cc1f',
      }));
    },
    edges() {
      const edges = [];
      const { cities } = this.airline;

      let i = 0;
      cities.forEach((city) => {
        city.connections.forEach((connectionCode) => {
          edges.push({
            id: i,
            source: city.code,
            target: connectionCode,
            color: '#46516d',
            type: 'curvedArrow',
          });

          i += 1;
        });
      });

      return edges;
    },
  },
  methods: {
    randomNumber(min, max) {
      return Math.random() * (max - min) + min;
    },
    populateAirline() {
      citiesData.map((cityData) => this.airline.addCity(cityData.name, cityData.code));
      citiesData.forEach((city) => {
        for (let i = 0; i <= this.randomNumber(2, 5); i += 1) {
          const randomIndex = Math.round(this.randomNumber(0, citiesData.length - 1));
          this.airline.addConnection(
            city.code,
            citiesData[randomIndex].code,
          );
        }
      });
    },
    onAddCity({ name, code }) {
      this.airline.addCity(name, code);
      this.sigmaObject.graph.read(this.graph);
      this.sigmaObject.refresh();
    },
    onConnectCity({ city1, city2 }) {
      this.airline.addConnection(city1, city2);
      this.sigmaObject.graph.read(this.graph);
      this.sigmaObject.refresh();
    },
    initializeSigma() {
      this.sigmaObject = new sigma( // eslint-disable-line
        {
          renderer: {
            container: document.getElementById('sigma-container'),
            type: 'canvas',
          },
          settings: {
            edgeLabelSize: 'proportional',
            minArrowSize: 10,
          },
        },
      );

      this.sigmaObject.graph.read(this.graph);
      this.sigmaObject.refresh();
    },
    onBFS() {},
  },
  mounted() {
    this.populateAirline();
    this.initializeSigma();
  },
};
</script>

<style lang="stylus">
.index
  .graph-title
    color $accent
  #sigma-container
    background #fafafa
    width 100%
    height 100%
</style>
