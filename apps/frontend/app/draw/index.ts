import { Shape } from "@/types/Shape";

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private prevShapes: Shape[];
  
  private startX: number = 0;
  private startY: number = 0;
  private pan: boolean = false;
  private isPanning: boolean = false;
  private isDrawing: boolean = false;
  private isTyping: boolean = false;
  private currentText: string = "";
  private textX: number = 0;
  private textY: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private lastOffsetX: number = 0;
  private lastOffsetY: number = 0;
  private scale: number = 1;
  private readonly scaleFactor: number = 1.1;
  private selectedShape: "rect" | "ellipse" | "arrow" | "text" = "rect";

  constructor(canvas: HTMLCanvasElement, prevShapes: Shape[] = []) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.prevShapes = prevShapes;
    
    this.initEventListeners();
    this.updateCursor();
    this.redrawCanvas();
  }

  private dispatchShapeChangeEvent(): void {
    // Dispatch a custom event that shapes have changed
    const event = new CustomEvent('shapechange');
    window.dispatchEvent(event);
    }

  private redrawCanvas(): void {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    // Apply zoom and translation
    this.ctx.translate(-this.offsetX, -this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    // Redraw stored shapes
    this.ctx.strokeStyle = "black";
    this.prevShapes.forEach(shape => {
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
        this.ctx.moveTo(this.textX + textWidth, this.textY - 20);
        this.ctx.lineTo(this.textX + textWidth, this.textY);
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
    localStorage.setItem('prevShapes', JSON.stringify(this.prevShapes));
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

  private handleMouseDown = (e: MouseEvent): void => {
    if (this.pan) {
      this.isPanning = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      return;
    }

    if (this.selectedShape === "text") {
      this.isTyping = true;
      this.textX = (e.clientX + this.offsetX) / this.scale;
      this.textY = (e.clientY + this.offsetY) / this.scale;
      this.currentText = "";
      this.redrawCanvas();
      return;
    }

    this.isDrawing = true;
    this.startX = (e.clientX + this.offsetX) / this.scale;
    this.startY = (e.clientY + this.offsetY) / this.scale;
  }

  private handleMouseMove = (e: MouseEvent): void => {
    if (this.isPanning) {
      this.offsetX = this.lastOffsetX - (e.clientX - this.startX);
      this.offsetY = this.lastOffsetY - (e.clientY - this.startY);
      this.redrawCanvas();
      return;
    }
    
    if (this.isDrawing) {
      const endX = (e.clientX + this.offsetX) / this.scale;
      const endY = (e.clientY + this.offsetY) / this.scale;
      this.redrawCanvas();
      
      if (!this.ctx) return;
      
      this.ctx.save();
      this.ctx.translate(-this.offsetX, -this.offsetY);
      this.ctx.scale(this.scale, this.scale);

      if (this.selectedShape === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, endX - this.startX, endY - this.startY);
      } else if (this.selectedShape === "ellipse") {
        const centerX = (this.startX + endX) / 2;
        const centerY = (this.startY + endY) / 2;
        const rx = Math.abs(endX - this.startX) / 2;
        const ry = Math.abs(endY - this.startY) / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (this.selectedShape === "arrow") {
        this.drawArrow(this.startX, this.startY, endX, endY);
      }

      this.ctx.restore();
    }
  }

  private handleMouseUp = (e: MouseEvent): void => {
    if (this.isPanning) {
      this.isPanning = false;
      this.lastOffsetX = this.offsetX;
      this.lastOffsetY = this.offsetY;
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
      }
      
      this.redrawCanvas();
    }
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

  public setShape(shape: "rect" | "ellipse" | "arrow" | "text"): void {
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