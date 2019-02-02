$(function(){
  let $canvas = $("canvas");
  let canvas = $canvas[0]
  let ctx = canvas.getContext('2d');

  let keys = {up: 87, down: 83, left: 65, right: 68, upk: 38, downk: 40, leftk: 37, rightk:39};
  let player = {x: 0, y: 0, rpos: function(){this.x = -this.size/2; this.y = canvas.height-2*this.size/3; return this}, size:100, color:"black", speed: 20, get dSpeed(){return player.speed*(Math.sqrt(0.5));}, moveUp: false, moveDown: false, moveLeft: false, moveRight: false};
  let goal = {x:1800, y:0, width: 200, height:200, color:"#2F2"}
  let hborders = [/*{x1:0,x2:canvas.width,y:0, render:true},{x1:0,x2:canvas.width,y:canvas.height, render:true}*/];
  let vborders = [/*{y1:0,y2:canvas.height,x:0, render:true},{y1:0,y2:canvas.height,x:canvas.width, render:true}*/];
  let levels = [
{h:[{x1:0,x2:canvas.width,y:0, render:true},{x1:0,x2:canvas.width,y:canvas.height, render:true},{x1:0,x2:1800,y:800, render:true},{x1:0,x2:600,y:600, render:true},{x1:800,x2:1600,y:600, render:true},{x1:1800,x2:2000,y:201, render:true},{x1:200,x2:1800,y:400, render:true},{x1:200,x2:2000,y:200, render:true}],
v:[{y1:0,y2:canvas.height,x:0, render:true},{y1:0,y2:canvas.height,x:canvas.width, render:true},{y1:600+1,y2:800-1,x:800, render:true},{y1:200, y2:600, x:1800, render:true}]},
{h:[{x1:0,x2:canvas.width,y:0, render:true},{x1:0,x2:canvas.width,y:canvas.height, render:true},{x1:0,x2:400,y:800, render:true},{x1:600,x2:1000,y:800, render:true},{x1:1400,x2:1800,y:800, render:true},{x1:400,x2:800,y:600, render:true},{x1:1200,x2:1400,y:600, render:true},{x1:1800,x2:2000,y:600, render:true},{x1:0,x2:200,y:400,render:true},{x1:800,x2:1000,y:400,render:true},{x1:1200,x2:1800,y:400,render:true},{x1:200,x2:600,y:200,render:true},{x1:1000,x2:1200,y:200,render:true},{x1:1600,x2:2000,y:201,render:true}],
v:[{y1:0,y2:canvas.height,x:0, render:true},{y1:0,y2:canvas.height,x:canvas.width, render:true},{y1:800,y2:1000,x:800, render:true},{y1:800,y2:1000,x:1200, render:true},{y1:600+1,y2:800,x:600, render:true},{y1:600+1,y2:800,x:1000, render:true},{y1:600+1,y2:800-1,x:1400, render:true},{y1:400+1,y2:600-1,x:200, render:true},{y1:200+1,y2:600-1,x:400, render:true},{y1:400+1,y2:600-1,x:800, render:true},{y1:400+1,y2:600-1,x:1200, render:true},{y1:400+1,y2:600,x:1600, render:true},{y1:200+1,y2:400,x:600, render:true},{y1:200+1,y2:400-1,x:1000, render:true},{y1:0,y2:400-1,x:1400, render:true},{y1:0,y2:200,x:800, render:true}],
question: "What’s the fastest can cats run? A; 5 mph, B; 30 mph, C, 45 mph.", answer:"B",answered: false, enemies:[{x:canvas.width,y:0,skin:0},{x:canvas.width,y:canvas.height,skin:0}]},
/*Rows*/{h:[{x1:0,x2:30,y:15, render:true},{x1:0,x2:30,y:0, render:true},
/*Row 1*/{x1:3,x2:6,y:1},{x1:12,x2:17,y:1},{x1:19,x2:21,y:1},{x1:22,x2:24,y:1},{x1:26,x2:27,y:1},{x1:29,x2:30,y:1},
/*Row 2*/{x1:0,x2:2,y:2},{x1:4,x2:8,y:2},{x1:10,x2:16,y:2},{x1:17,x2:19,y:2},{x1:21,x2:22,y:2},{x1:23,x2:25,y:2},{x1:27,x2:29,y:2},
/*Row 3*/{x1:4,x2:6,y:3},{x1:7,x2:9,y:3},{x1:10,x2:18,y:3},{x1:20,x2:23,y:3},{x1:25,x2:28,y:3},{x1:29,x2:30,y:3},
/*Row 4*/{x1:1,x2:4,y:4},{x1:7,x2:8,y:4},{x1:9,x2:10,y:4},{x1:14,x2:15,y:4},{x1:17,x2:18,y:4},{x1:24,x2:27,y:4},{x1:28,x2:29,y:4},
/*Row 5*/{x1:0,x2:2,y:5},{x1:4,x2:5,y:5},{x1:8,x2:9,y:5},{x1:12,x2:14,y:5},{x1:15,x2:19,y:5},{x1:20,x2:23,y:5},{x1:25,x2:28,y:5},
/*Row 6*/{x1:3,x2:5,y:6},{x1:6,x2:8,y:6},{x1:9,x2:10,y:6},{x1:11,x2:15,y:6},{x1:16,x2:17,y:6},{x1:19,x2:20,y:6},{x1:21,x2:22,y:6},{x1:23,x2:27,y:6},{x1:29,x2:30,y:6},
/*Row 7*/{x1:1,x2:3,y:7},{x1:4,x2:7,y:7},{x1:8,x2:9,y:7},{x1:12,x2:13,y:7},{x1:18,x2:20,y:7},{x1:24,x2:26,y:7},{x1:27,x2:29,y:7},
/*Row 8*/{x1:0,x2:2,y:8},{x1:4,x2:5,y:8},{x1:6,x2:8,y:8},{x1:9,x2:10,y:8},{x1:13,x2:15,y:8},{x1:16,x2:19,y:8},{x1:20,x2:21,y:8},
/*Row 9*/{x1:1,x2:2,y:9},{x1:5,x2:7,y:9},{x1:10,x2:11,y:9},{x1:14,x2:16,y:9},{x1:17,x2:18,y:9},{x1:23,x2:24,y:9},{x1:25,x2:26,y:9},{x1:27,x2:28,y:9},
/*Row 10*/{x1:0,x2:1,y:10},{x1:2,x2:3,y:10},{x1:4,x2:6,y:10},{x1:9,x2:12,y:10},{x1:15,x2:23,y:10},{x1:24,x2:25,y:10},{x1:26,x2:27,y:10},{x1:28,x2:29,y:10},
/*Row 11*/{x1:1,x2:2,y:11},{x1:3,x2:4,y:11},{x1:6,x2:9,y:11},{x1:10,x2:11,y:11},{x1:14,x2:15,y:11},{x1:16,x2:21,y:11},{x1:22,x2:25,y:11},{x1:27,x2:30,y:11},
/*Row 12*/{x1:0,x2:1,y:12},{x1:5,x2:6,y:12},{x1:8,x2:10,y:12},{x1:12,x2:14,y:12},{x1:16,x2:17,y:12},{x1:19,x2:24,y:12},{x1:26,x2:28,y:12},
/*Row 13*/{x1:8,x2:10,y:13},{x1:11,x2:13,y:13},{x1:16,x2:18,y:13},{x1:21,x2:23,y:13},{x1:25,x2:26,y:13},{x1:27,x2:29,y:13},
/*Row 14*/{x1:1,x2:2,y:14},{x1:3,x2:4,y:14},{x1:7,x2:9,y:14},{x1:10,x2:12,y:14},{x1:13,x2:18,y:14},{x1:20,x2:21,y:14},{x1:23,x2:25,y:14},{x1:28,x2:29,y:14}],
/*Columns*/v:[{x:0,y1:15,y2:0, render:true},{x:30,y1:15,y2:0, render:true},
/*Column 1*/{y2:0,y1:1,x:1},{y2:3,y1:4,x:1},{y2:6,y1:7,x:1},{y2:13,y1:14,x:1},
/*Column 2*/{y2:1,y1:3,x:2},{y2:5,y1:6,x:2},{y2:8,y1:14,x:2},
/*Column 3*/{y2:0,y1:3,x:3},{y2:4,y1:9,x:3},{y2:11,y1:13,x:3},
/*Column 4*/{y2:2,y1:4,x:4},{y2:7,y1:11,x:4},{y2:12,y1:15,x:4},
/*Column 5*/{y2:4,y1:6,x:5},{y2:10,y1:14,x:5},
/*Column 6*/{y2:3,y1:6,x:6},{y2:12,y1:15,x:6},
/*Column 7*/{y2:0,y1:1,x:7},{y2:2,y1:3,x:7},{y2:4,y1:5,x:7},{y2:9,y1:14,x:7},
/*Column 8*/{y2:1,y1:2,x:8},{y2:4,y1:10,x:8},{y2:12,y1:13,x:8},
/*Column 9*/{y2:0,y1:3,x:9},{y2:8,y1:11,x:9},
/*Column 10*/{y2:1,y1:7,x:10},{y2:11,y1:12,x:10},{y2:13,y1:14,x:10},
/*Column 11*/{y2:0,y1:1,x:11},{y2:4,y1:9,x:11},{y2:11,y1:13,x:11},
/*Column 12*/{y2:3,y1:5,x:12},{y2:7,y1:12,x:12},
/*Column 13*/{y2:4,y1:5,x:13},{y2:8,y1:11,x:13},{y2:13,y1:14,x:13},
/*Column 14*/{y2:7,y1:8,x:14},{y2:9,y1:13,x:14},{y2:14,y1:15,x:14},
/*Column 15*/{y2:4,y1:8,x:15},{y2:12,y1:14,x:15},
/*Column 16*/{y2:3,y1:5,x:16},{y2:6,y1:7,x:16},{y2:8,y1:9,x:16},{y2:11,y1:12,x:16},
/*Column 17*/{y2:1,y1:2,x:17},{y2:6,y1:8,x:17},
/*Column 18*/{y2:0,y1:2,x:18},{y2:3,y1:4,x:18},{y2:5,y1:7,x:18},{y2:9,y1:10,x:18},{y2:11,y1:14,x:18},
/*Column 19*/{y2:2,y1:5,x:19},{y2:7,y1:9,x:19},{y2:12,y1:15,x:19},
/*Column 20*/{y2:1,y1:6,x:20},{y2:9,y1:10,x:20},{y2:12,y1:13,x:20},
/*Column 21*/{y2:3,y1:4,x:21},{y2:6,y1:9,x:21},{y2:10,y1:11,x:21},{y2:10,y1:11,x:21},{y2:13,y1:14,x:21},
/*Column 22*/{y2:0,y1:2,x:22},{y2:4,y1:5,x:23},{y2:6,y1:10,x:22},{y2:11,y1:12,x:22},{y2:14,y1:15,x:22},
/*Column 23*/{y2:4,y1:9,x:23},{y2:13,y1:14,x:23},
/*Column 24*/{y2:2,y1:5,x:24},{y2:7,y1:11,x:24},{y2:12,y1:13,x:24},
/*Column 25*/{y2:0,y1:2,x:25},{y2:8,y1:9,x:25},{y2:11,y1:12,x:25},{y2:14,y1:15,x:25},
/*Column 26*/{y2:1,y1:3,x:26},{y2:7,y1:8,x:26},{y2:9,y1:14,x:26},
/*Column 27*/{y2:6,y1:7,x:27},{y2:8,y1:10,x:27},{y2:13,y1:15,x:27},
/*Column 28*/{y2:1,y1:4,x:28},{y2:5,y1:7,x:28},{y2:8,y1:9,x:28},{y2:11,y1:12,x:28},
/*Column 29*/{y2:4,y1:6,x:29},{y2:7,y1:10,x:29},{y2:12,y1:14,x:29}],
simpleposition:true,goalposition:[5800,-2000],question: "Which of the following are people superstitious about? A; If you dream of a grey cat then you will find yourself in great wealth, B; If you think of a black cat with blue eyes then it will rain the next day, C; If you dream of a white cat, good luck will follow.", answer:"C",answered: false}];
  let endlevel = {h:[{x1:0,x2:canvas.width,y:0, render:true},{x1:0,x2:canvas.width,y:canvas.height, render:true}],v:[{y1:0,y2:canvas.height,x:0, render:true},{y1:0,y2:canvas.height,x:canvas.width, render:true}],
question: "The first year of a cats life is equal to _____ human years. A;15, B; 7, C; 3", answer:"A",answered: false};
  let enemyArray = [];
  /*21 by 14?*/
  var level = 1;

  function init(){
      level=1;
      alert("Instructions: Hello player! Please use the WASD keys to move, W to go forward, A to got to the left, D to got to the right, and S to go backward. You have to avoid the cats, dog, and people you see along the way (Besides that orange cat, Ernie. That’s you!) Your goal is to get to the milk bowl! Once you get there answer the question correctly and move on to the next level! Thanks! Meow!");
      player.rpos();
      enemyArray = [];
      hborders.splice(0,hborders.length);
      vborders.splice(0,vborders.length);
      hborders.push.apply(hborders, levels[0].h);
      vborders.push.apply(vborders, levels[0].v);
      goal.width = goal.height = 200;
      levels.forEach(function(i){
        if("answered" in i){
          i.answered = false;
        }
      });
  }

  let thislevel;
  let triviaguess;
  function loadLevel(){
    enemyArray = [];
    thislevel = levels[level-1];
    player.rpos();
    hborders.splice(0,hborders.length);
    vborders.splice(0,vborders.length);
    if(typeof thislevel != "undefined"){
      goal.width = goal.height = 200;
      if("simpleposition" in thislevel && thislevel.simpleposition){
        // alert("vertical"+JSON.stringify(thislevel.v));
        thislevel.v=thislevel.v.map(function(i){
          return {x:i.x*200, y1:-i.y1*200+1000, y2:-i.y2*200+1000, render: true};
          // return {x:i.x*20+150, y1:-i.y1*20+250, y2:-i.y2*20+250, render: true};
          // i.x = ;
          // i.y1 = ;
          // i.y2 = -i.y2*200+1000;
        });
        // alert("after vertical"+JSON.stringify(thislevel.v));
        // alert("horizontal"+JSON.stringify(thislevel.h));
        thislevel.h=thislevel.h.map(function(i){
          return {x1:i.x1*200, x2:i.x2*200, y:-i.y*200+1000, render: true};
          // return {x1:i.x1*20+150, x2:i.x2*20+150, y:-i.y*20+250, render: true};
          // i.x1 = i.x1*200;
          // i.x2 = i.x2*200;
          // i.y = -i.y*200+1000;
        });
        // alert("after horizontal"+JSON.stringify(thislevel.h));
      }
      if("h" in thislevel){
        hborders.push.apply(hborders, levels[level-1].h);
      }
      if("v" in thislevel){
        vborders.push.apply(vborders, levels[level-1].v);
      }
      if("simpleposition" in thislevel && thislevel.simpleposition){
        thislevel.v=thislevel.v.map(function(i){
          return {x: i.x/200, y1: -i.y1/200+5, y2:-i.y2/200+5, render: true};
        });
        thislevel.h=thislevel.h.map(function(i){
          return {x1: i.x1/200, x2: i.x2/200, y:-i.y/200+5, render: true};
          // i.x1 = i.x1/200;
          // i.x2 = i.x2/200;
          // i.y = -i.y/200+5;
        });
      }
      if("question" in thislevel && "answer" in thislevel && !thislevel.answered){
        triviaguess = prompt(thislevel.question);
        while(triviaguess!==thislevel.answer){
          alert("Sorry, incorrect!");
          triviaguess = prompt(thislevel.question);
        }
        alert("Correct!");
        thislevel.answered = true;
      }
      if("enemies" in thislevel){
          enemyArray = JSON.parse(JSON.stringify(thislevel.enemies));
      }
      if("goalposition" in thislevel){
        goal.x = thislevel.goalposition[0];
        goal.y = thislevel.goalposition[1];
      } else {
        goal.x = 1800;
        goal.y = 0;
      }
    } else {
      triviaguess = prompt(endlevel.question);
      while(triviaguess!==endlevel.answer){
        alert("Sorry, incorrect!");
        triviaguess = prompt(endlevel.question);
      }
      hborders.push.apply(hborders, endlevel.h);
      vborders.push.apply(vborders, endlevel.v);
      goal.width = goal.height = -1;
      alert("You Win!");
    }

    player.moveUp = player.moveDown = player.moveLeft = player.moveRight = false;
  }

  function enemy(instance){
    // ctx.beginPath();
    // ctx.arc(instance.x+xIncrement, instance.y+yIncrement, 50, 0, 2 * Math.PI,false);
    // ctx.fillStyle = "red";
    // ctx.lineWidth = 0;
    // ctx.fill();
    if(instance.skin == 0){
      instance.skin = Math.floor(Math.random()*2)+1;
    } else {
      if(instance.skin == 1){
        ctx.drawImage($("#dog")[0], instance.x+xIncrement-50, instance.y+yIncrement-50, 100, 100);
      } else if(instance.skin == 2){
        ctx.drawImage($("#cat")[0], instance.x+xIncrement-50, instance.y+yIncrement-50, 100, 100);
      }
    }
  }

  function updateEnemyPos(instance){
    normalXPosition = -player.x;
    normalYPosition = -player.y + 1800;
    let targetPlayerX = (player.size/2) + normalXPosition;
    let targetPlayerY = (player.size/2) + normalYPosition;
    let xFromPlayer = targetPlayerX-instance.x;
    let yFromPlayer = targetPlayerY-instance.y;
    let distanceFromPlayer = Math.sqrt(Math.pow(xFromPlayer,2)*Math.pow(yFromPlayer,2));
    let speed = 3;
    let moveAngle = Math.atan2(yFromPlayer, xFromPlayer);

    if(distanceFromPlayer >= speed){
      instance.x += Math.cos(moveAngle) * speed;
      instance.y += Math.sin(moveAngle) * speed;
    }
  }

  function enemyIntersectPlayer(instance){
    circleDistance = {x:Math.abs(instance.x - normalXPosition-(player.size/2)),y:Math.abs(instance.y - normalYPosition-(player.size/2))};
    if (circleDistance.x > (player.size/2 + 50) || circleDistance.y > (player.size/2 + 50)){
      return false;
    }
    if (circleDistance.x <= (player.size/2) || circleDistance.y <= (player.size/2)) {
      return true;
    }
    cornerDistance_sq = Math.pow((circleDistance.x - player.size/2),2) + Math.pow((circleDistance.y - player.size/2),2);
    return (cornerDistance_sq <= Math.pow(50,2));
    return false;
  }

  $(window).on("resize",function(){
    // $canvas.css("transform","scale("+$(window).width()/$canvas.width()+","+$(window).height()/$canvas.height()+")");
  }).trigger("resize");

  $("#next").click(function(){
    if(level <= levels.length){
      level++;
      loadLevel();
    }
  });
  $("#prev").click(function(){
    if(level > 1){
      level--;
      loadLevel();
    }
  });
  $("#pause").click(function(){
    alert("Paused! Click the OK button to resume")
  });
  $("#reset").click(function(){
    init();
  });
  $("#redo").click(function(){
    loadLevel();
  });

  function rect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  $(document).keydown(function(e){
    switch(e.which){
      case keys.up:
        player.moveUp = true;
        break;
      case keys.down:
        player.moveDown = true;
        break;
      case keys.left:
        player.moveLeft = true;
        break;
      case keys.right:
        player.moveRight = true;
        break;
    }
  });
  $(document).keyup(function(e){
    switch(e.which){
      case keys.up:
        player.moveUp = false;
        break;
      case keys.down:
        player.moveDown = false;
        break;
      case keys.left:
        player.moveLeft = false;
        break;
      case keys.right:
        player.moveRight = false;
        break;
    }
  });


  var previousPlayerX = player.x;
  var previousPlayerY = player.y;

  var xDisplacement = (canvas.width/2-player.size/2);
  var yDisplacement = (canvas.width/2-player.size/2);
  var xIncrement = xDisplacement+player.x;
  var yIncrement = yDisplacement+player.y;
  var normalXPosition = -player.x;
  var normalYPosition = -player.y + 1800;

  var accuracy = 25;

  function checkBorders(){
    for(let i = 0; i < hborders.length; i++){
      if(normalXPosition < hborders[i].x2 && normalXPosition+player.size > hborders[i].x1 && normalYPosition < hborders[i].y && normalYPosition + player.size > hborders[i].y){
        // while(normalXPosition < hborders[i].x2 && normalXPosition+player.size > hborders[i].x1 && normalYPosition < hborders[i].y && normalYPosition + player.size > hborders[i].y){
        //   // alert("go back: " + (previousPlayerY-player.y));
        //   alert("player now: "+normalYPosition);
        //   player.y += previousPlayerY-player.y;
        //   alert("player after: "+normalYPosition);
        //   alert(normalYPosition < hborders[i].y);
        //   alert(normalXPosition < hborders[i].x2 && normalXPosition+player.size > hborders[i].x1 && normalYPosition < hborders[i].y && normalYPosition + player.size > hborders[i].y);
        // }
        player.y = previousPlayerY;

        // alert("player y is now "+player.y);
      }
      if(normalYPosition < hborders[i].y && normalYPosition+player.size > hborders[i].y && normalXPosition < hborders[i].x2 && normalXPosition+player.size > hborders[i].x1){
        player.x = previousPlayerX;
      }
    }
    for(let i = 0; i < vborders.length; i++){
      if(normalXPosition <= vborders[i].x && normalXPosition+player.size > vborders[i].x && normalYPosition < vborders[i].y2 && normalYPosition + player.size > vborders[i].y1){
        player.x = previousPlayerX;
      }
      if(normalYPosition < vborders[i].y2 && normalYPosition+player.size > vborders[i].y1 && vborders[i].x > normalXPosition && vborders[i].x < normalXPosition+player.size){
        player.y = previousPlayerY;
      }
    }
  }


  //Game Loop
  function loop(t){
    //Background
    rect(0, 0, canvas.width, canvas.height, "#30AA30");
    // console.log("Previous Player X:"+previousPlayerX+"Previous Player Y"+previousPlayerX);

    normalXPosition = -player.x;
    normalYPosition = -player.y + 1800;

    xIncrement = (canvas.width/2-player.size/2)+player.x;
    yIncrement = (-3*canvas.height/2+3*player.size/2)+player.y;

    previousPlayerX = player.x;
    previousPlayerY = player.y;

    if(player.moveUp/* && !hasTB*/){
      for(j = 0; j < accuracy; j++){
        // alert("before y increase:"+player.y);
        if(!player.moveLeft && !player.moveRight){
          player.y += player.speed/accuracy;
        } else{
          player.y += player.dSpeed/accuracy;
        }
        normalXPosition = -player.x;
        normalYPosition = -player.y + 1800;
        checkBorders();
        previousPlayerY = player.y;
      }
    }
    if(player.moveDown/* && !hasBB*/){
      for(j = 0; j < accuracy; j++){
        if(!player.moveLeft && !player.moveRight){
          player.y -= player.speed/accuracy;
        } else{
          player.y -= player.dSpeed/accuracy;
        }
        normalXPosition = -player.x;
        normalYPosition = -player.y + 1800;
        checkBorders();
        previousPlayerY = player.y;
      }
    }
    if(player.moveLeft/* && !hasLB*/){
      for(j = 0; j < accuracy; j++){
        if(!player.moveUp && !player.moveDown){
          player.x += player.speed/accuracy;
        } else{
          player.x += player.dSpeed/accuracy;
        }
        normalXPosition = -player.x;
        normalYPosition = -player.y + 1800;
        checkBorders();
        previousPlayerX = player.x;
      }
    }
    if(player.moveRight/* && !hasRB*/){
      for(j = 0; j < accuracy; j++){
        if(!player.moveUp && !player.moveDown){
          player.x -= player.speed/accuracy;
        } else{
          player.x -= player.dSpeed/accuracy;
        }
        normalXPosition = -player.x;
        normalYPosition = -player.y + 1800;
        checkBorders();
        previousPlayerX = player.x;
      }
    }

    newPlayerDifferenceX = player.x-previousPlayerX;
    newPlayerDifferenceY = previousPlayerY-player.y;

    // let hasTB = false, hasBB = false, hasLB = false, hasRB=false;
    /*Render*/

    for(let i = 0; i < hborders.length; i++){
      if(!"render" in hborders[i]){
        hborders[i].render=true;
      }
      if(hborders[i].render){
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(hborders[i].x1+(xIncrement), hborders[i].y+(yIncrement));
        ctx.lineTo(hborders[i].x2+(xIncrement), hborders[i].y+(yIncrement));
        ctx.stroke();
      }
    }

    for(let i = 0; i < vborders.length; i++){
      if(!"render" in vborders[i]){
        vborders[i].render=true;
      }
      if(vborders[i].render){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(vborders[i].x+(xIncrement), vborders[i].y1+(yIncrement));
        ctx.lineTo(vborders[i].x+(xIncrement), vborders[i].y2+(yIncrement));
        ctx.stroke();
      }
    }

    $("#score").text(level);

    //Goal
    // rect(goal.x + xIncrement, goal.y + yIncrement, goal.width, goal.height, goal.color);
    ctx.drawImage($("#goal")[0], goal.x + xIncrement, goal.y + yIncrement, 200, 200);

    //Player
    // rect(canvas.width/2 - player.size/2, canvas.height/2- player.size/2, player.size, player.size, player.color);
    ctx.drawImage($("#ernie")[0], canvas.width/2 - player.size/2, canvas.height/2- player.size/2,player.size,player.size);

    enemyArray.forEach(updateEnemyPos);
    enemyArray.forEach(enemy);
    enemyArray.forEach(function(instance){
      if(enemyIntersectPlayer(instance)){
        loadLevel();
      }
    });

    if(normalXPosition <= goal.x + goal.width && normalXPosition + player.size >= goal.x && normalYPosition + player.size >= goal.y &&  normalYPosition <= goal.y + goal.height){
      level++;
      loadLevel();
    }
    // console.log("xIncrement: "+xIncrement +" yIncrement: "+yIncrement);
    // console.log("xDisplacement: "+xDisplacement +" yDisplacement: "+yDisplacement);
    // console.log("Player X: "+player.x +" Player Y: "+player.y);
    // console.log("Normal X:"+normalXPosition+"Normal Y: "+normalYPosition);
    // console.log("Goal X: "+goal.x +" Goal Y: "+goal.y);
    // console.log("-player.x <= goal.x + goal.width + xDisplacement " + (-player.x <= goal.x + goal.width));
    // console.log("-player.x + player.size >= goal.x + xDisplacement " + (-player.x + player.size >= goal.x));
    // console.log("-player.y+1800 + player.size >= goal.y - yDisplacement" + (-player.y + 1800 + player.size >= goal.y));
    // console.log("-player.y+1800 <= goal.y + goal.height - yDisplacement" + ( -player.y + 1800 <= goal.y + goal.height));

    window.requestAnimationFrame(loop);
  }
  init();
  window.requestAnimationFrame(loop);
});
