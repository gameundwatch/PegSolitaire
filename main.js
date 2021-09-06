/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"

// console.log("Hello 🌎");

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

var DISTANCE = 50;
canvas.width = 400;
canvas.height = 400;


// shadow
const resetShadow = () => {
    ctx.shadowColor = "255,255,255,0";
    ctx.shadowBlur  = 0;      
    ctx.shadowOffsetX = 0;    
    ctx.shadowOffsetY = 0;    
}

const pegShadow = () => {
    ctx.shadowColor = "#000000";
    ctx.shadowBlur  = 2;      
    ctx.shadowOffsetX = 0;    
    ctx.shadowOffsetY = 1;    
}

// Peg
const peg = {
  
  x: null,
  y: null,
  radius: 10,
  startAngle: 0,
  endAngle: Math.PI * 2,
  antiClockWise: 1,
  type: null,
  
  data: [],
  
  update: function(){
    this.data.forEach(pegs => {
      ctx.beginPath();
      ctx.arc(pegs.x, pegs.y, pegs.radius, pegs.startAngle, pegs.endAngle, pegs.antiClockWise);
      // type to color
      if(pegs.type === 1){
        ctx.fillStyle = "rgba(0,0,0,0)"; // clear color 
      }
      else if(pegs.type === 2){
        pegShadow();
        ctx.fillStyle = "#2EB67D";
      }
      else if(pegs.type === 3){
        resetShadow();
        ctx.fillStyle = "#FFA511";
      }
      else if(pegs.type === 4){
        pegShadow();
        ctx.fillStyle = "#FF6464";
      }
      ctx.fill();
    })
  }
}

// Hall
const hall = {
  x: null,
  y: null,
  radius: 15,
  startAngle: 0,
  endAngle: Math.PI * 2,
  antiClockWise: 1,
  
  data: [],
  
  update: function(){
    this.data.forEach(halls => {
    ctx.beginPath();
    resetShadow();  
    //var hallGradient = ctx.createRadialGradient(halls.x,halls.y,0,halls.x,halls.y,halls.radius);
    //hallGradient.addColorStop(0.0 , '#afa');
    //hallGradient.addColorStop(1.0 , '#000');
    ctx.arc(halls.x, halls.y, halls.radius, halls.startAngle, halls.endAngle, halls.antiClockWise);
    ctx.strokeStyle = "#111111";
    ctx.stroke();
    //ctx.fillStyle = "#000000";
    //ctx.fill;
    })
  }
}

// PegBoard
const board = [
  [0,0,2,2,2,0,0],
  [0,0,2,2,2,0,0],
  [2,2,2,2,2,2,2],
  [2,2,2,1,2,2,2],
  [2,2,2,2,2,2,2],
  [0,0,2,2,2,0,0],
  [0,0,2,2,2,0,0]
]

const choose = () => {}

const move = () => {}

const searchSelected = function(x,y) {
  if (0<=y && y<2) {
    return x-2 + 3*y;
  } else if (2<=y && y<5) {
    return x + 3*2 + 7*(y-2);
  } else if (5<=y && y<7) {
    return x-2 + 3*2 + 7*3 + 3*(y-5);
  }
}

const isIncluded = function(x,y){
  if ((x<0||y<0)||(x>=7||y>=7))
    return 0;
  else if ((x<2&&y<2)||(5<=x&&y<2)||(x<2&&5<=y)||(5<=x&&5<=y))
    return 0;
  else 
    return 1;
}

var PHASE = "SELECT";


// 4 direction search
// if they did not find the hall, return p

const topHall = function(p){
  if(p==0||p==1||p==2||p==6||p==7||p==11||p==12)
    return p;
  else if (3<=p&&p<6)
    return p-3;
  else if (8<=p&&p<11)
    return p-5;
  else if (13<=p&&p<27)
    return p-7;
  else if (27<=p&&p<30)
    return p-5;
  else if (30<=p&&p<33)
    return p-3;
  else 
    return p;
}

const bottomHall = function(p){
  if(p==20||p==21||p==30||p==31||p==32||p==25||p==26)
    return p;
  else if (0<=p&&p<3)
    return p+3;
  else if (3<=p&&p<6)
    return p+5;
  else if (6<=p&&p<20)
    return p+7;
  else if (22<=p&&p<25)
    return p+5;
  else if (27<=p&&p<30)
    return p+3;
  else 
    return p;
}

const leftHall = function(p){
  if(p==0||p==3||p==6||p==13||p==20||p==27||p==30)
    return p;
  else
    return p-1;
}

const rightHall = function(p){
  if(p==2||p==5||p==12||p==19||p==26||p==29||p==32)
    return p;
  else
    return p+1;
}

