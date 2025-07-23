import Phaser from 'phaser';

export function startGame(element) {
    let snake = [
        { x: 40, y: 0 },
        { x: 30, y: 0 },
        { x: 20, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 0 }
    ];
    let snakeSprites = [];
    let cursors;
    let direction = 'RIGHT';
    let moveTimer = 0;
    let moveDelay = 100;
    let gameOver = false;
    let food;
    let foodCollected = false;
    let scene;

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: element,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
    }

    function create() {
        scene = this;
        this.add.image(400, 300, 'sky');
        cursors = this.input.keyboard.createCursorKeys();

        // create and store sprite references
        snake.forEach(part => {
            const sprite = this.add.sprite(part.x, part.y, 'star').setScale(0.5);
            snakeSprites.push(sprite);
        });

        // this.physics.add.overlap(snakeSprites[0], food, collectFood, null, this)
    }

    function collectFood(){
        foodCollected = true;
    }

    function calculateNextPosition(dir, snake_x, snake_y){
        switch (dir) {
            case 'LEFT':
                snake_x -= 10;
                return [snake_x, snake_y];
            case 'RIGHT':
                snake_x += 10;
                return [snake_x, snake_y];
            case 'UP':
                snake_y -= 10;
                return [snake_x, snake_y];
            case 'DOWN':
                snake_y += 10;
                return [snake_x, snake_y];
        }
    }

    function update(time) {
        if (gameOver) return;

        // move the snake at a fixed interval
        if (time - moveTimer > moveDelay) {
            moveTimer = time;

            // handle direction change (prevents reversing)
            if (cursors.left.isDown && direction !== 'RIGHT') {
                direction = 'LEFT';
            } else if (cursors.right.isDown && direction !== 'LEFT') {
                direction = 'RIGHT';
            } else if (cursors.up.isDown && direction !== 'DOWN') {
                direction = 'UP';
            } else if (cursors.down.isDown && direction !== 'UP') {
                direction = 'DOWN';
            }

            
            if (cursors.space.isDown){
                let newPart = {x : snake[0].x, y : snake[0].y}
                snake.splice(1, 0, newPart)
                let newSprite = scene.add.sprite(snake[0].x, snake[0].y, 'star').setScale(0.5);
                snakeSprites.splice(1, 0, newSprite);
                [snake[0].x, snake[0].y] = calculateNextPosition(direction, snake[0].x, snake[0].y)
                console.log("running")
                for (let i = 0; i < snake.length; i++) {
                    snakeSprites[i].x = snake[i].x;
                    snakeSprites[i].y = snake[i].y;
                }
            }
            else{
                for (let i = snake.length - 1; i > 0; i--) {
                    snake[i].x = snake[i - 1].x;
                    snake[i].y = snake[i - 1].y;
                }
                [snake[0].x, snake[0].y] = calculateNextPosition(direction, snake[0].x, snake[0].y)
                for (let i = 0; i < snake.length; i++) {
                    snakeSprites[i].x = snake[i].x;
                    snakeSprites[i].y = snake[i].y;
                }
            }
            // move the body

            // game over if out of bounds
            if (
                snake[0].x < 0 || snake[0].x >= config.width ||
                snake[0].y < 0 || snake[0].y >= config.height
            ) {
                gameOver = true;
                console.log('Game Over');
            }
        }
    }

    new Phaser.Game(config);
}
