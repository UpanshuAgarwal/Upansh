window.addEventListener('load',function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;   
    
    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'transparent';
    ctx.font = '40px Bangers';
    ctx.textAlign = 'center'

class Player {
     constructor(game){
        this.game = game;
        this.collisonX = this.game.width * 0.5;
        this.collisonY = this.game.height * 0.5;
        this.collisonRadius = 40;
        this.speedX = 0;// speed of object horizontaly
        this.speedY = 0;// speed of object vertically
        this.dx = 0; // Distance between mouse and player postion horzontally
        this.dy = 0; // Distance between mouse and player postion vertically
        this.Speedmodifer = 3;
        this.spriteWidth = 255;
        this.spriteHeight = 256;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight
        this.spriteX = this.collisonX - this.width * 0.5;
        this.spriteY = this.collisonY - this.height * 0.5;
        this.frameX = 0;
        this.frameY = 0;

        this.image = document.getElementById('bull');
    }
     draw(context){
        context.drawImage(this.image, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
        if(this.game.debug){
            context.beginPath();
            context.arc(this.collisonX,this.collisonY,
            this.collisonRadius,0,Math.PI*2); 
            //(x: number, y: number, radius: number, startAngle: number, endAngle: number)
            context.save();
            context.globalAlpha = 0.5; // it define the obesity of the player
            context.fill();
            context.restore(); //this save() and restore() use to perform the specific task  under it without affecct rest of canvas drawing.
            context.stroke();
            context.beginPath();
            // line start by it
            context.moveTo(this.collisonX,this.collisonY); //method  will define starting x and y coordinate of the line
            context.lineTo(this.game.mouse.x,this.game.mouse.y);
            context.stroke();
        }

    }
    update(){
        this.dx = (this.game.mouse.x-this.collisonX); // who distance minus hoke x position main add hogyi
        this.dy = (this.game.mouse.y-this.collisonY);
        //for find angle b/w positive x axis and line to the specific point from 0,0 to mouse poistion
        const angle = Math.atan2(this.dy,this.dx);
        if(angle < -2.74 || angle > 2.74) this.frameY=6;
        else if(angle < -1.96) this.frameY=7;
        else if(angle < -1.17) this.frameY=0;
        else if(angle < -0.39) this.frameY=1;
        else if(angle < 0.39)  this.frameY=2;
        else if(angle < 1.17)  this.frameY=3;
        else if(angle < 1.96)  this.frameY=4;
        else if(angle < 2.74)  this.frameY=5;
        else if(angle < -2.74 || angle > 2.74) this.frameY=6;
        else if(angle < -1.96) this.frameY=7;

    

        const distance = Math.hypot(this.dx,this.dy);
        if(distance>this.Speedmodifer){
        this.speedX = this.dx/distance || 0; // if coordinate is not define then we create "|| 0"
        this.speedY = this.dy/distance || 0;
        }
        else{
            this.speedX = 0;
            this.speedY = 0;
        }
        this.collisonX += this.speedX * this.Speedmodifer;
        this.collisonY += this.speedY * this.Speedmodifer;

        // Update sprite position to follow the collision circle
        this.spriteX = this.collisonX - this.width * 0.5;
        this.spriteY = this.collisonY - this.height * 0.5 - 70;

        // horizontal boundaries
        if(this.collisonX < this.collisonRadius) this.collisonX = this.collisonRadius;
        else if(this.collisonX > canvas.width - this.collisonRadius) this.collisonX = canvas.width - this.collisonRadius;
 
        // Vertical boundaries
        if(this.collisonY < this.collisonRadius) this.collisonY = this.collisonRadius;
        else if(this.collisonY > canvas.height - this.collisonRadius) this.collisonY = canvas.height - this.collisonRadius;
        
        //colison with obsticle
        this.game.obsticles.forEach(obsticle => 
        {
           //[(distance<SumRadi), distance, SumRadi, dx, dy]
          //Atr here we define the (sumRadii < distance) is equal to collision
         let [collision, distance, SumRadi, dx, dy]  = this.game.checkCollison(this,obsticle); //Destructive assinment
         //let collison = game.checkCollison(this,obsticle)[0];
         //let distance = game.checkCollison(this,obsticle)[1];
        
          if(collision){
            const unit_x = dx / distance; 
            // We normalize the dx and dy to find the direction
            const unit_y = dy / distance;
            /*(SumRadi+1) * unit_x&y = unit vector scaled 
            the combination of these two value(unit_x&y) is added to the player 
            horizontal and vertical position for each animatiojn framer will make it move
            in a certain direction and a certain speed away from the center odf obsticle */
            this.collisonX = obsticle.collisonX + (SumRadi+5) * unit_x;
            this.collisonY = obsticle.collisonY + (SumRadi+5) * unit_y;

          }
        });
    }
    restart(){
        this.collisonX = this.game.width * 0.5;
        this.collisonY = this.game.height * 0.5;
        this.spriteX = this.collisonX - this.width * 0.5;
        this.spriteY = this.collisonY - this.height * 0.5 - 70;
    }
}

class Obsticle{
    constructor(game){
    this.game = game;
    this.collisonX = Math.random() * this.game.width; //*this.game.width is for into the cnvas width
    this.collisonY = Math.random() * this.game.height; //*this.game.height is for into the cnvas height
    this.collisonRadius = 50;
    this.image = document.getElementById('obstacle')
    this.spritewidth = 250;
    this.spriteheight = 250;
    this.collisonwidth = this.spritewidth;
    this.collisonheight = this.spriteheight;
    this.spriteX = this.collisonX - this.collisonwidth * 0.5;//spriteX mean distance of sprite fromleft side of destination.
    this.spriteY = this.collisonY - this.collisonheight * 0.5 - 100;//spriteY mean distance of sprite fromtop side of destination.
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);
}
    draw(context){
        context.drawImage(this.image, 
            this.frameX * this.spritewidth, this.frameY * this.spriteheight, this.spritewidth, this.spriteheight, 
            this.spriteX, this.spriteY, this.collisonwidth, this.collisonheight); //The 'drawImage' method in JavaScript is used to draw images, videos, or other canvas elements onto a canvas.
        //context.draeImage(imgSrc, sx, sy, sw, sh, dx, dy, dw, dh); d(destination) = in canvas and s = for sourse
        if(this.game.debug){
        context.beginPath();
        context.arc(this.collisonX,this.collisonY,
        this.collisonRadius,0,Math.PI*2); 
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        }
    }
    update(){

    }
}

class Egg {
    constructor(game){
        this.game = game;
        this.collisonRadius = 40;
        this.margin = this.collisonRadius * 2;
        this.collisonX = this.margin + (Math.random() * (this.game.width - this.margin*2));
        this.collisonY = this.game.Topmargin + (Math.random() * (this.game.height - this.game.Topmargin - this.margin)); // (this.game.height - this.game.Topmargin - this.margin) = this part start from top margin away from the upper side.
        this.image = document.getElementById('egg');
        this.spriteWidth = 110;
        this.spriteHeight = 135;
        this.collisonwidth = this.spriteWidth;
        this.collisonheight = this.spriteHeight;
        this.spriteX = this.collisonX - this.collisonwidth * 0.5;
        this.spriteY = this.collisonY - this.collisonheight * 0.5;
        this.hatchtimer = 0;
        this.hatchinterval = 10000;
        this.markeforDeletion = false;
   }
    draw(context){
    context.drawImage(this.image, this.spriteX, this.spriteY);
    if(this.game.debug){
        context.beginPath();
        context.arc(this.collisonX,this.collisonY,
        this.collisonRadius,0,Math.PI*2); 
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        this.displayTimer = (this.hatchtimer * 0.001).toFixed(0); //In JavaScript, 'the toFixed()' method is used to format a number to a fixed number of decimal places.
        context.fillText(this.displayTimer, this.collisonX, this.collisonY - this.collisonRadius * 2);
        }
   }
   update(deltatime){
    let collisionObject = [this.game.player, ...this.game.obsticles, ...this.game.enemies]; //(...) this is sperade operator bascilly use to copying array in to onoter array
    collisionObject.forEach(object => {
        let [collision, distance, SumRadi, dx, dy] = this.game.checkCollison(this,object); // b/w egg and the all which is in array.
    
    if(collision){
        const unit_x = dx / distance; 
        const unit_y = dy / distance;
        this.collisonX = object.collisonX + (SumRadi+1) * unit_x;
        this.collisonY = object.collisonY + (SumRadi+1) * unit_y;
    }
    });
    this.spriteX = this.collisonX - this.collisonwidth * 0.5;
    this.spriteY = this.collisonY - this.collisonheight * 0.5 ;

     //hatching
     if(this.hatchtimer > this.hatchinterval || this.collisonY < this.game.Topmargin){
        this.game.hachling.push(new Larva(this.game, this.collisonX, this.collisonY));
        this.markeforDeletion = true;
        this.game.removeGamObject();
        // this.game.particles.push(new Firefly(this.game, this.collisonX, this.collisonY, 'blue')); 
       }else{
         this.hatchtimer += deltatime;
       }
    
   }
}

class Enemy{
    constructor(game){
        this.game = game;
        this.collisonRadius = 30;
        this.speedX = Math.random() * 3 + 1.5;
        this.image = document.getElementById('toads');
        this.spritewidth = 140;
        this.spriteheight = 260;
        this.width = this.spritewidth;
        this.height = this.spriteheight;
        this.collisonX = this.game.width + this.width + Math.random() * this.game.width * 0.5 ;
        //Without this random offset, objects would always start at the same collisonX position, leading to a predictable pattern. By introducing randomness, objects appear on-screen at different times, depending on how far off-screen they start.
        this.collisonY = this.game.Topmargin + Math.random() * (this.game.height - this.game.Topmargin) ;
        this.spriteX;
        this.spriteY;
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
    }
    draw(context){
       context.drawImage(this.image, this.frameX * this.spritewidth, this.frameY * this.spriteheight, this.spritewidth, this.spriteheight, this.spriteX, this.spriteY, this.width, this.height);
        if(this.game.debug){
            context.beginPath();
            context.arc(this.collisonX,this.collisonY,
            this.collisonRadius,0,Math.PI*2); 
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            }
    }
    update(deltatime){
        this.spriteX = this.collisonX - this.spritewidth * 0.5;
        this.spriteY = this.collisonY - this.spriteheight * 0.5 - 70;
        this.collisonX -= this.speedX; //we add '-' for left movement
        if(this.spriteX + this.width < 0 && !this.game.gameOver){
            this.collisonX = this.game.width + this.width + Math.random() * this.game.width * 0.5 ;
            this.collisonY = this.game.Topmargin + Math.random() * (this.game.height - this.game.Topmargin);
        }  
            // Collision logic ignored for enemies
        let collisionObject = [this.game.player, ...this.game.obsticles];
        collisionObject.forEach(object => {
            let [collision, distance, SumRadi, dx, dy] = this.game.checkCollison(this, object);
            if(collision){
                    const unit_x = dx / distance; 
                    const unit_y = dy / distance;
                    this.collisonX = object.collisonX + (SumRadi+1) * unit_x;
                    this.collisonY = object.collisonY + (SumRadi+1) * unit_y;
                }    
            });
    }    
}

class Larva{
    constructor(game, x, y){
        this.game = game;
        this.collisonX = x;
        this.collisonY = y;
        this.collisonRadius = 30;
        this.image = document.getElementById('larva');
        this.spriteWidth = 150;
        this.spriteHeight = 150;
        this.width =  this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.speedY = 1 + Math.random();
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*2);
    }
    draw(context){
      context.drawImage(this.image, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth,this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
      if(this.game.debug){
        context.beginPath();
        context.arc(this.collisonX,this.collisonY,
        this.collisonRadius,0,Math.PI*2); 
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        }
    }
    update(){
        this.collisonY -= this.speedY;
        this.spriteX = this.collisonX - this.spriteWidth * 0.5;
        this.spriteY = this.collisonY - this.spriteHeight * 0.5;
        //move to safety
        if (this.collisonY < this.game.Topmargin){
            this.markeforDeletion = true;
            this.game.removeGamObject();
            if (!this.game.gameOver) this.game.score++;
            for(let i = 0; i < 3; i++ ){
            this.game.particles.push(new Firefly(this.game, this.collisonX, this.collisonY, 'yellow'))}
        }
        //Collision with object
        let collisionObject = [this.game.player, ...this.game.obsticles, ...this.game.eggs]; //
        collisionObject.forEach(object => {
        let [collision, distance, SumRadi, dx, dy] = this.game.checkCollison(this,object); // b/w egg and the all which is in array.
    
        if(collision){
            const unit_x = dx / distance; 
            const unit_y = dy / distance;
            this.collisonX = object.collisonX + (SumRadi+1) * unit_x;
            this.collisonY = object.collisonY + (SumRadi+1) * unit_y;
        }
    });
        //Collision with enimies
        this.game.enemies.forEach(object => {
          if (this.game.checkCollison(this, object)[0] && !this.game.gameOver){
             this.markeforDeletion = true;
             this.game.removeGamObject();
             this.game.losHachling++;
             for (let i = 0; i < 5; i++) {
                this.game.particles.push(new Spark(this.game, this.collisonX, this.collisonY, 'yellow'));
            }
          };
        });
    }
}

class Particle{
    constructor(game, x, y, color){
        this.game = game;
        this.collisonX = x;
        this.collisonY = y;
        this.color = color;
        this.radius = Math.random()* 8 + 4;
        this.speedX = Math.random()* 6 - 3;
        this.speedY = Math.random()* 2 + 0.5;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.01;
        this.markeforDeletion = false;
    }
    draw(context){
        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.collisonX,this.collisonY,
        this.radius,0,Math.PI*2);
        context.fill();
        context.stroke();
        context.restore();
        
    }
}
class Firefly extends Particle {
   update(){
      this.angle += this.speedX * 0.1;
      this.collisonX += Math.cos(this.angle)*this.speedX;
      this.collisonY -= this.speedY;
      if (this.collisonY < 0 - this.radius){
        this.markeforDeletion = true;
        this.game.removeGamObject();
      }
   }
}
class Spark extends Particle {
    update(){
      this.angle += this.va * 0.5;
      this.collisonX -= Math.cos(this.angle) * this.speedX;
      this.collisonY -= Math.sin(this.angle) * this.speedY;
      if(this.radius > 0.2) this.radius -= 0.05;
      if (this.radius < 0.1){
        this.markedForDelation = true;
        this.game.removeGamObject();
      }
    }
 }

