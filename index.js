(function game() {
  class Square {
    constructor(x, y, width, height, ctx) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.ctx = ctx;
      this.actor = null;
    }

    draw() {
      this.ctx.strokeStyle = "black";
      this.ctx.strokeRect(this.x, this.y, this.width, this.height);

      if (this.actor) {
        this.ctx.fillStyle = "black";
        this.ctx.font = "30px arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          this.actor,
          this.x + this.width / 2,
          this.y + this.height / 2 + 10
        );
      }
    }
  }

  class TicTacToe {
    constructor(id) {
      this.canvas = document.getElementById(id);
      this.ctx = this.canvas.getContext("2d");
      this.squares = [];
      this.actors = ["x", "o"];
      this.turn = 0;
      this.gameOver = false;

      const w = this.canvas.width / 3;
      const h = this.canvas.height / 3;

      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          this.squares.push(new Square(x * w, y * h, w, h, this.ctx));
        }
      }

      this.squares.forEach((square) => square.draw());
      this.canvas.addEventListener(
        "click",
        function (event) {
          this.click(event);
        }.bind(this)
      );
    }

    click(event) {
      if (this.gameOver) {
        this.reset();
        return;
      }

      const x = event.offsetX;
      const y = event.offsetY;

      for (let square of this.squares) {
        if (square.actor !== null) {
          continue;
        }

        if (
          x >= square.x &&
          x <= square.x + square.width &&
          y >= square.y &&
          y <= square.y + square.height
        ) {
          square.actor = this.actors[this.turn];
          square.draw();
          this.turn = (this.turn + 1) % this.actors.length;
        }
      }

      this.checkForWinner();
    }

    checkForWinner() {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

      for (let i = 0; i < winningCombinations.length; i++) {
        let combination = winningCombinations[i];

        // Get squares
        let s1 = this.squares[combination[0]];
        let s2 = this.squares[combination[1]];
        let s3 = this.squares[combination[2]];

        // Ensure the combination is not three empty squares
        if (s1.actor != null) {
          if (s1.actor === s2.actor && s1.actor === s3.actor) {
            this.gameOver = true;

            // Draw the winning combination line
            this.ctx.beginPath();
            this.ctx.moveTo(s1.x + s1.width / 2, s1.y + s1.height / 2);
            this.ctx.lineTo(s3.x + s3.width / 2, s3.y + s3.height / 2);
            this.ctx.stroke();

            // Draw winner text
            this.ctx.fillStyle = "red";
            this.ctx.font = "30px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
              `${s1.actor} wins!`,
              this.canvas.width / 2,
              this.canvas.height / 2
            );
          }
        }
      }

      if (
        !this.gameOver &&
        this.squares.filter((s) => s.actor == null).length == 0
      ) {
        this.gameOver = true;
        this.ctx.fillStyle = "red";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          "It's a Draw!",
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
    }

    reset() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.squares.forEach((square) => (square.actor = null));
      this.squares.forEach((square) => square.draw());
      this.turn = 0;
      this.gameOver = false;
    }
  }

  new TicTacToe("canvas");
})();
