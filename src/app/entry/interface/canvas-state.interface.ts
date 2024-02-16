import { Coord } from "./entry-layout.interface";

export interface CanvasState {
  image?: HTMLImageElement;
  imageIndex?: number;
  zone?: Coord;
  zoneHighlight?: Coord;
}
