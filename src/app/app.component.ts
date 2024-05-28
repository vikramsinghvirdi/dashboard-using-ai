import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DisplayGrid, GridType, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface } from 'angular-gridster2';
import { FormsModule } from '@angular/forms';
import { OpenAI } from 'openai';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, GridsterComponent, GridsterItemComponent, FormsModule],
  providers: [ OpenAI ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dashboard-using-ai';
  public prompt: string = '';
  public options: GridsterConfig = {};
  public dashboard: Array<GridsterItem> = [];
  private openaiClient: any;

  constructor() {
    this.openaiClient = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });
  }

  static eventStart(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    console.info('eventStart', item, itemComponent, event);
  }

  static eventStop(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    console.info('eventStop', item, itemComponent, event);
  }

  static overlapEvent(
    source: GridsterItem,
    target: GridsterItem,
    grid: GridsterComponent
  ): void {
    console.log('overlap', source, target, grid);
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: false,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: AppComponent.eventStop,
        start: AppComponent.eventStart,
        dropOverItems: false
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0, hasContent: true, image: './assets/images/picture_01.png' },
      { cols: 2, rows: 2, y: 0, x: 2, hasContent: true, image: './assets/images/picture_02.png' },
      { cols: 2, rows: 1, y: 0, x: 4, hasContent: true, image: './assets/images/picture_03.png' },
      { cols: 2, rows: 1, y: 1, x: 0, hasContent: true, image: './assets/images/picture_04.png' },
    ];
  }

  removeItem(item: GridsterItem) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(image: string) {
    this.dashboard.push({
      x: 0,
      y: 0,
      rows: 1,
      cols: 2,
      image: image
    });
  }

  generateImage() {
    this.openaiClient.images.generate({
      prompt: this.prompt,
      size: '1024x1024',
      response_format: 'url'
    })
      .then((response: any) => {
        const generatedImageUrl = response.data;
        this.addItem(generatedImageUrl);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
