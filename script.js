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
            this.collisionRadius = 50
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

        }
    }

    class Game {
        constructor () {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // event listener
            canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.y = true;
                console.log(this.mouse);
            });
            canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.y = false;
                console.log(this.mouse);
            });
            canvas.addEventListener('mousemove', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.y = false;
                console.log(this.mouse);
            });
        }
        render(context) {
            this.player.draw(context);
        }
    }

    const game = new Game(canvas);
    game.render(ctx);
    console.log(game);

    function animate () {

    }
});