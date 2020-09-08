import City from './city';

/** Class representing the airline graph */
class Airline {
  /** Initializes properties */
  constructor() {
    this.cities = [];
    this.numberOfConnections = 0;
  }

  /**
   * Add city to airline
   * @param  {string} name - city's name
   * @param  {string} code - city's IATA code. More info https://en.wikipedia.org/wiki/IATA_airport_code
   */
  addCity(name, code) {
    const city = new City(name, code);
    this.cities.push(city);
  }

  /**
   * Remove a city from airline
   * @param  {string} cityCode - City's code to be removed
   */
  removeCity(cityCode) {
    const index = this.cities.findIndex((city) => city.code === cityCode);

    if (~index) { // Use bitwise NOT operator to validate if index is valid
      this.cities.splice(index, 1); // Deletes elements at index
    }
  }

  /**
   * Add a connection from one cities to another
   * @param  {string} cityCode1 - City's code in which connection will be added
   * @param  {string} cityCode2 - City's code that is connect to the first city
   */
  addConnection(cityCode1, cityCode2) {
    const city1 = this.cities.find((city) => city.code === cityCode1);
    city1.addConnection(cityCode2);

    this.numberOfConnections += 1;
  }

  /**
   * Remove a connection from one cities to another
   * @param  {string} cityCode1 - City's code in which connection will be removed
   * @param  {string} cityCode2 - City's code that connect to the first city is being removed
   */
  removeConnection(cityCode1, cityCode2) {
    const city1 = this.cities.find((city) => city.code === cityCode1);
    city1.removeConnection(cityCode2);

    this.numberOfConnections -= 1;
  }

  findCity(cityCode) {
    return this.cities.find((city) => city.code === cityCode);
  }

  bfs(startCity, finishCity) {
    const queue = [];
    const visitedCitiesInOrder = [];
    // [{name: 'Brasilia', code: 'BSB'}, {name: 'São PAulo', code: 'CGH'}, ...]

    const visited = {};
    visited[startCity.code] = true;
    visitedCitiesInOrder.push(startCity);
    // { 'BSB': true }
    // if(visited[city.code])
    queue.push(startCity);

    while (!!queue.length) {
      let city = queue.shift();

      if (finishCity.code === city.code) {
        return visitedCitiesInOrder;
      }

      const neighbors = city.connections;
      // ['BSB', 'CGH']

      neighbors.forEach((neighborCode) => {
        visited[neighborCode] = true;
        const neighborCity = this.findCity(neighborCode);
        visitedCitiesInOrder.push(neighborCity);
        queue.push(neighborCity);
      });
    }

    return visitedCitiesInOrder;
  }
}

export default Airline;
