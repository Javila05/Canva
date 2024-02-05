document.addEventListener('DOMContentLoaded', function () {
    var canvasContainer = document.getElementById('canvas-container');
    var canvas = document.getElementById('signature-pad');
    var ctx = canvas.getContext('2d');
    var clearButton = document.getElementById('clear-button');
    var colorInput = document.getElementById('color');
    var thicknessInput = document.getElementById('thickness');
    var rotateClockwiseButton = document.getElementById('rotate-clockwise');
    var rotateCounterclockwiseButton = document.getElementById('rotate-counterclockwise');

    var drawing = false;
    var lines = [];
    var currentLine = [];
    var rotationAngle = 0;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    //JCAavila
    //05-feb-2024
    //touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', draw);

    clearButton.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = [];
    });

    colorInput.addEventListener('input', function () {
        ctx.strokeStyle = colorInput.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
    });

    thicknessInput.addEventListener('input', function () {
        ctx.lineWidth = thicknessInput.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
    });

    rotateClockwiseButton.addEventListener('click', function () {
        rotateCanvas(canvas, ctx, 90);
    });

    rotateCounterclockwiseButton.addEventListener('click', function () {
        rotateCanvas(canvas, ctx, -90);
    });

    function startDrawing(e) {
        e.preventDefault();
        drawing = true;
        currentLine = [];
        currentLine.push(getPos(canvas, e));
    }

    function stopDrawing() {
        if (drawing) {
            lines.push(currentLine);
            drawing = false;
            currentLine = [];
        }
    }

    function draw(e) {
        e.preventDefault();
        if (!drawing) return;

        var currentPoint = getPos(canvas, e);
        currentLine.push(currentPoint);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redraw();

        ctx.beginPath();
        ctx.moveTo(currentLine[0].x, currentLine[0].y);

        for (var i = 1; i < currentLine.length; i++) {
            ctx.lineTo(currentLine[i].x, currentLine[i].y);
        }

        ctx.stroke();
        ctx.closePath();
    }

    function redraw() {
        lines.forEach(function (line) {
            if (line.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);

            for (var i = 1; i < line.length; i++) {
                ctx.lineTo(line[i].x, line[i].y);
            }

            ctx.stroke();
            ctx.closePath();
        });
    }

    function getPos(canvas, event) {
        //JCAavila
        //05-feb-2024
        //check if it is a touch event
        if (event.touches && event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        } else {
            //JCAavila
            //05-feb-2024
            //mouse event
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;

            return {
                x: (event.clientX - rect.left) * scaleX,
                y: (event.clientY - rect.top) * scaleY
            };
        }
    }

    function rotateCanvas(canvas, context, angle) {
        rotationAngle += angle;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((rotationAngle * Math.PI) / 180);
        context.translate(-canvas.width / 2, -canvas.height / 2);
        redraw();
        context.restore();
    }
});
