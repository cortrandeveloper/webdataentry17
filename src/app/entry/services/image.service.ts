import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { CanvasState } from '../interface/canvas-state.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { Coord } from '../interface/entry-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public canvasState = signal<CanvasState>({});
  private sanitizer = inject(DomSanitizer);

  constructor() {

  }

  public requestImage(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tryCreateImage(uri)
        .then((result) => {

          console.log('Image loaded');
          // this.canvasState.set({ image: result, zone: zone, zoneHighlight: zoneHighlight });
          this.canvasState.set({ image: result });
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private tryCreateImage(uri: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // create an image object
      let img = new Image();
      img.onload = function () {

        resolve(img);
      };
      img.onerror = function () {
        reject(new Error('Failed to load image'));
      };
      img.src = uri;
    });
  }

  public async trySetImageFromBlob(blob: Blob): Promise<boolean> {
    const result = await this.convertBlobToImage(blob);
    this.canvasState.set({ image: result });
    return true;
  }

  private async convertBlobToImage(blob: Blob): Promise<HTMLImageElement> {
    return await this.readAsDataURL(blob);
  }

  private readAsDataURL(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); //FileStream response from .NET core backend
      reader.onload = _event => {
        const url = reader.result as string; //url declared earlier
        const img = new Image();
        img.src = url; //image declared earlier
        resolve(img);
      };
      reader.onerror = error => reject(error);
    });
  }
  private setImagePyPage(pageIndex: number): void {


  }

  private setNextImage(): void {


  }

  private setPreviousImage(): void {

  }

  public setCurrentZoneAndHighlight(zone: Coord | undefined, highlight: Coord | undefined): void {


    this.canvasState.update(value => {
      return { ...value, zone: zone, zoneHighlight: highlight };
    });
  }
}