class Game{
    constructor(canvas2){
        this.canvas1 = canvas2;
        this.width = this.canvas1.width;
        this.height = this.canvas1.height;
        this.Topmargin = 250;
        this.debug = true;
        this.player = new Player(this); // "this.player" is an object of Player constructoer by which we can acess all the function insite the player class by "(this)"
        this.time = 0;
        this.fps = 70;
        this.interwal = 1000/this.fps;
        // in the code "this" keyword referse to the entire Game object
        this.numberofObsticle = 10;
        this.obsticles = [];
        //egg
        this.eggs = [];
        this.maxEggs = 5 ;
        this.eggTimer = 0;
        this.eggInterval = 500;
        //Enemy
        this.enemies = [];
        //comon object
        this.gameObject = [];
        //hachling
        this.hachling = [];
        this.score = 0;
        this.losHachling = 0;
        //Game score
        this.WinningScore = 30;
        this.gameOver = false;
        //Particle
        this.particles = [];
        this.mouse = {
            x: this.width*0.5,
            y: this.height*0.5,
            pressed: false // Custom property to track if the mouse is pressed
        };
        canvas.addEventListener('mousedown',(e) =>{ // we don"t use normal Function becuse by it we can't inherit the parrent function, So wwe use arrow function.
           this.mouse.x = e.offsetX;
           this.mouse.y = e.offsetY;
           //console.log(e.x,e.y); //e.x and e.y we get the corrdinate from all over window for inside the canvas we use offsetX and offsetY.
           this.mouse.pressed = true; // Setting custom property
        });

        canvas.addEventListener('mouseup',(e) =>{ 
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = false; // Setting custom property
 
        });
        canvas.addEventListener('mousemove',(e) =>{ 
            if(this.mouse.pressed){
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            }
        });
        
        canvas.addEventListener('keydown', (e) => {
            if (e.key === 'd') this.debug = !this.debug;
           else if (e.key === 'r') this.restart();
        });   
        //this function are used to ensure that the canvas element can receive keyboard events
        canvas.setAttribute('tabindex', '0'); //This line sets the tabindex attribute of the canvas element to 0
        canvas.focus(); //This line programmatically sets the focus on the canvas element.
    } 
    render(context, deltatime){
        if(this.time > this.interwal){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            this.gameObject = [...this.obsticles, ...this.eggs, this.player, ...this.enemies, ...this.hachling, ...this.particles];
            //Sort by vertical position
            // You have call it before draw method
            this.gameObject.sort((a, b) => {
                return a.collisonY - b.collisonY;
               });
            this.gameObject.forEach(function(object){  //this.gameObject.forEach(obsticle => obsticle.draw(object));
                object.draw(context);
                object.update(deltatime);
            });
           this.time = 0;
        } 
           this.time += deltatime;

        //add egg
        if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver){
            this.addegg(); 
            this.eggTimer = 0;
            
        }else{
            this.eggTimer += deltatime;
        }
        //Score text
        // context.fillText('Score = ',80,50)
        // context.fillText(this.score,170,50);
        // context.fillText('LostHachling = ',145,95)
        // context.fillText(this.losHachling,300,95);
        context.save();
        ctx.fillStyle = 'yellow';
        context.textAlign = 'left';
        context.fillText('Score: '+this.score, 25, 50);
        if(this.debug){
        context.fillText('Lost: '+this.losHachling, 25, 100);
        }
        context.restore();

