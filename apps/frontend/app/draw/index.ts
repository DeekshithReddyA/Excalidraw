type Shape = 
    { type: "rect", x: number, y: number, w: number, h: number } |
    { type: "ellipse", x: number, y: number, rx: number, ry: number } |
    { type: "arrow", x: number, y: number, endX: number, endY: number } |
    { type: "text", x: number, y: number, content: string };

export function Draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startX: number, startY: number;
    let isPanning: boolean = false;
    let isDrawing: boolean = false;
    let isTyping: boolean = false;
    let currentText: string = "";
    let textX: number = 0, textY: number = 0;
    let offsetX = 0, offsetY = 0;
    let lastOffsetX = 0, lastOffsetY = 0;
    let scale = 1;
    let scaleFactor = 1.1;
    let selectedShape: "rect" | "ellipse" | "arrow" | "text" = "rect"; // Add text option

    let prevShapes: Shape[] = [];

    function redrawCanvas() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // Apply zoom and translation
        ctx.translate(-offsetX, -offsetY);
        ctx.scale(scale, scale);

        // Redraw stored shapes
        ctx.strokeStyle = "black";
        prevShapes.forEach(shape => {
            if (shape.type === "rect") {
                ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
            } else if (shape.type === "ellipse") {
                ctx.beginPath();
                ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (shape.type === "arrow") {
                drawArrow(shape.x, shape.y, shape.endX, shape.endY);
            } else if (shape.type === "text") {
                ctx.font = "22px Virgil";
                ctx.fillText(shape.content, shape.x, shape.y);
            }
        });

        // Draw current text being typed
        if (isTyping) {
            ctx.font = "22px Virgil";
            ctx.fillText(currentText, textX, textY);
            
            // Draw blinking cursor
            const textWidth = ctx.measureText(currentText).width;
            const now = Date.now();
            if (Math.floor(now / 500) % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(textX + textWidth, textY - 16);
                ctx.lineTo(textX + textWidth, textY);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    function drawArrow(x: number, y: number, endX: number, endY: number) {
        const angle = Math.atan2(endY - y, endX - x);
        const arrowHeadLength = 10;
        if(!ctx) return
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        
        // Draw arrowhead
        ctx.lineTo(
            endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
            endY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
            endY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }

    canvas.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            return;
        }

        if (selectedShape === "text") {
            isTyping = true;
            textX = (e.clientX + offsetX) / scale;
            textY = (e.clientY + offsetY) / scale;
            currentText = "";
            redrawCanvas();
            return;
        }

        isDrawing = true;
        startX = (e.clientX + offsetX) / scale;
        startY = (e.clientY + offsetY) / scale;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isPanning) {
            offsetX = lastOffsetX - (e.clientX - startX);
            offsetY = lastOffsetY - (e.clientY - startY);
            redrawCanvas();
            return;
        }
        if (isDrawing) {
            const endX = (e.clientX + offsetX) / scale;
            const endY = (e.clientY + offsetY) / scale;
            redrawCanvas();
            ctx.save();
            ctx.translate(-offsetX, -offsetY);
            ctx.scale(scale, scale);

            if (selectedShape === "rect") {
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            } else if (selectedShape === "ellipse") {
                const rx = Math.abs(endX - startX) / 2;
                const ry = Math.abs(endY - startY) / 2;
                ctx.beginPath();
                ctx.ellipse(startX + rx, startY + ry, rx, ry, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (selectedShape === "arrow") {
                drawArrow(startX, startY, endX, endY);
            }

            ctx.restore();
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (isPanning) {
            isPanning = false;
            lastOffsetX = offsetX;
            lastOffsetY = offsetY;
            return;
        }
        if (isDrawing) {
            isDrawing = false;
            const endX = (e.clientX + offsetX) / scale;
            const endY = (e.clientY + offsetY) / scale;

            if (selectedShape === "rect") {
                prevShapes.push({ type: "rect", x: startX, y: startY, w: endX - startX, h: endY - startY });
            } else if (selectedShape === "ellipse") {
                const rx = Math.abs(endX - startX) / 2;
                const ry = Math.abs(endY - startY) / 2;
                prevShapes.push({ type: "ellipse", x: startX + rx, y: startY + ry, rx, ry });
            } else if (selectedShape === "arrow") {
                prevShapes.push({ type: "arrow", x: startX, y: startY, endX, endY });
            }
            redrawCanvas();
        }
    });

    // Handle keyboard input for text
    window.addEventListener("keydown", (e) => {
        if (!isTyping) return;

        if (e.key === "Enter") {
            // Save current text and end typing
            if (currentText.trim() !== "") {
                prevShapes.push({ type: "text", x: textX, y: textY, content: currentText });
            }
            isTyping = false;
            currentText = "";
            redrawCanvas();
            return;
        }

        if (e.key === "Escape") {
            // Cancel text input
            isTyping = false;
            currentText = "";
            redrawCanvas();
            return;
        }

        if (e.key === "Backspace") {
            // Remove last character
            currentText = currentText.slice(0, -1);
            redrawCanvas();
            return;
        }

        // Ignore modifier keys and function keys
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            currentText += e.key;
            redrawCanvas();
        }
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        const zoomFactor = e.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
        const mouseX = (e.clientX + offsetX) / scale;
        const mouseY = (e.clientY + offsetY) / scale;

        scale *= zoomFactor;
        offsetX = mouseX * scale - e.clientX;
        offsetY = mouseY * scale - e.clientY;

        redrawCanvas();
    });

    // Function to set the shape type
    function setShape(shape: "rect" | "ellipse" | "arrow" | "text") {
        selectedShape = shape;
        if (isTyping) {
            // Save current text if switching from text mode
            if (currentText.trim() !== "") {
                prevShapes.push({ type: "text", x: textX, y: textY, content: currentText });
            }
            isTyping = false;
            currentText = "";
            redrawCanvas();
        }
    }

    // Set cursor style based on selected tool
    function updateCursor() {
        if (selectedShape === "text") {
            canvas.style.cursor = "text";
        } else {
            canvas.style.cursor = "default";
        }
    }

    // Watch for shape changes to update cursor
    const originalSetShape = setShape;
    setShape = function(shape: "rect" | "ellipse" | "arrow" | "text") {
        originalSetShape(shape);
        updateCursor();
    };

    // Initialize cursor
    updateCursor();

    // Start initial redraw
    redrawCanvas();

    // Expose setShape method to allow shape selection from UI
    return { setShape };
}