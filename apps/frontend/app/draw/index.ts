import { Shape } from "@/types/Shape";

export type FreehandShape = {
  type: "freehand";
  points: { x: number; y: number }[];
}


export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private shapeHistory: Shape[][] = [];
  private currentHistoryIndex: number = -1;
  private prevShapes: Shape[] = [];
  
  private strokeColor: "black" | "white" = "black";
  private startX: number = 0;
  private startY: number = 0;
  private pan: boolean = false;
  private isPanning: boolean = false;
  private isDrawing: boolean = false;
  private isTyping: boolean = false;
  private isMovingShape: boolean = false;
  private selectedShapeIndex: number = -1;
  private shapeOffsetX: number = 0;
  private shapeOffsetY: number = 0;
  private currentText: string = "";
  private textX: number = 0;
  private textY: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private lastOffsetX: number = 0;
  private lastOffsetY: number = 0;
  private scale: number = 1;
  private readonly scaleFactor: number = 1.1;
  private selectedShape: "rect" | "ellipse" | "arrow" | "text" | "" | "freehand" = "rect";
  private currentFreehandPath: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, prevShape: Shape[] = []) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.prevShapes = prevShape;
    if(this.ctx !== null) this.ctx.lineWidth = 2;
    
    this.initEventListeners();
    this.updateCursor();
    this.redrawCanvas();

    // Initialize history with initial state
    this.saveToHistory();
  }
  private saveToHistory(): void {
  // Deep clone the current shapes
  const currentShapesCopy = this.prevShapes.map(shape => ({ ...shape }));
  
  // If we're not at the end of history, trim future states
  if (this.currentHistoryIndex < this.shapeHistory.length - 1) {
    this.shapeHistory = this.shapeHistory.slice(0, this.currentHistoryIndex + 1);
  }

  // Add to history
  this.shapeHistory.push(currentShapesCopy);
  this.currentHistoryIndex++;
}

public undo(): void {
  if (this.currentHistoryIndex > 0) {
    this.currentHistoryIndex--;
    
    // Retrieve the previous state and create a new array with spread operator
    this.prevShapes = [...this.shapeHistory[this.currentHistoryIndex]];
    
    this.redrawCanvas();
    
    // Dispatch event to notify of shape changes
    const event = new CustomEvent('shapechange');
    window.dispatchEvent(event);
  }
}

public redo(): void {
  if (this.currentHistoryIndex < this.shapeHistory.length - 1) {
    this.currentHistoryIndex++;
    
    // Retrieve the next state and create a new array with spread operator
    this.prevShapes = [...this.shapeHistory[this.currentHistoryIndex]];
    
    this.redrawCanvas();
    
    // Dispatch event to notify of shape changes
    const event = new CustomEvent('shapechange');
    window.dispatchEvent(event);
  }
}

