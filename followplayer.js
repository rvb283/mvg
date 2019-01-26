$(function(){
  let $canvas = $("canvas");
  let canvas = $canvas[0]
  let ctx = canvas.getContext('2d');

  let keys = {up: 87, down: 83, left: 65, right: 68, upk: 38, downk: 40, leftk: 37, rightk:39};
  let player = {x: 0, y: 0, rpos: function(){this.x = 0; this.y = canvas.height-this.size; return this}, size:100, color:"black", speed: 20, get dSpeed(){return player.speed*(Math.sqrt(0.5));}, moveUp: false, moveDown: false, moveLeft: false, moveRight: false};
  let goal = {x:1800, y:0, width: 200, height:200, color:"#2F2"}
  let hborders = [{x1:0,x2:canvas.width,y:0, render:true},{x1:0,x2:canvas.width,y:canvas.height, render:true}];
  let vborders = [{y1:0,y2:canvas.height,x:0, render:true},{y1:0,y2:canvas.height,x:canvas.width, render:true}];
  let levels = [
{h:[{x1:0,x2:1800,y:800, render:true},{x1:0,x2:600,y:600, render:true},{x1:800,x2:1600,y:600, render:true},{x1:1800,x2:2000,y:400, render:true},{x1:200,x2:2000,y:400, render:true},{x1:200,x2:2000,y:200, render:true}],
v:[{y1:600+1,y2:800-1,x:800, render:true},{y1:200, y2:600, x:1800, render:true}]},
{h:[{x1:0,x2:400,y:800, render:true},{x1:600,x2:1000,y:800, render:true},{x1:1400,x2:1800,y:800, render:true},{x1:400,x2:800,y:600, render:true},{x1:1200,x2:1400,y:600, render:true},{x1:1800,x2:2000,y:600, render:true},{x1:0,x2:200,y:400,render:true},{x1:800,x2:1000,y:400,render:true},{x1:1200,x2:1800,y:400,render:true},{x1:200,x2:600,y:200,render:true},{x1:1000,x2:1200,y:200,render:true},{x1:1600,x2:2000,y:215,render:true}],
v:[{y1:800,y2:1000,x:800, render:true},{y1:800,y2:1000,x:1200, render:true},{y1:600+1,y2:800,x:600, render:true},{y1:600+1,y2:800,x:1000, render:true},{y1:600+1,y2:800-1,x:1400, render:true},{y1:400+1,y2:600-1,x:200, render:true},{y1:200+1,y2:600-1,x:400, render:true},{y1:400+1,y2:600-1,x:800, render:true},{y1:400+1,y2:600-1,x:1200, render:true},{y1:400+1,y2:600,x:1600, render:true},{y1:200+1,y2:400,x:600, render:true},{y1:200+1,y2:400-1,x:1000, render:true},{y1:0,y2:400-1,x:1400, render:true},{y1:0,y2:200,x:800, render:true}],
question: "Question #1", answer:"answer",answered: false, enemies:[{x:canvas.width,y:0},{x:canvas.width,y:canvas.height}]}];
  let endlevel = [{}];
  let enemyArray = [];
  /*21 by 14?*/
  var level = 1;

  function init(){
      level=1;
      player.rpos();
      enemyArray = [];
      hborders.splice(2,hborders.length-2);
      vborders.splice(2,vborders.length-2);
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
    hborders.splice(2,hborders.length-2);
    vborders.splice(2,vborders.length-2);
    if(typeof thislevel != "undefined"){
      goal.width = goal.height = 200;
      if("h" in thislevel){
        hborders.push.apply(hborders, levels[level-1].h);
      }
      if("v" in thislevel){
        vborders.push.apply(vborders, levels[level-1].v);
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
    } else {
      hborders.push.apply(hborders, endlevel.h);
      vborders.push.apply(vborders, endlevel.h);
      goal.width = goal.height = -1;
      alert("You Win!");
    }

    player.moveUp = player.moveDown = player.moveLeft = player.moveRight = false;
  }

  function enemy(instance){
    ctx.beginPath();
    ctx.arc(instance.x, instance.y, 50, 0, 2 * Math.PI,false);
    ctx.fillStyle = "red";
    ctx.lineWidth = 0;
    ctx.fill();
  }

  function updateEnemyPos(instance){
    let targetPlayerX = (player.size/2) + xIncrement;
    let targetPlayerY = (player.size/2) + yIncrement;
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
    circleDistance = {x:Math.abs(instance.x - player.x-(player.size/2)),y:Math.abs(instance.y - player.y-(player.size/2))};
    if (circleDistance.x > (player.size/2 + 50) || circleDistance.y > (player.size/2 + 50)){
      return false;
    }
    if (circleDistance.x <= (player.size/2) || circleDistance.y <= (player.size/2)) {
      return true;
    }
    cornerDistance_sq = Math.pow((circleDistance.x - player.size/2),2) + Math.pow((circleDistance.y - player.size/2),2);
    return (cornerDistance_sq <= Math.pow(50,2));
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

  var xIncrement = (canvas.width/2-player.size/2)+player.x;
  var yIncrement = (-3*canvas.height/2+3*player.size/2)+player.y;

  function checkBorders(){
    for(let i = 0; i < hborders.length; i++){
      if(player.x < hborders[i].x2+xIncrement && player.x+player.size > hborders[i].x1-xIncrement && player.y < hborders[i].y+yIncrement && player.y + player.size > hborders[i].y+ yIncrement){
        player.y = previousPlayerY;
      }
      if(player.y < hborders[i].y+ yIncrement && player.y+player.size > hborders[i].y- yIncrement && player.x < hborders[i].x2+xIncrement && player.x+player.size > hborders[i].x1-xIncrement){
        player.x = previousPlayerX;
      }
    }
    for(let i = 0; i < vborders.length; i++){
      if(player.x <= vborders[i].x+xIncrement && player.x+player.size > vborders[i].x-xIncrement && player.y < vborders[i].y2+ yIncrement && player.y + player.size > vborders[i].y1- yIncrement){
        player.x = previousPlayerX;
      }
      if(player.y < vborders[i].y2+ yIncrement && player.y+player.size > vborders[i].y1- yIncrement && vborders[i].x+xIncrement > player.x && vborders[i].x-xIncrement < player.x+player.size){
        player.y = previousPlayerY;
      }
    }
  }


  //Game Loop
  function loop(t){
    //Background
    rect(0, 0, canvas.width, canvas.height, "white");

    previousPlayerX = player.x;
    previousPlayerY = player.y;

    xIncrement = (canvas.width/2-player.size/2)+player.x;
    yIncrement = (-3*canvas.height/2+3*player.size/2)+player.y;

    let accuracy = 25;
    if(player.moveUp/* && !hasTB*/){
      for(j = 0; j < accuracy; j++){
        if(!player.moveLeft && !player.moveRight){
          player.y += player.speed/accuracy;
        } else{
          player.y += player.dSpeed/accuracy;
        }
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
        checkBorders();
        previousPlayerX = player.x;
      }
    }

    newPlayerDifferenceX = player.x-previousPlayerX;
    newPlayerDifferenceY = previousPlayerY-player.y;

    // let hasTB = false, hasBB = false, hasLB = false, hasRB=false;
    /*Render*/
    console.log("x increment: "+xIncrement+", y increment:"+yIncrement);
    console.log("x position: "+player.x+", y position:"+player.y);

    for(let i = 0; i < hborders.length; i++){
      if(hborders[i].render){
        ctx.beginPath();
        ctx.moveTo(hborders[i].x1+(xIncrement), hborders[i].y+(yIncrement));
        ctx.lineTo(hborders[i].x2+(xIncrement), hborders[i].y+(yIncrement));
        ctx.stroke();
      }
    }

    for(let i = 0; i < vborders.length; i++){
      if(vborders[i].render){
        ctx.beginPath();
        ctx.moveTo(vborders[i].x+(xIncrement), vborders[i].y1+(yIncrement));
        ctx.lineTo(vborders[i].x+(xIncrement), vborders[i].y2+(yIncrement));
        ctx.stroke();
      }
    }

    $("#score").text(level);

    //Goal
    rect(goal.x + xIncrement, goal.y + yIncrement, goal.width, goal.height, goal.color);

    //Player
    rect(canvas.width/2 - player.size/2, canvas.height/2- player.size/2, player.size, player.size, player.color);

    enemyArray.forEach(updateEnemyPos);
    enemyArray.forEach(enemy);
    enemyArray.forEach(function(instance){
      if(enemyIntersectPlayer(instance)){
        loadLevel();
      }
    });

    if(xIncrement <= goal.x + goal.width && xIncrement + player.size >= goal.x && yIncrement + player.size >= goal.y && yIncrement <= goal.y + goal.height){
      level++;
      loadLevel();
    }

    window.requestAnimationFrame(loop);
  }
  init();
  window.requestAnimationFrame(loop);
});
