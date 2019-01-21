$(function(){
  let $canvas = $("canvas");
  let canvas = $canvas[0]
  let ctx = canvas.getContext('2d');

  let keys = {up: 87, down: 83, left: 65, right: 68, upk: 38, downk: 40, leftk: 37, rightk:39};
  let player = {x: 0, y: 0, rpos: function(){this.x = 0; this.y = canvas.height-this.size; return this}, size:100, color:"black", speed: 20, get dSpeed(){return player.speed*(Math.sqrt(0.5));}, moveUp: false, moveDown: false, moveLeft: false, moveRight: false};
  let goal = {get x(){return canvas.width-goal.width}, get y(){return 0}, width: 200, height:200, color:"#2F2"}
  let hborders = [{x1:0,x2:canvas.width,y:0, render:false},{x1:0,x2:canvas.width,y:canvas.height, render:false}];
  let vborders = [{y1:0,y2:canvas.height,x:0, render:false},{y1:0,y2:canvas.height,x:canvas.width, render:false}];
  let levels = [
{h:[{x1:0,x2:1800,y:800, render:true},{x1:0,x2:600,y:600, render:true},{x1:800,x2:1600,y:600, render:true},{x1:1800,x2:2000,y:400, render:true},{x1:200,x2:2000,y:400, render:true},{x1:200,x2:2000,y:200, render:true}],
v:[{y1:600+1,y2:800-1,x:800, render:true},{y1:200, y2:600, x:1800, render:true}]},
{h:[{x1:0,x2:400,y:800, render:true},{x1:600,x2:1000,y:800, render:true},{x1:1400,x2:1800,y:800, render:true},{x1:400,x2:800,y:600, render:true},{x1:1200,x2:1400,y:600, render:true},{x1:1800,x2:2000,y:600, render:true},{x1:0,x2:200,y:400,render:true},{x1:800,x2:1000,y:400,render:true},{x1:1200,x2:1800,y:400,render:true},{x1:200,x2:600,y:200,render:true},{x1:1000,x2:1200,y:200,render:true},{x1:1600,x2:2000,y:215,render:true}],
v:[{y1:800,y2:1000,x:800, render:true},{y1:800,y2:1000,x:1200, render:true},{y1:600+1,y2:800,x:600, render:true},{y1:600+1,y2:800,x:1000, render:true},{y1:600+1,y2:800-1,x:1400, render:true},{y1:400+1,y2:600-1,x:200, render:true},{y1:200+1,y2:600-1,x:400, render:true},{y1:400+1,y2:600-1,x:800, render:true},{y1:400+1,y2:600-1,x:1200, render:true},{y1:400+1,y2:600,x:1600, render:true},{y1:200+1,y2:400,x:600, render:true},{y1:200+1,y2:400-1,x:1000, render:true},{y1:0,y2:400-1,x:1400, render:true},{y1:0,y2:200,x:800, render:true}],
question: "Question #1", answer:"answer",enemies:[{x:canvas.width,y:0},{x:canvas.width,y:canvas.height}]}];
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
      if("question" in thislevel && "answer" in thislevel ){
        triviaguess = prompt(thislevel.question);
        while(triviaguess!==thislevel.answer){
          alert("Sorry, incorrect!");
          triviaguess = prompt(thislevel.question);
        }
        alert("Correct!")
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
    let targetPlayerX = player.x + (player.size/2);
    let targetPlayerY = player.y + (player.size/2);
    let xFromPlayer = targetPlayerX-instance.x;
    let yFromPlayer = targetPlayerY-instance.y;
    let yxRatio = yFromPlayer/xFromPlayer;
    let xyRatio = xFromPlayer/yFromPlayer;
    let distanceFromPlayer = Math.sqrt(Math.pow(xFromPlayer,2)*Math.pow(yFromPlayer,2));
    let speed = 5;
    let possibleXValues = [(-yxRatio+Math.sqrt(Math.pow(yxRatio,2)+(4*speed)))/2,(-yxRatio-Math.sqrt(Math.pow(yxRatio,2)+(4*speed)))/2];
    if(xFromPlayer === 0 || isNaN(yxRatio) || isNaN(possibleXValues[0]) || isNaN(possibleXValues[1])){
      possibleXValues = [0,0];
      yxRatio = 0;
    }
    let possibleYValues = [possibleXValues[0]*yxRatio,possibleXValues[1]*yxRatio];
    // let possibleYValues = [(-xyRatio+Math.sqrt(Math.pow(xyRatio,2)+(4*speed)))/2,(-xyRatio-Math.sqrt(Math.pow(xyRatio,2)+(4*speed)))/2];
    console.log("x position: "+instance.x+" xChange: "+ possibleXValues);
    console.log("y position: "+instance.y+" yChange: "+ possibleYValues);

    let oldx = instance.x;
    let oldy = instance.y;

    if(distanceFromPlayer >= 5){
      if(xFromPlayer >= 0){
          instance.x += possibleXValues[0];
          instance.y += possibleYValues[0];
      } else {
          instance.x += possibleXValues[1];
          instance.y += possibleYValues[1];
      }
    } else{
      instance.x = player.x;
      instance.y = player.y;
    }



    // instance.y += possibleYValues[0];

    console.log("Distance: "+Math.sqrt(Math.pow(instance.x-oldx,2)+Math.pow(instance.y-oldy,2)));
    console.log("enemy array: "+JSON.stringify(thislevel.enemies[0])+","+JSON.stringify(thislevel.enemies[1]));

  }

  $(window).on("resize",function(){
    // $canvas.css("transform","scale("+$(window).width()/$canvas.width()+","+$(window).height()/$canvas.height()+")");
  }).trigger("resize");

  $("#next").click(function(){
    level++;
    loadLevel();
  });
  $("#prev").click(function(){
    level--;
    loadLevel();
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

  function checkBorders(){
    for(let i = 0; i < hborders.length; i++){
      if(player.x < hborders[i].x2 && player.x+player.size > hborders[i].x1 && player.y < hborders[i].y && player.y + player.size > hborders[i].y){
        player.y = previousPlayerY;
      }
      if(player.y < hborders[i].y && player.y+player.size > hborders[i].y && player.x < hborders[i].x2 && player.x+player.size > hborders[i].x1){
        player.x = previousPlayerX;
      }
    }
    for(let i = 0; i < vborders.length; i++){
      if(player.x <= vborders[i].x && player.x+player.size > vborders[i].x && player.y < vborders[i].y2 && player.y + player.size > vborders[i].y1){
        player.x = previousPlayerX;
      }
      if(player.y < vborders[i].y2 && player.y+player.size > vborders[i].y1 && vborders[i].x > player.x && vborders[i].x < player.x+player.size){
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
    let accuracy = 25;
    if(player.moveUp/* && !hasTB*/){
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
    if(player.moveDown/* && !hasBB*/){
      for(j = 0; j < accuracy; j++){
        console.log("previous player y: " + previousPlayerY);
        if(!player.moveLeft && !player.moveRight){
          player.y += player.speed/accuracy;
        } else{
          player.y += player.dSpeed/accuracy;
        }
        checkBorders();
        console.log("previous player y should be same: " + previousPlayerY);
        previousPlayerY = player.y;
      }
    }
    if(player.moveLeft/* && !hasLB*/){
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
    if(player.moveRight/* && !hasRB*/){
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

    // let hasTB = false, hasBB = false, hasLB = false, hasRB=false;
    /*Render*/

    for(let i = 0; i < hborders.length; i++){
      if(hborders[i].render){
        rect(hborders[i].x1,hborders[i].y,(hborders[i].x2-hborders[i].x1),2,"black");
      }
    }

    for(let i = 0; i < vborders.length; i++){
      if(vborders[i].render){
        rect(vborders[i].x,vborders[i].y1,2,(vborders[i].y2-vborders[i].y1),"black");
      }
    }

    $("#score").text(level);

    //Goal
    rect(goal.x, goal.y, goal.width, goal.height, goal.color);

    //Player
    rect(player.x, player.y, player.size, player.size, player.color);

    enemyArray.forEach(updateEnemyPos);
    enemyArray.forEach(enemy);

    if(player.x <= goal.x + goal.width && player.x + player.size >= goal.x && player.y + player.size >= goal.y && player.y <= goal.y + goal.height){
      level++;
      loadLevel();
    }

    window.requestAnimationFrame(loop);
  }
  init();
  window.requestAnimationFrame(loop);
});