// Initial Setting
const init = () => {
  
  // Hall Placing
  for(let i=0; i<board.length; i++){
    for(let j=0; j<board[i].length; j++){
      if(board[i][j] > 0){
        hall.data.push({
          x: DISTANCE * j + (canvas.width/2) - DISTANCE* Math.floor(board[i].length/2),
          y: DISTANCE * i + (canvas.height/2) - DISTANCE* Math.floor(board.length/2),
          radius: hall.radius,
          startAngle: hall.startAngle,
          endAngle: hall.endAngle,
          antiClockWise: hall.antiClockWise
        })
      }
    }
  }
  
  // Peg Placing
  for(let i=0; i<board.length; i++){
    for(let j=0; j<board[i].length; j++){
      if(board[i][j] !== 0){
        peg.data.push({
          x: DISTANCE * j + canvas.width/2 - DISTANCE* Math.floor(board[i].length/2),
          y: DISTANCE * i + canvas.height/2 - DISTANCE* Math.floor(board.length/2),
          type: board[i][j],
          radius: peg.radius,
          startAngle: peg.startAngle,
          endAngle: peg.endAngle,
          antiClockWise: peg.antiClockWise
        })
      }
    }
  }
  
  PHASE = "SELECT";

};

// Main Loop
const loop = () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  hall.update();
  peg.update();
  
  window.requestAnimationFrame(loop);
};

init();
loop();


