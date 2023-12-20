class Controls {
  /**
   * Constructs a Controls object.
   * @param {string} type - The type of controls to initialize.
   * Possible values: "KEYS", "DUMMY".
   */
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  /**
   * Adds keyboard event listeners to control the car.
   */
  #addKeyboardListeners() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
        case "w":
          this.forward = true;
          break;

        case "ArrowLeft":
        case "A":
        case "a":
          this.left = true;
          break;
        case "ArrowRight":
        case "D":
        case "d":
          this.right = true;
          break;
        case "ArrowDown":
        case "S":
        case "s":
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
        case "w":
          this.forward = false;
          break;

        case "ArrowLeft":
        case "A":
        case "a":
          this.left = false;
          break;
        case "ArrowRight":
        case "D":
        case "d":
          this.right = false;
          break;
        case "ArrowDown":
        case "S":
        case "s":
          this.reverse = false;
          break;
      }
    };
  }
}
