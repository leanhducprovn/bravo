import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import * as wjc from '@grapecity/wijmo';
import { Control } from '@grapecity/wijmo';
import { WjComboBox } from '@grapecity/wijmo.angular2.input';

import { BravoGraphicsRenderer } from '../bravo-graphics/bravo.graphics.renderer';
import { Font } from '../bravo-graphics/font';

@Component({
  selector: 'bravo-range-time',
  templateUrl: './bravo-range-time.component.html',
  styleUrls: ['./bravo-range-time.component.css'],
})
export class BravoRangeTimeComponent
  extends Control
  implements OnInit, AfterViewInit
{
  @ViewChild('box', { static: true }) box!: WjComboBox;

  private _listMonth!: number[];
  @Input()
  public set listMonth(pnValue: number[]) {
    this._listMonth = pnValue;
    this.invalidate();
  }
  public get listMonth(): number[] {
    return this._listMonth;
  }

  private _listQuarter!: string[];
  @Input()
  public set listQuarter(pnValue: string[]) {
    this._listQuarter = pnValue;
    this.invalidate();
  }
  public get listQuarter(): string[] {
    return this._listQuarter;
  }

  private _listYear!: number[];
  @Input()
  public set listYear(pnValue: number[]) {
    this._listYear = pnValue;
    this.invalidate();
  }
  public get listYear(): number[] {
    return this._listYear;
  }

  private _dataBox!: DataType[];
  @Input()
  public set dataBox(pzValue: DataType[]) {
    this._dataBox = pzValue;
    this.invalidate();
  }
  public get dataBox(): DataType[] {
    return this._dataBox;
  }

  time = new Date();
  min!: Date;
  max!: Date;
  selectedIndex!: number;

  periodType = PeriodType;

  @Output() timeEvent = new EventEmitter<any>();

  constructor(elementRef: ElementRef) {
    super(elementRef.nativeElement);
  }

  public override refresh(fullUpdate?: boolean) {
    super.refresh(fullUpdate);
    this.setWidth(this.dataBox[this.box.selectedIndex].text);
    this.dropDown();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.dataBox = [
      { value: 0, text: 'Tháng' },
      { value: 1, text: 'Quý' },
      { value: 2, text: 'Năm' },
      { value: 3, text: 'Tùy chỉnh' },
    ];
  }

  onClickMonth(event: any) {
    this.min = new Date();
    this.max = new Date();
    this.min.setFullYear(this.time.getFullYear(), event.target.value - 1, 1);
    this.max.setFullYear(
      this.time.getFullYear(),
      event.target.value - 1,
      this.getDayOfMonth(this.time.getFullYear(), event.target.value)
    );
    this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
  }

  onClickQuarter(event: any) {
    this.min = new Date();
    this.max = new Date();
    let quarter = event.target.textContent;
    if (quarter == 'I') {
      this.min.setFullYear(this.time.getFullYear(), 0, 1);
      this.max.setFullYear(
        this.time.getFullYear(),
        2,
        this.getDayOfMonth(this.time.getFullYear(), 3)
      );
      this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
    } else if (quarter == 'II') {
      this.min.setFullYear(this.time.getFullYear(), 3, 1);
      this.max.setFullYear(
        this.time.getFullYear(),
        5,
        this.getDayOfMonth(this.time.getFullYear(), 6)
      );
      this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
    } else if (quarter == 'III') {
      this.min.setFullYear(this.time.getFullYear(), 6, 1);
      this.max.setFullYear(
        this.time.getFullYear(),
        8,
        this.getDayOfMonth(this.time.getFullYear(), 9)
      );
      this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
    } else if (quarter == 'IV') {
      this.min.setFullYear(this.time.getFullYear(), 9, 1);
      this.max.setFullYear(
        this.time.getFullYear(),
        11,
        this.getDayOfMonth(this.time.getFullYear(), 12)
      );
      this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
    }
  }

  onClickYear(event: any) {
    this.min = new Date();
    this.max = new Date();
    this.min.setFullYear(event.target.value, 0, 1);
    this.max.setFullYear(event.target.value, 11, 31);
    this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
  }

  getDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  dropDown() {
    this.box.dropDownCssClass = 'range-time-drop-down';
    this.box.isDroppedDownChanging.addHandler((e) => {
      e.dropDown.childNodes.forEach((element) => {
        wjc.removeClass(element as HTMLElement, 'range-time-checked');
      });
      wjc.addClass(
        e.dropDown.childNodes[this.box.selectedIndex] as HTMLElement,
        'range-time-checked'
      );
    });
    this.box.selectedIndexChanged.addHandler(() => {
      this.selectedIndex = NaN;
      this.setWidth(this.dataBox[this.box.selectedIndex].text);
    });
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  setWidth(selectedValue: string) {
    const input = document.getElementsByClassName(
      'wj-form-control'
    ) as HTMLCollection;
    wjc.setCss(input[0], {
      maxWidth: this.getPreferredSize(selectedValue).width + 'px',
    });
  }

  getPreferredSize(selectedValue: string) {
    let size = new wjc.Size(
      Number(
        BravoGraphicsRenderer.measureString(
          selectedValue,
          new Font('Segoe UI', 9.75)
        )?.width
      ) + 16
    );
    return size;
  }
}

enum PeriodType {
  Month,
  Quarter,
  Year,
  Custom,
}

export interface DataType {
  value: number;
  text: string;
}
