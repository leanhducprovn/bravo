import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import * as wjc from '@grapecity/wijmo';
import { WjComboBox } from '@grapecity/wijmo.angular2.input';

import { BravoGraphicsRenderer } from '../bravo-graphics/bravo.graphics.renderer';
import { Font } from '../bravo-graphics/font';

@Component({
  selector: 'bravo-range-time',
  templateUrl: './bravo-range-time.component.html',
  styleUrls: ['./bravo-range-time.component.css'],
})
export class BravoRangeTimeComponent implements OnInit, AfterViewInit {
  @ViewChild('box', { static: true }) box!: WjComboBox;

  private _listMonth!: number[];
  @Input()
  public set listMonth(pnValue: number[]) {
    this._listMonth = pnValue;
  }
  public get listMonth(): number[] {
    if (!this._listMonth) {
      this._listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    return this._listMonth;
  }

  private _listQuarter!: string[];
  @Input()
  public set listQuarter(pnValue: string[]) {
    this._listQuarter = pnValue;
  }
  public get listQuarter(): string[] {
    if (!this._listQuarter) {
      this._listQuarter = ['I', 'II', 'II', 'IV'];
    }
    return this._listQuarter;
  }

  private _listYear!: number[];
  @Input()
  public set listYear(pnValue: number[]) {
    this._listYear = pnValue;
  }
  public get listYear(): number[] {
    if (!this._listYear) {
      this._listYear = [];
      let _currentYear = new Date().getFullYear();
      for (let i = 0; i < 9; i++) {
        this._listYear.push(_currentYear);
        _currentYear++;
      }
    }
    return this._listYear;
  }

  private _dataBox!: DataType[];
  @Input()
  public set dataBox(pzValue: DataType[]) {
    this._dataBox = pzValue;
  }
  public get dataBox(): DataType[] {
    return this._dataBox;
  }

  private _time!: Date;
  public set time(pdValue: Date) {
    this._time = pdValue;
  }
  public get time(): Date {
    if (!this._time) {
      this._time = new Date();
    }
    return this._time;
  }

  private _min!: Date;
  public set min(pdValue: Date) {
    this._min = pdValue;
  }
  public get min(): Date {
    if (!this._min) {
      this._min = new Date();
    }
    return this._min;
  }

  private _max!: Date;
  public set max(pdValue: Date) {
    this._max = pdValue;
  }
  public get max(): Date {
    if (!this._max) {
      this._max = new Date();
    }
    return this._max;
  }

  private _selectedIndex!: number;
  public set selectedIndex(pnValue: number) {
    this._selectedIndex = pnValue;
  }
  public get selectedIndex(): number {
    return this._selectedIndex;
  }

  public periodType = PeriodType;

  @Output()
  timeEvent = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit(): void {
    this.box.dropDownCssClass = 'range-time-drop-down';
    this.setWidth(this.dataBox[this.box.selectedIndex].text);
  }

  ngOnInit(): void {
    this.dataBox = [
      { value: 0, text: 'Tháng' },
      { value: 1, text: 'Quý' },
      { value: 2, text: 'Năm' },
      { value: 3, text: 'Tùy chỉnh' },
    ];
    this.dropDown();
  }

  public onClickMonth(event: any) {
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

  public onClickQuarter(event: any) {
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

  public onClickYear(event: any) {
    this.min = new Date();
    this.max = new Date();
    this.min.setFullYear(event.target.value, 0, 1);
    this.max.setFullYear(event.target.value, 11, 31);
    this.timeEvent.emit({ minTime: this.min, maxTime: this.max });
  }

  private getDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  private dropDown() {
    this.box?._tbx.addEventListener('click', () => {
      if (this.box.isDroppedDown) {
        this.box.isDroppedDown = false;
      } else {
        this.box.isDroppedDown = true;
      }
    });
    this.box.isDroppedDownChanging.addHandler((e) => {
      if (!e.isDroppedDown) {
        wjc.addClass(
          e.dropDown.childNodes[this.box.selectedIndex] as HTMLElement,
          'range-time-checked'
        );
      } else {
        e.dropDown.childNodes.forEach((element) => {
          wjc.removeClass(element as HTMLElement, 'range-time-checked');
        });
      }
    });
    this.box.selectedIndexChanged.addHandler(() => {
      this.selectedIndex = -1;
      this.setWidth(this.dataBox[this.box.selectedIndex].text);
    });
    this.box.isDroppedDownChanged.addHandler(() => {
      if (this.box._tbx) {
        this.box._tbx.selectionStart = 0;
        this.box._tbx.selectionEnd = 0;
      }
    });
  }

  public setIndex(index: number) {
    this.selectedIndex = index;
  }

  private setWidth(selectedValue: string) {
    if (this.box._tbx) {
      wjc.setCss(this.box._tbx, {
        maxWidth: this.getWidth(selectedValue).width + 'px',
      });
    }
  }

  private getWidth(selectedValue: string) {
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