// choose function
document.addEventListener('click', e=> {
  
  var rect	= event.target.getBoundingClientRect();
  // point in Canvas
  
  var canvasX = e.clientX - Math.floor(rect.left);
  var canvasY = e.clientY - Math.floor(rect.top);
  
  // search peg
  var pegX = Math.floor( (canvasX - 20) / DISTANCE)
  var pegY = Math.floor( (canvasY - 20) / DISTANCE)
  
  var selected = searchSelected(pegX,pegY);
  
  if (isIncluded(pegX,pegY)){
      // choose peg ... type: 3 is chosen flag.
    peg.data.forEach((pegs,index)=>{
      
      if (peg.data[selected].type === 2 && PHASE === "SELECT"){
        //=======================
        // Selection Method
        //=======================
        peg.data.splice(selected,1,
          {
            x: DISTANCE * pegX + canvas.width/2 - DISTANCE* Math.floor(board[0].length/2),
            y: DISTANCE * pegY + canvas.height/2 - DISTANCE* Math.floor(board.length/2),
            type: 3,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        
        // top
        if (peg.data[topHall(selected)].type === 2 && peg.data[topHall(topHall(selected))].type === 1){
          peg.data.splice(topHall(topHall(selected)),1,
            {
              x: peg.data[topHall(topHall(selected))].x,
              y: peg.data[topHall(topHall(selected))].y,
              type: 4,
              radius: peg.radius,
              startAngle: peg.startAngle,
              endAngle: peg.endAngle,
              antiClockWise: peg.antiClockWise
            });
        }
        
        // bottom
        if (peg.data[bottomHall(selected)].type === 2 && peg.data[bottomHall(bottomHall(selected))].type === 1){
          peg.data.splice(bottomHall(bottomHall(selected)),1,
          {
            x: peg.data[bottomHall(bottomHall(selected))].x,
            y: peg.data[bottomHall(bottomHall(selected))].y,
            type: 4,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // left
        if (peg.data[leftHall(selected)].type === 2 && peg.data[leftHall(leftHall(selected))].type === 1)
        {
          peg.data.splice(leftHall(leftHall(selected)),1,
            {
              x: peg.data[leftHall(leftHall(selected))].x,
              y: peg.data[leftHall(leftHall(selected))].y,
              type: 4,
              radius: peg.radius,
              startAngle: peg.startAngle,
              endAngle: peg.endAngle,
              antiClockWise: peg.antiClockWise
            });
        }
        
        // right
        if (peg.data[rightHall(selected)].type === 2 && peg.data[rightHall(rightHall(selected))].type === 1)
        {
          peg.data.splice(rightHall(rightHall(selected)),1,
            {
              x: peg.data[rightHall(rightHall(selected))].x,
              y: peg.data[rightHall(rightHall(selected))].y,
              type: 4,
              radius: peg.radius,
              startAngle: peg.startAngle,
              endAngle: peg.endAngle,
              antiClockWise: peg.antiClockWise
            });
        }
        
        PHASE = "MOVE";
        // Selection Method End
        
      } 
      
      else if (peg.data[selected].type === 3 && PHASE === "MOVE"){
        //=======================
        // De-Selection Method
        //=======================
        peg.data.splice(selected,1,
        {
          x: DISTANCE * pegX + canvas.width/2 - DISTANCE* Math.floor(board[0].length/2),
          y: DISTANCE * pegY + canvas.height/2 - DISTANCE* Math.floor(board.length/2),
          type: 2,
          radius: peg.radius,
          startAngle: peg.startAngle,
          endAngle: peg.endAngle,
          antiClockWise: peg.antiClockWise
        });
        
        // deactivate
        // top 
        if(peg.data[topHall(topHall(selected))].type === 4){
          peg.data.splice(topHall(topHall(selected)),1,
          {
            x: peg.data[topHall(topHall(selected))].x,
            y: peg.data[topHall(topHall(selected))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // bottom 
        if(peg.data[bottomHall(bottomHall(selected))].type === 4){
          peg.data.splice(bottomHall(bottomHall(selected)),1,
          {
            x: peg.data[bottomHall(bottomHall(selected))].x,
            y: peg.data[bottomHall(bottomHall(selected))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // left
        if(peg.data[leftHall(leftHall(selected))].type === 4){
          peg.data.splice(leftHall(leftHall(selected)),1,
          {
            x: peg.data[leftHall(leftHall(selected))].x,
            y: peg.data[leftHall(leftHall(selected))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // right
        if(peg.data[rightHall(rightHall(selected))].type === 4){
          peg.data.splice(rightHall(rightHall(selected)),1,
          {
            x: peg.data[rightHall(rightHall(selected))].x,
            y: peg.data[rightHall(rightHall(selected))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }  
        
        PHASE = "SELECT";
        // De-Selection Method End
        
      }
      else if (peg.data[selected].type === 4 && PHASE === "MOVE"){
        //=======================
        // Move Method
        //======================= 
        
        // 4 Delection Search
        // if type: 3 => changed type: 1 (erase)
        // skipped peg => type: 1 (erase)
        
        // moning source
        let source = null
        
        // top 
        if(peg.data[topHall(topHall(selected))].type === 3){
          
          // set moving source
          source = topHall(topHall(selected));
          
          // move peg
          peg.data.splice(source,1,
          {
            x: peg.data[source].x,
            y: peg.data[source].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
          // erase skipped peg
          peg.data.splice(topHall(selected),1,
          {
            x: peg.data[topHall(selected)].x,
            y: peg.data[topHall(selected)].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
        }
        
        // bottom 
        if(peg.data[bottomHall(bottomHall(selected))].type === 3){
          
          // set moving source
          source = bottomHall(bottomHall(selected));
          
          // move peg
          peg.data.splice(source,1,
          {
            x: peg.data[source].x,
            y: peg.data[source].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
          // erase skipped peg
          peg.data.splice(bottomHall(selected),1,
          {
            x: peg.data[bottomHall(selected)].x,
            y: peg.data[bottomHall(selected)].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
        }
        
        // left
        if(peg.data[leftHall(leftHall(selected))].type === 3){
          
          // set moving source
          source = leftHall(leftHall(selected));
          
          // move peg
          peg.data.splice(source,1,
          {
            x: peg.data[source].x,
            y: peg.data[source].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
          // erase skipped peg
          peg.data.splice(leftHall(selected),1,
          {
            x: peg.data[leftHall(selected)].x,
            y: peg.data[leftHall(selected)].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
        }
        
        // right
        if(peg.data[rightHall(rightHall(selected))].type === 3){
          
          // set moving source
          source = rightHall(rightHall(selected));
          
          // move peg
          peg.data.splice(source,1,
          {
            x: peg.data[source].x,
            y: peg.data[source].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
          // erase skipped peg
          peg.data.splice(rightHall(selected),1,
          {
            x: peg.data[rightHall(selected)].x,
            y: peg.data[rightHall(selected)].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
          
        }  

        // erase moved peg
        
        peg.data.splice(selected,1,
        {
          x: DISTANCE * pegX + canvas.width/2 - DISTANCE* Math.floor(board[0].length/2),
          y: DISTANCE * pegY + canvas.height/2 - DISTANCE* Math.floor(board.length/2),
          type: 2,
          radius: peg.radius,
          startAngle: peg.startAngle,
          endAngle: peg.endAngle,
          antiClockWise: peg.antiClockWise
        });
        
        // erase move range
        // top 
        if(peg.data[topHall(topHall(source))].type === 4){
          peg.data.splice(topHall(topHall(source)),1,
          {
            x: peg.data[topHall(topHall(source))].x,
            y: peg.data[topHall(topHall(source))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // bottom 
        if(peg.data[bottomHall(bottomHall(source))].type === 4){
          peg.data.splice(bottomHall(bottomHall(source)),1,
          {
            x: peg.data[bottomHall(bottomHall(source))].x,
            y: peg.data[bottomHall(bottomHall(source))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // left
        if(peg.data[leftHall(leftHall(source))].type === 4){
          peg.data.splice(leftHall(leftHall(source)),1,
          {
            x: peg.data[leftHall(leftHall(source))].x,
            y: peg.data[leftHall(leftHall(source))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }
        
        // right
        if(peg.data[rightHall(rightHall(source))].type === 4){
          peg.data.splice(rightHall(rightHall(source)),1,
          {
            x: peg.data[rightHall(rightHall(source))].x,
            y: peg.data[rightHall(rightHall(source))].y,
            type: 1,
            radius: peg.radius,
            startAngle: peg.startAngle,
            endAngle: peg.endAngle,
            antiClockWise: peg.antiClockWise
          });
        }  
        
        PHASE = "SELECT";
        // Move Method End
        
      }
    })
  }
  
  // console.log(selected);
  // console.log(PHASE);
  // console.log(board);
  // console.log(peg.data);
  
})

canvas.setAttribute('style', 'display:block;margin:auto;background-color: #afa');

var game_element = document.getElementById('Game');
game_element.after(canvas);