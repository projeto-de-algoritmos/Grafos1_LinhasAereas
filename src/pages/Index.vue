<template lang='pug'>
q-page.row.index
  .col-xs-12.col-sm-6.col-md-4.column.items-center
    q-card.find-path-card.q-mt-sm
      q-card-section.no-padding.q-mx-md
        .text-h6 Achar menor distância entre duas cidades
        .text-subtitle Selecione as cidades que se deseja saber o menor caminho
      q-card-section.column.no-padding.q-mx-md.q-my-sm
        q-select(
          outlined
          emit-value
          label='Primeira cidade'
          :options='city1Options'
          v-model='city1').no-padding
        q-icon(
          size='lg'
          color='accent'
          name='arrow_downward').self-center
        q-select(
          outlined
          emit-value
          label='Segunda cidade'
          :options='city2Options'
          :disabled='!city1'
          :readonly='!city1'
          v-model='city2').no-padding
      q-card-actions(align='center')
        q-btn(
          color='secondary'
          label='Buscar rota'
          @click='onBFS')
    q-separator.q-mt-md.q-pl-md
    .text-h6.q-my-sm Menor caminho
    .solution.q-px-md
      #sigma-solution-container.shadow-2
  .col-xs-12.col-sm-6.col-md-8.column
    .col-1.column.items-center.justify-center
      .text-h3.graph-title Conexões
    .col-11.q-pa-md
      #sigma-container.shadow-2
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
    city1: '',
    city2: '',
    sigmaObject: {},
    sigmaSolution: {},
    path: [],
  }),
  computed: {
    city1Options() {
      return this.airline.cities.map((city) => ({
        label: `${city.name} - ${city.code}`,
        value: city.code,
      }));
    },
    city2Options() {
      return this.airline.cities
        .filter((city) => city.code !== this.city1)
        .map((city) => ({ label: `${city.name} - ${city.code}`, value: city.code }));
    },
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
    graphSolution() {
      return {
        nodes: this.nodesSolution,
        edges: this.edgesSolution,
      };
    },
    nodesSolution() {
      return this.path.map((cityCode) => {
        const city = this.airline.findCity(cityCode);
        return {
          id: city.code,
          label: city.name,
          x: Math.random(),
          y: Math.random(),
          size: 2,
          color: '#a5cc1f',
        };
      });
    },
    edgesSolution() {
      const edges = [];

      let i = 0;
      this.path.forEach((cityCode, index) => {
        if (this.path[index + 1]) {
          edges.push({
            id: i,
            source: cityCode,
            target: this.path[index + 1],
            color: '#46516d',
            type: 'curvedArrow',
          });

          i += 1;
        }
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
    clearElement() {
      const canvasSolutionElement = document.getElementById('sigma-solution-container');
      canvasSolutionElement.innerHTML = '';
    },
    initializeSigmaSolution() {
      this.clearElement();
      this.sigmaSolution = new sigma( // eslint-disable-line
        {
          renderer: {
            container: document.getElementById('sigma-solution-container'),
            type: 'canvas',
          },
          settings: {
            edgeLabelSize: 'proportional',
            minArrowSize: 10,
          },
        },
      );

      this.sigmaSolution.graph.read(this.graphSolution);
      this.sigmaSolution.refresh();
    },
    onBFS() {
      const city1 = this.airline.findCity(this.city1);
      const city2 = this.airline.findCity(this.city2);

      this.path = this.airline.bfs(city1, city2);

      this.initializeSigmaSolution();
    },
  },
  mounted() {
    this.populateAirline();
    this.initializeSigma();
  },
};
</script>

<style lang="stylus">
.index
  .graph-title, .find-path-card, .text-h6
    color $accent
  .solution
    width 100%
    height 50%
  #sigma-container, #sigma-solution-container
    background #fafafa
    width 100%
    height 100%
</style>
