// Declaring some global variables for the Start-Position of the player (fieldx, fieldy),
// for the key-value released by the Engine and the array for enemies and gems
var fieldX = 202;
var fieldY = 404;
var key = null;
var allEnemies = [];
var allGreenGems = [];
var allItems = [];
var allTreasures = [];

// creating the Enemies-object, which our player must avoid
// included are some random-values for the bugs to start at different points
// on the x-axis and move in different speed
var Enemy = function(y) {
    this.x = Math.floor((Math.random() * ((-620) - (-10)) + (-10)));
    this.y = y;
    this.speed = Math.floor((Math.random() * (6 - 3) + 3));
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// new calculation of the random speed of the enemy
// set back left outside the canvas when hitting the right edge of the canvas
Enemy.prototype.update = function(dt) {
    if (this.x >= 505) {
        this.speed = Math.floor((Math.random() * (6 - 3) + 3));
        this.x = -80;
    } else {
        this.x += (505 / this.speed) * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//function (invoked in Engine, function update) that checks if player and enemy are colliding by iterating over the
//allItems-array and comparing the x- and y-values of every array element with the
// x- and y-values of the player
// if they collide, the function sets player.live -1 and prints the new live-value
// on the score-board. If live-value reaches 0, the method player.endGame is invoked
// and the game is over.
Enemy.prototype.checkCollisions = function() {
    for (var i = 0; i <= allEnemies.length - 1; i++) {
        if (allEnemies[i].y === (player.y - 12) && allEnemies[i].x > player.x - 75 && allEnemies[i].x < player.x + 70) {
            player.live -= 1;
            document.getElementById("life").innerHTML = player.live;
            player.x = fieldX;
            player.y = fieldY;
            if (player.live === 0) {
                player.endGame();
            }
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// the object creator with different values, including the moveAllowed
// that value stops the possibility to move the player with your keys
// while the player-request-window is in charge
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.moveX = this.x;
    this.moveY = this.y;
    this.sprite = "images/char-boy.png";
    this.score = 0;
    this.live = 3;
    this.gems = 0;
    this.moveAllowed = false;
};

// drawing the Player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// taking in the pressed key and write it into the global key-variable
Player.prototype.handleInput = function(keycode) {
    if (keycode !== undefined && player.moveAllowed === true) {
        key = keycode;
    }
};

// adding the update-methods, which uses the content of the global key-variable
// for each key-value there is a movement in px on the x- oder the y-axis.
// those values are committed to the player object. Checks with if-loops, if a
// key was pressed and if the player is running against a rock by comparing the
// x- and y-values of player and rock
Player.prototype.update = function() {
    if (key !== null) {
        switch (key) {
            case "left":
                if (this.x > 0) {
                    if (this.x - 101 === rock.x - 20 && this.y === rock.y - 48) {
                        this.x = this.x;
                    } else {
                        this.x = this.x - 101;
                    }
                }
                break;
            case "right":
                if (this.x < 404) {
                    if (this.x + 101 === rock.x - 20 && this.y === rock.y - 48) {
                        this.x = this.x;
                    } else {
                        this.x = this.x + 101;
                    }
                }
                break;
            case "up":
                if (this.y > 83) {
                    if (this.y - 83 === rock.y - 48 && this.x === rock.x - 20) {
                        this.y = this.y;
                    } else {
                        this.y = this.y - 83;
                    }
                } else {
                    player.winner();
                }
                break;
            case "down":
                if (this.y < 380) {
                    if (this.y + 83 === rock.y - 48 && this.x === rock.x - 20) {
                        this.y = this.y;
                    } else {
                        this.y = this.y + 83;
                    }
                    break;
                }
        }
        key = null;
    }
};

// method invoked by hitting the upper edge of the canvas (reaching the blue)
// committing plus one to the player object, printing the new score on the score-board
// setting back the player to the initial position
Player.prototype.winner = function() {
    this.score += 1;
    document.querySelector("#score").textContent = this.score;
    this.x = fieldX;
    this.y = fieldY;
    rock.newRound = true;
    if (player.score === 10) {
        player.endGame();
    }
};

// method invoked by ending the game through collecting 10 Points (win) oder
// loosing all your lifes (loose). Confirm-Window shows the result.
// invoking the function start, which is identical with function init in the Engine
Player.prototype.endGame = function() {
    if (this.score >= 10) {
        confirm("Congrats, you win!!!");
        start();
    } else if (this.live === 0) {
        document.getElementById("life").innerHTML = this.live;
        document.querySelector(".gameInfo").style.display = "none";
        confirm("Sorry, you loose. Try it again!");
        start();
    }

    // when game ends, these object values are reseted an printed to the score-board
    player.live = 3;
    player.gems = 0;
    player.score = 0;
    document.getElementById("life").innerHTML = player.live;
    document.getElementById("gems").innerHTML = player.gems;
    document.getElementById("score").innerHTML = player.score;
};

// Creating the object for the green gems
var GreenGems = function() {
    this.width = 60;
    this.height = 80;
    this.x;
    this.y;
    this.time_now = 0;
    this.time_target = 0;
    this.show = false;
    this.sprite = 'images/Gem Green.png';
    this.id = "green";
};

// creating an random position of the green gem
GreenGems.prototype.chance = function() {
    this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
    this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
};

// update the green gem, taking the actual time, adding some random time into the
// object value time_target. When actual time outruns the time_target, method change
// is fired an changes the position of the green gem
GreenGems.prototype.update = function() {
    if (this.time_now >= this.time_target) {
        this.chance();
        this.time_target = Date.now() + Math.floor(Math.random() * (10001 - 3000) + 3000);
    }
    this.time_now = Date.now();
};

// drawing the green gem on the canvas
GreenGems.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// function (invoked in Engine, function update) checking if player is hitting a
// gem by iterating over the allItems-array and comparing the x- and y-values of
// the elements with the x- and y-values of the player. If hitting green, one point
// is added to player.score, if hitting blue, 3 Points are added.
// when score === 10, the method player.endGame() is ending the game

GreenGems.prototype.checkCollisionsItems = function() {
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].y === player.y + 48 && allItems[i].x === player.x + 20) {
            var item = allItems[i].id;
            switch (item) {
                case "green":
                    player.gems += 1;
                    break;
                case "blue":
                    player.gems += 3;
                    break;
                case "heart":
                    player.live += 1;
                    break;
            }
            document.getElementById("gems").innerHTML = player.gems;
            document.getElementById("life").innerHTML = player.live;
            allItems[i].time_now = 0;
            allItems[i].time_target = 0;
            allItems[i].update();
        }
    }
};

// creating a BlueGems-object, include the key .display. If the value is false,
// the method update can create an new blue gem after a random time. If it´s true,
// the update-method puts the blue gem out of side for a random time.
var BlueGems = function() {
    this.width = 60;
    this.height = 80;
    this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
    this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
    this.time_now = 0;
    this.time_target = 0;
    this.display = false;
    this.sprite = 'images/Gem Blue.png';
    this.id = "blue";
};

// update-method for the blue gem, calculates a random time between 3 and 10 sec
// if display===false blue gem is put in a visible position, if display===true
// the blue gem is hidden for 3 to 10 sec from the canvas (-100, -100)

BlueGems.prototype.update = function() {
    if (this.time_now >= this.time_target) {
        if (this.display === false) {
            this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
            this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
            this.display = true;
        } else {
            this.x = -100;
            this.y = -100;
            this.display = false;
        }
        this.time_target = Date.now() + Math.floor(Math.random() * (10001 - 3000) + 3000);
    }
    this.time_now = Date.now();
};
// drawing the blue gem on the canvas
BlueGems.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// creating an new Rock-object, including key newRound which is used in method update
var Rock = function() {
    this.width = 60;
    this.height = 80;
    this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
    this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
    this.sprite = "images/Rock.png";
    this.newRound = false;
    this.id = "rock";
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

//update-method brings the rock in another position if the player hits the top of
// the canvas and is pushed back into the initial position - to avoid, that the
// rock is whole the game in the same position
Rock.prototype.update = function() {
    if (this.newRound === true) {
        this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
        this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
        this.newRound = false;
    }
};

// creating the Heart-object
var Heart = function() {
    this.width = 60;
    this.height = 80;
    this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
    this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
    this.time_now = 0;
    this.time_target = 0;
    this.display = false;
    this.sprite = 'images/Heart.png';
    this.id = "heart";
};

//drawing the heart on the canvas
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// update-methods fires after a time between 3 and 10 sec. If heart wasn´t on the
// canvas (display===false) heart is pushed to a visible position on the canvas
// if heart was visible on the canvas, it is pushed into an invisible area of the
// canvas. It reoccur after 3 to 10 sec.
Heart.prototype.update = function() {
    if (this.time_now >= this.time_target) {
        if (this.display === false) {
            this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
            this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
            this.display = true;
        } else {
            this.x = -100;
            this.y = -100;
            this.display = false;
        }
        this.time_target = Date.now() + Math.floor(Math.random() * (10001 - 3000) + 3000);
    }
    this.time_now = Date.now();
};


//method for checking, if player hits a Heart or another treasure
Heart.prototype.checkCollisionTreasure = function() {
    for (var i = 0; i < allTreasures.length; i++) {
        if (allItems[i].y === player.y + 48 && allItems[i].x === player.x + 20) {
            var item = allItems[i].id;
            switch (item) {
                case "green":
                    player.gems += 1;
                    break;
                case "blue":
                    player.gems += 3;
                    break;
            }
            document.getElementById("gems").innerHTML = player.gems;
            allItems[i].time_now = 0;
            allItems[i].time_target = 0;
            allItems[i].update();
        }
    }
};



// Creating new enemy-objects with the object-creator-functions
var enemy1 = new Enemy(60);
var enemy2 = new Enemy(143);
var enemy3 = new Enemy(226);

// Creating all the other objects with object-creator
var player = new Player(fieldX, fieldY);
var gem_green = new GreenGems();
allGreenGems.push(gem_green);
var gem_blue = new BlueGems();
var rock = new Rock();
var heart = new Heart();

//Creating an array of all enemies to iterate over it in the function checkCollision
allEnemies.push(enemy1, enemy2, enemy3);

// Creating an array of all gems and the heart items  to iterate over it in the function checkCollisionsItems
allItems.push(gem_green, gem_blue, heart);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});