private dispatchShapeChangeEvent(): void {
  // Dispatch a custom event that shapes have changed
  const event = new CustomEvent('shapechange');
  window.dispatchEvent(event);

  // Always save to history when shapes change
  this.saveToHistory();
}
  public setStrokeColor(theme: "dark" | "light"): void {
    theme === "dark" ? this.strokeColor = "white" : this.strokeColor = "black";
    this.redrawCanvas();
  }

    // Update redrawCanvas method to handle freehand drawing
  private redrawCanvas(): void {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    // Apply zoom and translation
    this.ctx.translate(-this.offsetX, -this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    // Redraw stored shapes
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.fillStyle = this.strokeColor;
    this.prevShapes.forEach((shape: Shape) => {
      if (shape.type === "rect") {
        this.ctx!.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === "ellipse") {
        this.ctx!.beginPath();
        this.ctx!.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
        this.ctx!.stroke();
      } else if (shape.type === "arrow") {
        this.drawArrow(shape.x, shape.y, shape.endX, shape.endY);
      } else if (shape.type === "text") {
        this.ctx!.font = "31px Virgil";
        this.ctx!.fillText(shape.content, shape.x, shape.y);
      } else if (shape.type === "freehand") {
        this.drawFreehandPath(shape.points);
      }
    });

    // Draw current text being typed
    if (this.isTyping) {
      this.ctx.font = "31px Virgil";
      this.ctx.fillText(this.currentText, this.textX, this.textY);
      
      // Draw blinking cursor
      const textWidth = this.ctx.measureText(this.currentText).width;
      const now = Date.now();
      if (Math.floor(now / 500) % 2 === 0) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.moveTo(this.textX + textWidth, this.textY - 20);
        this.ctx.lineTo(this.textX + textWidth, this.textY);
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
    if(this.prevShapes.length !== 0)
      localStorage.setItem('prevShapes', JSON.stringify(this.prevShapes));
  }

  private drawFreehandPath(points: { x: number; y: number }[]): void {
    if (!this.ctx || points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    
    this.ctx.stroke();
  }

  private drawArrow(x: number, y: number, endX: number, endY: number): void {
    if (!this.ctx) return;
    
    const angle = Math.atan2(endY - y, endX - x);
    const arrowHeadLength = 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    
    // Draw arrowhead
    this.ctx.lineTo(
      endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
      endY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
      endY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }
   private findShapeAtPoint(x: number, y: number): number {
    for (let i = this.prevShapes.length - 1; i >= 0; i--) {
      const shape = this.prevShapes[i];
      
      // Different hit detection for different shape types
      switch (shape.type) {
        case "rect":
          if (x >= shape.x && x <= shape.x + shape.w && 
              y >= shape.y && y <= shape.y + shape.h) {
            return i;
          }
          break;
        
        case "ellipse":
          const dx = x - shape.x;
          const dy = y - shape.y;
          const dist = Math.sqrt(dx * dx / (shape.rx * shape.rx) + dy * dy / (shape.ry * shape.ry));
          if (dist <= 1) {
            return i;
          }
          break;
        
        case "arrow":
          // Simplified hit detection for arrow (closest point on line)
          const lineLength = Math.hypot(shape.endX - shape.x, shape.endY - shape.y);
          const distance = this.pointToLineDistance(x, y, shape.x, shape.y, shape.endX, shape.endY);
          if (distance < 5 && this.isPointOnSegment(x, y, shape.x, shape.y, shape.endX, shape.endY)) {
            return i;
          }
          break;
        
        case "text":
          if (this.ctx) {
            this.ctx.font = "31px Virgil";
            const metrics = this.ctx.measureText(shape.content);
            if (x >= shape.x && x <= shape.x + metrics.width && 
                y >= shape.y - 31 && y <= shape.y) {
              return i;
            }
          }
          break;
        
        case "freehand":
          // More advanced hit detection for freehand
          const bounds = this.getFreehandBounds(shape.points);
          
          // Quick bounding box check first
          if (x < bounds.minX || x > bounds.maxX || 
              y < bounds.minY || y > bounds.maxY) {
            break;
          }

          // Check if point is close to any line segment in the path
          for (let j = 1; j < shape.points.length; j++) {
            const prev = shape.points[j-1];
            const curr = shape.points[j];
            
            const distance = this.pointToLineDistance(x, y, prev.x, prev.y, curr.x, curr.y);
            
            if (distance < -1 && this.isPointOnSegment(x, y, prev.x, prev.y, curr.x, curr.y)) {
              return i;
            }
          }
          break;
      }
    }
    return -1;
  }

  // Helper methods for precise arrow hit detection
  private pointToLineDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private isPointOnSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number): boolean {
    const epsilon = 0.01; // Small threshold for floating-point comparisons
    const distToP1 = Math.hypot(x - x1, y - y1);
    const distToP2 = Math.hypot(x - x2, y - y2);
    const segmentLength = Math.hypot(x2 - x1, y2 - y1);
    return Math.abs(distToP1 + distToP2 - segmentLength) < epsilon;
  }
private handleMouseDown = (e: MouseEvent): void => {
    const canvasX = (e.clientX + this.offsetX) / this.scale;
    const canvasY = (e.clientY + this.offsetY) / this.scale;

    if (this.pan) {
      this.isPanning = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      return;
    }

    // Try to find a shape to move
    const shapeIndex = this.findShapeAtPoint(canvasX, canvasY);
    
    if (shapeIndex !== -1) {
      // If a shape is found, prepare for moving
      this.selectedShapeIndex = shapeIndex;
      this.isMovingShape = true;
      const shape = this.prevShapes[shapeIndex];
      
      // Calculate offset from shape's origin
      switch (shape.type) {
        case "rect":
          this.shapeOffsetX = canvasX - shape.x;
          this.shapeOffsetY = canvasY - shape.y;
          break;
        case "ellipse":
          this.shapeOffsetX = canvasX - shape.x;
          this.shapeOffsetY = canvasY - shape.y;
          break;
        case "arrow":
          // For arrow, check which end is closer
          const startDist = Math.hypot(canvasX - shape.x, canvasY - shape.y);
          const endDist = Math.hypot(canvasX - shape.endX, canvasY - shape.endY);
          if (startDist < endDist) {
            this.shapeOffsetX = canvasX - shape.x;
            this.shapeOffsetY = canvasY - shape.y;
          } else {
            this.shapeOffsetX = canvasX - shape.endX;
            this.shapeOffsetY = canvasY - shape.endY;
          }
          break;
        case "text":
          this.shapeOffsetX = canvasX - shape.x;
          this.shapeOffsetY = canvasY - shape.y;
          break;
        case "freehand":
          // For freehand, find the bounding box
          const bounds = this.getFreehandBounds(shape.points);
          this.shapeOffsetX = canvasX - bounds.minX;
          this.shapeOffsetY = canvasY - bounds.minY;
          break;
      }
      
      // Change cursor to indicate moving
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    if (this.selectedShape === "text") {
      this.isTyping = true;
      this.textX = canvasX;
      this.textY = canvasY;
      this.currentText = "";
      this.redrawCanvas();
      return;
    }

    if (this.selectedShape === "freehand") {
      this.isDrawing = true;
      this.currentFreehandPath = [{ x: canvasX, y: canvasY }];
      return;
    }

    this.isDrawing = true;
    this.startX = canvasX;
    this.startY = canvasY;
  }

  // Update handleMouseMove to handle freehand drawing and moving
  private handleMouseMove = (e: MouseEvent): void => {
    const canvasX = (e.clientX + this.offsetX) / this.scale;
    const canvasY = (e.clientY + this.offsetY) / this.scale;

    // Update cursor to indicate if a shape can be moved
    if (!this.isMovingShape && !this.pan && !this.isDrawing) {
      const shapeIndex = this.findShapeAtPoint(canvasX, canvasY);
      this.canvas.style.cursor = shapeIndex !== -1 ? 'grab' : 'default';
    }

    if (this.isPanning) {
      this.offsetX = this.lastOffsetX - (e.clientX - this.startX);
      this.offsetY = this.lastOffsetY - (e.clientY - this.startY);
      this.redrawCanvas();
      return;
    }

    if (this.isMovingShape && this.selectedShapeIndex !== -1) {
      const shape = this.prevShapes[this.selectedShapeIndex];
      
      switch (shape.type) {
        case "rect":
          shape.x = canvasX - this.shapeOffsetX;
          shape.y = canvasY - this.shapeOffsetY;
          break;
        case "ellipse":
          shape.x = canvasX - this.shapeOffsetX;
          shape.y = canvasY - this.shapeOffsetY;
          break;
        case "arrow": {
          // Move the entire arrow by the same delta
          const deltaX = canvasX - this.shapeOffsetX - shape.x;
          const deltaY = canvasY - this.shapeOffsetY - shape.y;
          shape.x += deltaX;
          shape.y += deltaY;
          shape.endX += deltaX;
          shape.endY += deltaY;
          break;
        }
        case "text":
          shape.x = canvasX - this.shapeOffsetX;
          shape.y = canvasY - this.shapeOffsetY;
          break;
        case "freehand":
          // Move the entire freehand path
          const bounds = this.getFreehandBounds(shape.points);
          const deltaX = canvasX - this.shapeOffsetX - bounds.minX;
          const deltaY = canvasY - this.shapeOffsetY - bounds.minY;
          
          shape.points = shape.points.map(point => ({
            x: point.x + deltaX,
            y: point.y + deltaY
          }));
          break;
      }
      
      this.redrawCanvas();
      return;
    }
    
    // Freehand drawing
    if (this.isDrawing && this.selectedShape === "freehand") {
      this.currentFreehandPath.push({ x: canvasX, y: canvasY });
      this.redrawCanvas();
      
      if (!this.ctx) return;
      
      this.ctx.save();
      this.ctx.translate(-this.offsetX, -this.offsetY);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.strokeStyle = this.strokeColor;
      
      this.drawFreehandPath(this.currentFreehandPath);
      
      this.ctx.restore();
      return;
    }

    // Rest of the existing drawing logic remains the same
    if (this.isDrawing) {
      const endX = canvasX;
      const endY = canvasY;
      this.redrawCanvas();
      
      if (!this.ctx) return;
      
      this.ctx.save();
      this.ctx.translate(-this.offsetX, -this.offsetY);
      this.ctx.scale(this.scale, this.scale);

      if (this.selectedShape === "rect") {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.strokeRect(this.startX, this.startY, endX - this.startX, endY - this.startY);
      } else if (this.selectedShape === "ellipse") {
        const centerX = (this.startX + endX) / 2;
        const centerY = (this.startY + endY) / 2;
        const rx = Math.abs(endX - this.startX) / 2;
        const ry = Math.abs(endY - this.startY) / 2;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (this.selectedShape === "arrow") {
        this.ctx.strokeStyle = this.strokeColor;
        this.drawArrow(this.startX, this.startY, endX, endY);
      }

      this.ctx.restore();
    }
  }

  // Update handleMouseUp to save freehand drawing
  private handleMouseUp = (e: MouseEvent): void => {
    if (this.isPanning) {
      this.isPanning = false;
      this.lastOffsetX = this.offsetX;
      this.lastOffsetY = this.offsetY;
      return;
    }
    
    if (this.isMovingShape) {
      this.isMovingShape = false;
      this.selectedShapeIndex = -1;
      this.dispatchShapeChangeEvent();
      this.updateCursor();
      return;
    }
  
    if (this.isDrawing) {
      this.isDrawing = false;
      const endX = (e.clientX + this.offsetX) / this.scale;
      const endY = (e.clientY + this.offsetY) / this.scale;

      if (this.selectedShape === "rect") {
        this.prevShapes.push({ 
          type: "rect", 
          x: this.startX, 
          y: this.startY, 
          w: endX - this.startX, 
          h: endY - this.startY 
        });
        this.dispatchShapeChangeEvent();
      } else if (this.selectedShape === "ellipse") {
        const centerX = (this.startX + endX) / 2;
        const centerY = (this.startY + endY) / 2;
        const rx = Math.abs(endX - this.startX) / 2;
        const ry = Math.abs(endY - this.startY) / 2;
        this.prevShapes.push({ 
          type: "ellipse", 
          x: centerX, 
          y: centerY, 
          rx, 
          ry 
        });
        this.dispatchShapeChangeEvent();    
      } else if (this.selectedShape === "arrow") {
        this.prevShapes.push({ 
          type: "arrow", 
          x: this.startX, 
          y: this.startY, 
          endX, 
          endY 
        });
        this.dispatchShapeChangeEvent();
      } else if (this.selectedShape === "freehand") {
        // Save freehand drawing
        if (this.currentFreehandPath.length > 1) {
          this.prevShapes.push({ 
            type: "freehand", 
            points: this.currentFreehandPath 
          });
          this.dispatchShapeChangeEvent();
        }
        this.currentFreehandPath = [];
      }
      
      this.redrawCanvas();
    }
  }

  // Add a method to find the bounding box of a freehand path
  private getFreehandBounds(points: { x: number; y: number }[]): { 
    minX: number; 
    minY: number; 
    maxX: number; 
    maxY: number 
  } {
    return points.reduce((bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxX: Math.max(bounds.maxX, point.x),
      maxY: Math.max(bounds.maxY, point.y)
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });
  }


  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isTyping) return;

    if (e.key === "Enter") {
      // Save current text and end typing
      if (this.currentText.trim() !== "") {
        this.prevShapes.push({ 
          type: "text", 
          x: this.textX, 
          y: this.textY, 
          content: this.currentText 
        });
        this.dispatchShapeChangeEvent();
      }
      this.isTyping = false;
      this.currentText = "";
      this.redrawCanvas();
      return;
    }

    if (e.key === "Escape") {
      // Cancel text input
      this.isTyping = false;
      this.currentText = "";
      this.redrawCanvas();
      return;
    }

    if (e.key === "Backspace") {
      // Remove last character
      this.currentText = this.currentText.slice(0, -1);
      this.redrawCanvas();
      return;
    }

    // Ignore modifier keys and function keys
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.currentText += e.key;
      this.redrawCanvas();
    }
  }

  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? this.scaleFactor : 1 / this.scaleFactor;
    const mouseX = (e.clientX + this.offsetX) / this.scale;
    const mouseY = (e.clientY + this.offsetY) / this.scale;

    this.scale *= zoomFactor;
    this.offsetX = mouseX * this.scale - e.clientX;
    this.offsetY = mouseY * this.scale - e.clientY;

    this.redrawCanvas();
  }

  private initEventListeners(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("wheel", this.handleWheel);
    window.addEventListener("keydown", this.handleKeyDown);
  }
  public setShape(shape: "rect" | "ellipse" | "arrow" | "text" | "freehand" | ""): void {
    this.selectedShape = shape;
    this.pan = false;
    
    // Update cursor based on selected shape
    this.updateCursor();
    
    if (this.isTyping) {
      // Save current text if switching from text mode
      if (this.currentText.trim() !== "") {
        this.prevShapes.push({ 
          type: "text", 
          x: this.textX, 
          y: this.textY, 
          content: this.currentText 
        });
        this.dispatchShapeChangeEvent();
      }
      this.isTyping = false;
      this.currentText = "";
      this.redrawCanvas();
    }
  }



  public setPan(pan: boolean): void {
    this.pan = pan;
    if (pan) {
      this.canvas.style.cursor = "grab";
    } else {
      this.updateCursor();
    }
  }

  public updateShapes(shapes: Shape[]): void {
    this.prevShapes = shapes;
    this.redrawCanvas();
  }

   private updateCursor(): void {
    if (this.selectedShape === "text") {
      this.canvas.style.cursor = "text";
    } else if (this.pan) {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  public destroy(): void {
    // Remove event listeners to prevent memory leaks
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  public getShapes(): Shape[] {
    return [...this.prevShapes];
  }

  public clearCanvas(): void {
    this.prevShapes = [];
    this.redrawCanvas();
    this.dispatchShapeChangeEvent();
  }
}