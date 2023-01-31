let snake = {
  pos: [{ x: 10, y: 10}], // Array que contendrá un elemento por cada parte de cuerpo de la serpiente, a medida que crece.
  direction: 'up', 
  speed: 300,
  growing: false,
  moveSnake: function () {
    switch(this.direction) {
      case 'up':
        this.pos.unshift({ // Añadimos al principio del array las coordenadas que tendrá la cabeza al moverse.
          x: this.pos[0].x,
          y: this.pos[0].y === 1 ? 20 : this.pos[0].y - 1 // Si la serpiente sale por encima del tablero, aparecerá por debajo. Para cualquier otro caso, sube una fila como si nada.
        })
        break
      case 'down':
        this.pos.unshift({
          x: this.pos[0].x,
          y: this.pos[0].y === 20 ? 1 : this.pos[0].y + 1
        })
        break
      case 'left':
        this.pos.unshift({
          x: this.pos[0].x === 1 ? 20 : this.pos[0].x - 1,
          y: this.pos[0].y
        })
        break
      case 'right':
        this.pos.unshift({
          x: (this.pos[0].x === 20) ? 1 : this.pos[0].x + 1,
          y: this.pos[0].y
        })
        break
    }
    if (this.growing) { // Si la serpiente ha comido en este turno, growing será 'true' y no se ejecutará la línea 36 y habremos añadido una nueva parte al array que hay en 'snake.pos'. Reseteamos ahora el valor de growing para que a la próxima avance con normalidad.
      this.growing = false
    } else {
      this.pos.pop() // Si la serpiente no tiene que crecer, eliminamos la última parte del cuerpo del array.
    }
  },
  checkCollision: function () {
    const head = this.pos[0]  // guardamos las coordenadas de la cabeza y las comparamos con las del resto del cuerpo. Si las coordenadas de una de las partes del cuerpo coincide con las de la cabeza, es que ha habido colisión.
    for (let i = 1; i < this.pos.length; i++) {
      if (head.x === this.pos[i].x && head.y === this.pos[i].y) {
        return true
      } 
    }
    return false
  }
}
  
window.addEventListener('keydown', function(e) { // Cambiamos la propiedad 'direction' de la serpiente según la tecla pulsada.
  switch(e.key) {
    case 'ArrowUp':
      snake.direction = 'up'
      break
    case 'ArrowDown':
      snake.direction = 'down'
      break
    case 'ArrowLeft':
      snake.direction = 'left'
      break
    case 'ArrowRight':
      snake.direction = 'right'
      break
  }
})

let food = {
  x: 5,
  y: 5,
  updateFood: function() { // Generamos unas nuevas coordenadas aleatorias para la comida después de que la serpiente se haya comido la anterior
    this.x = Math.ceil(Math.random() * board.width)
    this.y = Math.ceil(Math.random() * board.height)
  }
}

let board = {
  width: 20,
  height: 20,
  drawBoard: function () {
    snake.pos.forEach(function(part) {
      let snakeCell = document.querySelector(`.row${part.y} .col${part.x}`) // Buscamos las celdas de la tabla que coinciden con las coordenadas del cuerpo de la serpiente y les añadimos la clase 'snake' para darles otro color.
      snakeCell.classList.add('snake')
    })
  
    let foodCell = document.querySelector(`.row${food.y} .col${food.x}`) // Lo mismo que antes pero para la comida
    foodCell.classList.add('food')
  },
  removeSnake: function () {
    let snakeCells = document.querySelectorAll(`.snake`)
    snakeCells.forEach(function(elem) {
      elem.classList.remove('snake')
    })
  },
  removeFood: function() {
    let foodCell = document.querySelector('.food')
    foodCell.classList.remove('food')
  }
}

let game = {
  play: function () {    // FUNCIÓN CON EL BUCLE PRINCIPAL DEL JUEGO
    board.removeSnake()  // Primero quitamos la clase 'snake' a todas las casillas que la tengan
    snake.moveSnake()    // Actualizamos las coordenadas del cuerpo de 'snake'
    game.gameOver()      // Comprobamos si la serpiente ha colisionado con estas nuevas coordenadas
    game.checkFood()     // Comprobamos si la serpiente ha alcanzado la comida
    board.drawBoard()    // Dibujamos la serpiente y la comida con las coordenadas actualizadas
  },
  checkFood: function() { // Comprobamos si las coordenadas de la cabeza de la serpiente coinciden con las de la comida
    if (snake.pos[0].x === food.x && snake.pos[0].y === food.y) {
      board.removeFood() // Si se cumple la condición, borramos la comida devorada y generamos otra nueva
      food.updateFood()
      game.speedUp() // aumentamos la velocidad de juego
      snake.growing = true // Indicamos que la serpiente debe crecer, para tenerlo en cuenta cuando se ejecute 'snake.moveSnake'
    }
  },
  speedUp: function () {
    snake.speed /= 1.1
    clearInterval(timerId)  // Para aumentar la velocidad de juego, primero debemos parar el timerId actual y crear un intervalo nuevo con la nueva velocidad
    timerId = setInterval(game.play, snake.speed)
  },
  gameOver: function () {
    if (snake.checkCollision() && snake.pos.length > 1) {
      clearInterval(timerId)     // Paramos el juego para que no siga llamando a la función 'play'
      window.alert('Game Over')  // Mostramos un mensaje a través de una ventana emergente
    }
  }
}

let timerId = setInterval(game.play, snake.speed) //Iniciamos el juego. Ejecutaremos la función 'play' que está definida dentro de el objeto 'game' cada 'x' milisegundos, según el valor de snake.speed