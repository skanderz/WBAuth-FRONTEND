import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCellStyle]'
})
export class CellStyleDirective {
  @Input() appCellStyle: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (this.appCellStyle === "✔") {
      this.renderer.setStyle(this.el.nativeElement.parentElement, "background-color", "#128D3A");
      this.renderer.setStyle(this.el.nativeElement.parentElement, "color", "white");  }
    else if (this.appCellStyle === "✖") {
      this.renderer.setStyle(this.el.nativeElement.parentElement, "background-color", "red");
      this.renderer.setStyle(this.el.nativeElement.parentElement, "color", "white");
    }

  }




}