        //Win / lose message
        if(this.score >= this.WinningScore){
            this.gameOver = true;
            context.save();
            context.fillStyle ='rgba(0,0,0,0.5)';
            context.fillRect(0, 0, this.width, this.height);
            context.fillStyle = 'white';
            this.textAlign = 'center';
            context.shadowOfsetX = 4;
            context.shadowOfsetY = 4;
            context.shadowColor = 'black';
            let message1;
            let message2;
            if(this.losHachling <= 5){
             //win
             message1 = "Bullsaye!!!";
             message2 = "You bullied the bullies!";
            }else{
             //lose
             message1 = "Bullocks!";
             message2 = "You Lost! " + this.losHachling + " hatchlings, don't be a pushover!";
            }
            context.font = '130px Bangers';
            context.fillText(message1, this.width * 0.5, 
                this.height * 0.5 - 20);
            context.font = '40px Bangers';
            context.fillText(message2, this.width * 0.5, 
                this.height * 0.5 + 40);
            context.fillText("Final Score = " + this.score + " Press 'R' to butt head again!", this.width*0.5, this.height*0.5 + 90)

            context.restore();
        }
     }
     restart(){
        this.player.restart(); 
        this.obsticles = [];
        //egg
        this.eggs = [];
        //Enemy
        this.enemies = [];
        //comon object
        this.gameObject = [];
        //hachling
        this.hachling = [];
        //Particle
        this.particles = [];   
        this.mouse = {
            x: this.width*0.5,
            y: this.height*0.5,
            pressed: false // Custom property to track if the mouse is pressed
        };
        this.score = 0;
        this.losHachling = 0;
        this.init();
     }
     addegg(){
        this.eggs.push(new Egg(this));
     }
     addEnemy(){
        this.enemies.push(new Enemy(this));
     }
     removeGamObject(){
       this.eggs = this.eggs.filter(object => !object.markeforDeletion); //filter method create a copy of this array
       this.hachling = this.hachling.filter(object => !object.markeforDeletion);
       this.particles = this.particles.filter(object => !object.markeforDeletion);
     }
     checkCollison(a,b){
     const dx = a.collisonX - b.collisonX;   
     const dy = a.collisonY - b.collisonY;
     const distance = Math.hypot(dx,dy);
     const SumRadi = a.collisonRadius + b.collisonRadius;
     return[(distance<SumRadi), distance, SumRadi, dx, dy]; 
     //When the return statement is executed, the function stops executing and the specified value is returned to the location where the function was called.
     }

     init(){ //it allow to erite some code that should be execute when an object is used.
        //  for(let i=1;i<this.numberofObsticle;i++){
       //     this.obsticles.push(new Obstical(this))};
       for(let i=0; i<3; i++){
           this.addEnemy();
       }
       let attempt = 0;
      while(this.obsticles.length < this.numberofObsticle && attempt < 500){
        let Overlaping = false;
      let testObstacle = new Obsticle(this);

      this.obsticles.forEach(function(obsticle){
      let dx = testObstacle.collisonX - obsticle.collisonX;
      let dy = testObstacle.collisonY - obsticle.collisonY;
      let distance = Math.hypot(dx,dy);
      let distacebuffer = 150;
      let SumRadii = testObstacle.collisonRadius + obsticle.collisonRadius
      +distacebuffer;
      if(distance < SumRadii){
       Overlaping = true;
      }
      }) ;
      const margin = testObstacle.collisonRadius * 3;
      const spriteBufferX = testObstacle.spritewidth / 2;
    const spriteBufferY = testObstacle.spriteheight / 2;
      if(!Overlaping && 
        testObstacle.spriteX > 0 && 
        testObstacle.spriteX < this.width - testObstacle.spritewidth && //(Its mean testObsticle.sprintx who total width or image width ke andar aaye) 
        testObstacle.collisonY > this.Topmargin + margin && 
        testObstacle.collisonY < this.height - margin){
            // for bottom edge we use "this.height-margin"
            // for right edge we use "this.width-Obsticle.spriex"
        this.obsticles.push(testObstacle);
      }
      attempt++;
     }
    }
}


const game = new Game(canvas);
console.log(game);
game.init();
// console.log(game)

let Lasttime = 0;
function animate(timeStamp){
    const deltatime = timeStamp - Lasttime;
    Lasttime = timeStamp;
    //ctx.clearRect(0,0,canvas.width,canvas.height); // to erase the back coordinate object
    game.render(ctx , deltatime);  // we call render function again again & again So, we put in animate function
    requestAnimationFrame(animate); //for animate an object it will use in all condition to animate
}
animate(0);

});
