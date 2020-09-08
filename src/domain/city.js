/** Class representing a city */
class City {
  /**
   * Initialize city properties
   * @param  {string} index - city's index
   * @param  {string} name - city's name
   * @param  {string} code - city's IATA code. More info https://en.wikipedia.org/wiki/IATA_airport_code
   */
  constructor(index, name, code) {
    this.index = index;
    this.name = name;
    this.code = code;
    this.connections = [];
  }

  /**
   * Add an connection to a city
   * @param  {string} cityCode - City's code to be connected
   */
  addConnection(cityCode) {
    this.connections.push(cityCode);
  }

  /**
   * Remove a connection to a city
   * @param  {string} cityCode - City's code which connection should be removed
   */
  removeConnection(cityCode) {
    const index = this.connections.indexOf(cityCode);

    if (~index) { // Use bitwise NOT operator to validate if index is valid
      this.connections.splice(index, 1); // Deletes elements at index
    }
  }
}

export default City;
