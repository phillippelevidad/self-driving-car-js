const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// 2D rendering context for the car and network canvases
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Road with the center position and width of the car canvas
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Traffic cars
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

// Number of cars to generate
// This creates more opportunities for the AI to succeed
const numberOfCars = 1000;

// AI-controlled cars
const cars = generateCars(numberOfCars);

// Set the best car initially as the first car in the array
let bestCar = cars[0];

// Check if the best brain data is stored in local storage
if (localStorage.getItem("bestBrain")) {
  // Load the best brain data into each car's brain
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    // Mutate the brain of all cars except the first one
    // Mutation rate is 20%, creating a opportunity for the AI to improve
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

// Start the animation loop
animate();

// Button handler to save the best car's brain data to local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Button handler to discard the best brain data from local storage
function discard() {
  localStorage.removeItem("bestBrain");
}

// Generate an array of AI-controlled cars
function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // Update the position of each traffic car
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  // Update the position of each AI-controlled car
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // Find the car with the lowest y-coordinate (closest to the top of the screen)
  // This will be used to make the camera follow the best car
  bestCar = cars.find((car) => car.y === Math.min(...cars.map((car) => car.y)));

  // Translate the car canvas to focus on the best car
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // Draw the road on the car canvas
  road.draw(carCtx);

  // Set the global alpha (transparency) for the cars
  // This makes all AI cars but the best car appear transparent
  carCtx.globalAlpha = 0.2;

  // Draw all the cars on the car canvas in blue color, without sensors
  // PS. the sensors exist, they are just not drawn
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue", false);
  }

  // Redraw the best car on the car canvas in solid blue color, with sensors
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  // Draw all the traffic cars on the car canvas in purple color
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "purple");
  }

  carCtx.restore();

  // Set the line dash offset for the network canvas animation
  networkCtx.lineDashOffset = -time / 50;

  // Draw the neural network visualization on the network canvas using the best car's brain
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // Request the next animation frame
  // In other words, keep the animation loop going
  requestAnimationFrame(animate);
}
