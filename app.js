var board,
    canvas,
    context,
    dragging = false,
    lastEvent,
    dragStartLocation,
    snapshot;


canvas = document.getElementById('paint')
board = document.querySelector('.board')

function init() {
  var lineWidth = document.querySelector('#lineWidth');
  var strokeColor = document.querySelector('#color');
  var canvasColor = document.getElementById('bgColor')
  console.log(canvasColor)

  context = canvas.getContext('2d');
  context.lineWidth = lineWidth.value
  context.strokeColor = strokeColor.value

  canvas.addEventListener('mousedown', dragStart);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('mouseup', dragStop);
  document.getElementById('clear').addEventListener('click', clearCanvas);
  canvas.addEventListener('mouseleave', () => dragging = false);
  canvas.addEventListener('mouseenter', () => {
    removeHandle();
    restoreSnapShot();
  });
  lineWidth.addEventListener('input', changeLineWidth);
  strokeColor.addEventListener('input', changeStrokeStyleColor);
  canvasColor.addEventListener('input', changeBackgroundColor);
}

function changeLineWidth() {
  let valueSize = document.getElementById('valueSize')
  context.lineWidth = this.value;
  valueSize.innerHTML = '<small>Size <small>' + this.value
}

function changeStrokeStyleColor() {
  // console.log(this.value)
  context.strokeStyle = this.value;
}

function changeBackgroundColor() {
  // console.log(this.value)
  canvas.style.backgroundColor = this.value;
}

function resize() {
  // let boardWidth = window.getComputedStyle(board, null).getPropertyValue("width");
  // let boardHeight = window.getComputedStyle(board, null).getPropertyValue("height");

  // canvas.width = boardWidth.replace('px', '');
  // canvas.height = boardHeight.replace('px', '');
  // canvas.width = innerWidth;
  // canvas.height = innerHeight / 1.5;
  // context.save()
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // takeSnapShot();

}

function takeSnapShot() {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapShot() {
  context.putImageData(snapshot, 0, 0);
}

function canvasPosition(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;

  return {
    x: x,
    y: y
  };
}

function crayon(position) {
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
  context.lineTo(position.x, position.y);
  context.lineCap = 'round';
  context.stroke();
  dragStartLocation = position
}

function drawLine(position) {
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
  context.lineTo(position.x, position.y);
  context.stroke();
}

function drawCircle(position) {
  var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
  context.beginPath();
  context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI);
  context.stroke();
}

function drawRect(position) {
  var w = position.x - dragStartLocation.x;
  var h = position.y - dragStartLocation.y;
  context.beginPath();
  context.rect(dragStartLocation.x, dragStartLocation.y, w, h);
  context.stroke()
}

function draw(position) {
  let shape,
    fill,
    fillColor;

  fillColor = document.getElementById('color').value

  shape = document.querySelector('.options').value
  fill = document.getElementById('fillBox').checked


  if (fill) {
    context.fillStyle = fillColor
    context.fill();
  }


  if (shape === 'crayon') {
    crayon(position)
    takeSnapShot();
  } else if (shape === 'circle') {
    drawCircle(position)
  } else if (shape === 'rectangle') {
    drawRect(position)
  } else if (shape === 'line') {
    drawLine(position);
  }

}

function dragStart(event) {
  dragging = true;
  dragStartLocation = canvasPosition(event);
  takeSnapShot();
  canvas.addEventListener('mouseup', dragStop);
}

function drag(event) {
  lastEvent = event;
  var position;
  if (dragging === true) {
    restoreSnapShot();
    position = canvasPosition(event);
    draw(position);
  }
}

function dragStop(event) {
  var position;
  dragging = false;
  restoreSnapShot();
  position = canvasPosition(event);
  draw(position);
}

function removeHandle() {
  canvas.removeEventListener('mouseup', dragStop);
  takeSnapShot();
}

function clearCanvas(e) {
  if (confirm('Etes-vous sûr de tout supprimer ?') === true) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

document.getElementById('file').addEventListener('change', function (e) {
  clearCanvas();
  var temp = URL.createObjectURL(e.target.files[0]);
  var image = new Image();
  image.src = temp;

  image.addEventListener('load', function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(temp);
  });
});


window.addEventListener('resize', resize);
window.addEventListener('load', resize);
window.addEventListener('load', init);