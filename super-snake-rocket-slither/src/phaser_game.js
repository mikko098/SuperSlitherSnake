import Phaser from 'phaser';

export function startGame(element) {
    let snake;
    let cursors;
    let direction = 'RIGHT';
    let moveTimer = 0;
    let moveDelay = 100;
    let gameOver = false;
    let food;
    let foodCollected = false;
    let scene;
    let obstacles;

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: element,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('square', 'assets/square.png');
        this.load.image('obstacle', 'assets/platform.png'); // Assuming square is used for obstacles
    }

    function create() {
        scene = this;
        this.add.image(400, 300, 'sky');
        cursors = this.input.keyboard.createCursorKeys();

        snake = this.physics.add.group({
            key: 'square',
            repeat: 4,
            setXY: { x: 100, y: 100, stepX: -10 }
        });
        snake.children.iterate(function (part) {
            part.setScale(0.5);
            part.setOrigin(0.5, 0.5);
        });
        

        // create food
        food = this.physics.add.sprite(Phaser.Math.Between(0, 79) * 10, Phaser.Math.Between(0, 59) * 10, 'star').setScale(0.5);
        food.setInteractive();        

        // add food overlap
        this.physics.add.overlap(snake, food, collectFood, null, this)

        // add snake collision with self
        this.physics.add.collider(snake, snake, function() {
            gameOver = true;
        });

        // add obstacles
        obstacles = this.physics.add.staticGroup();
        obstacles.create(200, 200, 'obstacle');

        // add snake collision with obstacles
        this.physics.add.collider(snake, obstacles, function() {
            gameOver = true;
        });
    }

    function collectFood(){
        console.log("Food collected");
        food.x = Phaser.Math.Between(0, 79) * 10;
        food.y = Phaser.Math.Between(0, 59) * 10;
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
        if (gameOver) {
            // Display game over message
            scene.add.text(300, 250, 'Game Over', { fontSize: '32px', fill: '#fff' });
            scene.scene.pause();
            return;
        }

        if (time - moveTimer > moveDelay) {
            moveTimer = time;

            const children = snake.getChildren();

            if (cursors.left.isDown && direction !== 'RIGHT') {
                direction = 'LEFT';
            } else if (cursors.right.isDown && direction !== 'LEFT') {
                direction = 'RIGHT';
            } else if (cursors.up.isDown && direction !== 'DOWN') {
                direction = 'UP';
            } else if (cursors.down.isDown && direction !== 'UP') {
                direction = 'DOWN';
            }

            // handle movement and growth
            let head = children[0];

            let [nextX, nextY] = calculateNextPosition(direction, head.x, head.y);

            if (foodCollected) {
                // Add new part at current tail position
                const tail = children[children.length - 1];
                const newPart = scene.add.sprite(tail.x, tail.y, 'square').setScale(0.5);
                scene.physics.add.existing(newPart);
                snake.add(newPart);
                foodCollected = false;
            }

            // Shift positions
            for (let i = children.length - 1; i > 0; i--) {
                children[i].x = children[i - 1].x;
                children[i].y = children[i - 1].y;
            }

            head.x = nextX;
            head.y = nextY;

            // check for out of bounds
            // if (
            //     head.x < 0 || head.x >= config.width ||
            //     head.y < 0 || head.y >= config.height
            // ) {
            //     gameOver = true;
            //     console.log('Game Over');
            // }

            if (head.x < 0){
                head.x = config.width - 10;
            }
            if (head.x >= config.width){
                head.x = 0;
            }
            if (head.y < 0){
                head.y = config.height - 10;
            }
            if (head.y >= config.height){
                head.y = 0;
            }
        }
    }


    new Phaser.Game(config);
}
