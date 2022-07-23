import { Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, OnInit } from '@angular/core';

// wijmo
import * as wjc from '@grapecity/wijmo';

// enum
import { SliderTickStyle } from '../data-types/enum/slider-tick-style';
import { SliderLabelDisplay } from '../data-types/enum/slider-label-display';
import { SliderLabelPosition } from '../data-types/enum/slider-label-position';

@Component({
  selector: 'bravo-slider-base',
  templateUrl: './bravo-slider-base.component.html',
  styleUrls: ['./bravo-slider-base.component.css'],
})
export class BravoSliderBaseComponent extends wjc.Control implements OnInit {
  public options: Options = {
    floor: 0,
    ceil: 100,
    tickStep: 10,
    showTicks: true,
    ticksArray: undefined,
    showSelectionBar: true,
    getLegend: this.getLegend,
  };

  public constructor(elementRef: ElementRef) {
    super(elementRef.nativeElement);
  }

  public override refresh(fullUpdate?: boolean): void {
    super.refresh(fullUpdate);
  }

  public ngOnInit(): void {}

  public getLegend(value: number): string {
    return `${value}`;
  }

  private _isToolTip!: boolean;
  private _startValue!: number;
  private _changeValue!: number;

  public onUserChangeStart(event: any) {
    this._startValue = event.value;
  }

  public onUserChange(event: any) {
    this._changeValue = event.value;
    if (event.value != this._startValue) {
      this._isToolTip = true;
    }
  }

  public onUserChangeEnd(event: any) {
    if (event.value == this._changeValue) {
      this._isToolTip = false;
      this.getCollection('ngx-slider-bubble').forEach((element) => {
        wjc.addClass(element, 'remove-slider-tooltip');
      });
    }
  }

  public onValueChange(event: any) {
    this.getCollection('ngx-slider-bubble').forEach((element) => {
      wjc.toggleClass(element, 'remove-slider-tooltip', !this._isToolTip);
    });
  }

  private getCollection(...className: Array<string>) {
    const _elements = new Array<HTMLElement>();
    for (const zClassName of className) {
      _elements.push(
        ...Array.from(
          this.hostElement?.getElementsByClassName(
            zClassName
          ) as HTMLCollectionOf<HTMLElement>
        )
      );
    }
    return _elements;
  }
}
