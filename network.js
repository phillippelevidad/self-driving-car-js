class NeuralNetwork {
  /**
   * Constructs a new NeuralNetwork with the specified neuron counts for each level.
   * @param {Array} neuronCounts - The number of neurons for each level of the NeuralNetwork.
   */
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  /**
   * Performs a feed-forward operation on the given neural network with the provided inputs.
   * @param {Array} givenInputs - The input values for the neural network.
   * @param {NeuralNetwork} network - The neural network to perform the feed-forward operation on.
   * @returns {Array} - The output values of the neural network.
   */
  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  /**
   * Mutates the neural network by randomly adjusting the biases and weights of each level.
   * @param {NeuralNetwork} network - The neural network to mutate.
   * @param {number} amount - The amount of mutation to apply. Default is 1.
   */
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      // Mutate biases
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      // Mutate weights
      for (let i = 0; i < level.weights.length; i++) {
        for (let o = 0; o < level.weights[i].length; o++) {
          level.weights[i][o] = lerp(
            level.weights[i][o],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  /**
   * Constructs a new Level with the specified input count and output count.
   * @param {number} inputCount - The number of inputs for the Level.
   * @param {number} outputCount - The number of outputs for the Level.
   */
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    // Initialize weights as a 2D array
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights.push(new Array(outputCount));
    }

    Level.#randomize(this);
  }

  /**
   * Performs a feed-forward operation on the given level with the provided inputs.
   * @param {Array} givenInputs - The input values for the level.
   * @param {Level} level - The level to perform the feed-forward operation on.
   * @returns {Array} - The output values of the level.
   */
  static feedForward(givenInputs, level) {
    // Assign given inputs to level inputs
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // Calculate outputs based on inputs, weights, and biases
    for (let o = 0; o < level.outputs.length; o++) {
      let sum = 0;
      for (let i = 0; i < level.inputs.length; i++) {
        sum += level.inputs[i] * level.weights[i][o];
      }
      level.outputs[o] = sum > level.biases[o] ? 1 : 0;
    }

    return level.outputs;
  }

  /**
   * Randomizes the weights and biases of a level.
   * @param {Level} level - The level to randomize.
   */
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let o = 0; o < level.outputs.length; o++) {
        level.weights[i][o] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
}
