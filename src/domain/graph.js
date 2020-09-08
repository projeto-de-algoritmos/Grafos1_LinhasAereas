/** Class represent a graph structure */
class Graph {
  /** Initializes properties */
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.numberOfEdges = 0;
  }

  /**
   * Removes element from array property
   * @param  {array} array - Array from which an element should be removed
   * @param  {string} element - Element to be removed
   */
  static removeElementFromArray(array, element) {
    const index = array.indexOf(element);

    if (~index) { // Use bitwise NOT operator to validate if index is valid
      array.splice(index, 1); // Deletes elements at index
    }
  }

  /**
   * Add vertex to graph
   * @param  {string} vertex - String representing graph node
   */
  addVertex(vertex) {
    this.vertices.push(vertex);

    this.edges[vertex] = [];
  }

  /**
   * Remove vertex from graph
   * @param  {string} vertex - String representing graph node
   */
  removeVertex(vertex) {
    this.removeElementFromArray(this.vertices, vertex);

    // Remove all edges for vertex
    while (this.edges[vertex].length) {
      const adjacentVertex = this.edges[vertex].pop();

      this.removeEdge(adjacentVertex, vertex);
    }
  }

  

  /**
   * Add an edge between two vertices, creating a connection between them
   * @param  {string} firstVertex - First vertex to be connected
   * @param  {string} secondVertex - Second vertex to be connected
   */
  addEdge(firstVertex, secondVertex) {
    this.edges[firstVertex].push(secondVertex);
    this.edges[secondVertex].push(firstVertex);

    this.numberOfEdges += 1;
  }

  /**
   * Remove an edge between nodes, removing the connection between them
   * @param  {string} firstVertex - First vertex to be disconnected
   * @param  {string} secondVertex - Second vertex to be disconnected
   */
  removeEdge(firstVertex, secondVertex) {
    this.removeElementFromArray(this.edges[firstVertex], secondVertex);
    this.removeElementFromArray(this.edges[secondVertex], firstVertex);

    this.numberOfEdges -= 1;
  }

  /**
   * Returns number of vertices
   */
  size() {
    return this.vertices.length;
  }

  /**
   * Returns number of edges
   */
  numberOfRelations() {
    return this.numberOfEdges;
  }

  /**
   * Prints all graph's vertices and each vertex neighbor
   */
  print() {
    // Go through each vertex and get all of it's edges and concatenate everything into a string
    const verticesWithRelations = this.vertices.map((vertex) => {
      const edges = this.edges[vertex].join((', ')).trim(); // Get all vertex edges

      return `${vertex} => ${edges}`;
    }, this); // Use class scope for map so this.edges exists

    // Concatenate all vertices into a string
    const graphString = verticesWithRelations.join(' | ');

    console.log(graphString); // eslint-disable-line no-console
  }
}

export default Graph;
