window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    // changing the canvas state
    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    class Player {
        constructor (game) {
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0; // distance b/w mouse and player horizontally
            this.dy = 0; // distance b/w mouse and player vertically
            this.speedModifier = 5; // to modify the speed
        }

        // draw method is used to draw and animate player
        // context specify which canvas we use to draw
        draw(context) {
            // we are drawing a circle in our canvas
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            // save and restore are used so that global alpha only affects tha
            // code inside save-restore 
            // otherwise opacity of each image would reduce to 0.5
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke(); 
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY); // defines the starting coordinates
            context.lineTo(this.game.mouse.x, this.game.mouse.y); // defines the ending coordinates
            context.stroke(); // to actually draw the line
        }

        update() {
            // to move the player in the direction of the mouse
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const distance = Math.hypot(this.dy, this.dx);
            if(distance > this.speedModifier) {
                this.speedX = this.dx/distance || 0;
                this.speedY = this.dy/distance || 0;
            }else {
                this.speedX = 0;
                this.speedY = 0;
            }
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;
        }
    }

    class Obstacle {
        constructor (game) {
            this.game = game; // convert the argument as class object
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 40;
            this.image = document.getElementById('obstacles')
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - (this.width * 0.5);
            this.spriteY = this.collisionY - (this.height * 0.5) - 70;
        }
        draw(context) {
            context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }

    class Game {
        constructor () {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.noOfObstacles = 1;
            this.obstacles = []
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // event listener
            canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', (e) => {
                if(this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                    this.mouse.pressed = false;
                }
            });
        }

        render(context) {
            this.player.draw(context);
            this.player.update();
            this.obstacles.forEach(obstacle => obstacle.draw(context)); // draw each obstacle
        }

        init() {
            // for( let i=0 ; i<this.noOfObstacles ; i++ ){
            //     this.obstacles.push(new Obstacle(this));
            // }
            let attempts = 0;
            while(this.obstacles.length < this.noOfObstacles && attempts < 500) {
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy,dx); 
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
                    if(distance < sumOfRadii) {
                        overlap = true;
                    }
                })
                if(!overlap) {
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);
    game.init();


    function animate () {
        ctx.clearRect(0,0, canvas.width, canvas.height); // clear the previous area
        game.render(ctx);
        requestAnimationFrame(animate); // endless animation loop
    }
    animate();
});