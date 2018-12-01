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
  v:[{y1:800,y2:1000,x:800, render:true},{y1:800,y2:1000,x:1200, render:true},{y1:600+1,y2:800,x:600, render:true},{y1:600+1,y2:800,x:1000, render:true},{y1:600+1,y2:800-1,x:1400, render:true},{y1:400+1,y2:600-1,x:200, render:true},{y1:200+1,y2:600-1,x:400, render:true},{y1:400+1,y2:600-1,x:800, render:true},{y1:400+1,y2:600-1,x:1200, render:true},{y1:400+1,y2:600,x:1600, render:true},{y1:200+1,y2:400,x:600, render:true},{y1:200+1,y2:400-1,x:1000, render:true},{y1:0,y2:400-1,x:1400, render:true},{y1:0,y2:200,x:800, render:true}]},
  {h:[{x1:0,x2:400,y:800, render:true},{x1:600,x2:1000,y:800, render:true},{x1:1400,x2:1800,y:800, render:true},{x1:400,x2:800,y:600, render:true},{x1:1200,x2:1400,y:600, render:true},{x1:1800,x2:2000,y:600, render:true},{x1:0,x2:200,y:400,render:true},{x1:800,x2:1000,y:400,render:true},{x1:1200,x2:1800,y:400,render:true},{x1:200,x2:600,y:200,render:true},{x1:1000,x2:1200,y:200,render:true},{x1:1600,x2:2000,y:215,render:true}],
  v:[{y1:800,y2:1000,x:800, render:true},{y1:800,y2:1000,x:1200, render:true},{y1:600+1,y2:800,x:600, render:true},{y1:600+1,y2:800,x:1000, render:true},{y1:600+1,y2:800-1,x:1400, render:true},{y1:400+1,y2:600-1,x:200, render:true},{y1:200+1,y2:600-1,x:400, render:true},{y1:400+1,y2:600-1,x:800, render:true},{y1:400+1,y2:600-1,x:1200, render:true},{y1:400+1,y2:600,x:1600, render:true},{y1:200+1,y2:400,x:600, render:true},{y1:200+1,y2:400-1,x:1000, render:true},{y1:0,y2:400-1,x:1400, render:true},{y1:0,y2:200,x:800, render:true}]}];
  var level = 1;

  function init(){
      level=1;
      player.rpos();
      hborders.splice(2,hborders.length-2);
      vborders.splice(2,vborders.length-2);
      hborders.push.apply(hborders, levels[0].h);
      vborders.push.apply(vborders, levels[0].v);
  }
  console.log(levels[0].h);
  console.log(levels[1].h);

  function loadLevel(){
    player.rpos();
    hborders.splice(2,hborders.length-2);
    vborders.splice(2,vborders.length-2);
    hborders.push.apply(hborders, levels[level-1].h);
    vborders.push.apply(vborders, levels[level-1].v);
    if(level===2){
      var question = prompt("Question 1");
      if(question == "answer"){
        alert("Correct!");
      } else {
        alert("Sorry, Incorrect")
        loadLevel();
      }
    }
  }

  $(window).on("resize",function(){
    // $canvas.css("transform","scale("+$(window).width()/$canvas.width()+","+$(window).height()/$canvas.height()+")");
  }).trigger("resize");

  $("#next").click(function(){
    level++;
    loadLevel();
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
      case keys.upk:
        player.moveUp = true;
        break;
      case keys.down:
      case keys.downk:
        player.moveDown = true;
        break;
      case keys.left:
      case keys.leftk:
        player.moveLeft = true;
        break;
      case keys.right:
      case keys.rightk:
        player.moveRight = true;
        break;
    }
  });
  $(document).keyup(function(e){
    switch(e.which){
      case keys.up:
      case keys.upk:
        player.moveUp = false;
        break;
      case keys.down:
      case keys.downk:
        player.moveDown = false;
        break;
      case keys.left:
      case keys.leftk:
        player.moveLeft = false;
        break;
      case keys.right:
      case keys.rightk:
        player.moveRight = false;
        break;
    }
  });
  //Game Loop
  function loop(t){
    //Background
    rect(0, 0, canvas.width, canvas.height, "white");

    let hasTB = false, hasBB = false, hasLB = false, hasRB=false;
    for(let i = 0; i < hborders.length; i++){
      if(hborders[i].render){
        ctx.beginPath();
        ctx.moveTo(hborders[i].x1, hborders[i].y);
        ctx.lineTo(hborders[i].x2, hborders[i].y);
        ctx.stroke();
      }
      if(player.x < hborders[i].x2 && player.x+player.size > hborders[i].x1 && player.y <= hborders[i].y && player.y >= hborders[i].y - player.size/2 && player.moveUp){
        player.y=hborders[i].y;
        hasTB = true;
      }
      if(player.x < hborders[i].x2 && player.x+player.size > hborders[i].x1 && player.y + player.size >= hborders[i].y && player.y + player.size <= hborders[i].y + player.size/2 && player.moveDown){
        player.y=hborders[i].y-player.size;
        hasBB = true;
      }
      if(player.y < hborders[i].y && player.y+player.size > hborders[i].y && player.x <= hborders[i].x2 && player.x+hborders[i].x1 >= (hborders[i].x2-hborders[i].x1)/2 && player.moveLeft){
        player.x=hborders[i].x2;
        hasLB = true;
      }
      if(player.y < hborders[i].y && player.y+player.size > hborders[i].y && player.x+player.size >= hborders[i].x1 && player.x+player.size+hborders[i].x1 < (hborders[i].x2-hborders[i].x1)/2 && player.moveRight){
        player.x=hborders[i].x1-player.size;
        hasRB = true;
      }
    }
    for(let i = 0; i < vborders.length; i++){
      if(vborders[i].render){
        ctx.beginPath();
        ctx.moveTo(vborders[i].x, vborders[i].y1);
        ctx.lineTo(vborders[i].x, vborders[i].y2);
        ctx.stroke();
      }
      if(player.x <= vborders[i].x && player.x+player.size >= vborders[i].x && player.y <= vborders[i].y2 && player.y >= vborders[i].y1 - player.size && player.x >= vborders[i].x-player.size/2 && player.moveLeft){
        player.x=vborders[i].x;
        hasLB = true;
      }
      if(player.x <= vborders[i].x && player.x+player.size >= vborders[i].x && player.y <= vborders[i].y2 && player.y >= vborders[i].y1 - player.size && player.x <= vborders[i].x-player.size/2 && player.moveRight){
        player.x=vborders[i].x-player.size;
        hasRB = true;
      }
      if(player.y < vborders[i].y2 && player.y+player.size > vborders[i].y1 && vborders[i].x > player.x && vborders[i].x < player.x+player.size && player.y >= (vborders[i].y2-vborders[i].y1)/2 - player.size && player.moveUp){
        player.y=vborders[i].y2;
        hasTB = true;
      }
      if(player.y < vborders[i].y2 && player.y+player.size > vborders[i].y1 && vborders[i].x > player.x && vborders[i].x < player.x+player.size && player.y <= (vborders[i].y2-vborders[i].y1)/2 - player.size && player.moveDown){
        player.y=vborders[i].y1-player.size;
        hasBB = true;
      }


    }
    if(player.moveUp && !hasTB){
      if(!player.moveLeft && !player.moveRight){
        player.y -= player.speed;
      } else{
        player.y -= player.dSpeed;
      }
    }
    if(player.moveDown && !hasBB){
      if(!player.moveLeft && !player.moveRight){
        player.y += player.speed;
      } else{
        player.y += player.dSpeed;
      }
    }
    if(player.moveLeft && !hasLB){
      if(!player.moveUp && !player.moveDown){
        player.x -= player.speed;
      } else {
        player.x -= player.dSpeed;
      }
    }
    if(player.moveRight && !hasRB){
      if(!player.moveUp && !player.moveDown){
        player.x += player.speed;
      }
      else{
        player.x += player.dSpeed;
      }
    }

    /*Render*/
    if(player.x <= goal.x + goal.width && player.x + player.size >= goal.x && player.y + player.size >= goal.y && player.y <= goal.y + goal.height){
      level++;
      loadLevel();
    }

    $("#score").text(level);

    //Goal
    rect(goal.x, goal.y, goal.width, goal.height, goal.color);
    console.log(player.x+", "+player.y);
    //Player
    rect(player.x, player.y, player.size, player.size, player.color);



    window.requestAnimationFrame(loop);
  }
  init();
  window.requestAnimationFrame(loop);
});
