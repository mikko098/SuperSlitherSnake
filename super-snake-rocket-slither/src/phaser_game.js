import Phaser from 'phaser';

export function startGame(element) {
    var snake;
    var food;
    var score = 0;
    var gameOver = false;
    
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
        // load sprites and images here
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('balls', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create(){
        this.add.image(400,300,'sky')
        this.cursors = this.input.keyboard.createCursorKeys();
        snake = this.physics.add.sprite(20, 20, 'balls');
        snake.setCollideWorldBounds(true);
    }

    function update(){
        if (gameOver)
            return
        else if (this.cursors.left.isDown) {
            snake.x -= 5;
        }
        else if (this.cursors.right.isDown) {
            snake.x += 5;
        }
        else if (this.cursors.up.isDown) {
            snake.y -= 5;
        }
        else if (this.cursors.down.isDown) {
            snake.y += 5;
        }
    }
    
    var game = new Phaser.Game(config)
}
