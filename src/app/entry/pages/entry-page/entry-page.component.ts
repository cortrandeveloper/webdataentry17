import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlType } from '../../enums/control-type.enum';
import { ControlInfo } from '../../interface/control-info.interface';
import { RootLayout } from '../../interface/entry-layout.interface';
import { EntryFormService } from '../../services/entry-form.service';
import { ImageService } from '../../services/image.service';
import { MenuModalService } from '../../services/menu-modal.service';
import { OptionModalService } from '../../services/option-modal.service';
import { UserSessionService } from '../../services/user-session.service';
import { DataentryApiService } from '../../services/dataentry-api.service';
import { Subscription, catchError, firstValueFrom, switchMap, tap } from 'rxjs';
import { DataentryDocument } from '../../interface/dataentry-document.interface';
import { AssignedDataentryJobs } from '../../interface/assigned-dataentryjobs.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { JobParams } from '../../interface/job-params.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { SavePromptModalService } from '../../services/save-prompt-modal.service';
import { InterruptPromptModalService } from '../../services/interrupt-prompt-modal.service';

@Component({
  templateUrl: './entry-page.component.html',
  styleUrls: ['./entry-page.component.css'],
})
export class EntryPageComponent implements OnInit, AfterViewInit {
  @ViewChild('imageView') imageView!: ElementRef;
  @ViewChild('image') image!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  private currentScale: number = 1;

  //Angular Services
  private render = inject(Renderer2);
  //Custom Services
  private userSessionService = inject(UserSessionService);
  private entryFormService = inject(EntryFormService);
  private imageService = inject(ImageService);
  private dataentryApiService = inject(DataentryApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public controlType = ControlType;
  public menuModalService = inject(MenuModalService);
  public optionModalService = inject(OptionModalService);
  public savePromptModalService = inject(SavePromptModalService);
  public interruptPromptModalService = inject(InterruptPromptModalService);
  private documentActionSubscription: Subscription = new Subscription();

  constructor() {
    effect(() => {
      if (this.imageService.canvasState()) {
        this.renderCanvas();
      }
    });
  }

  private renderCanvas() {
    console.log('renderCanvas called');

    const imageState = this.imageService.canvasState();

    if (!imageState) return;

    const img = imageState.image;

    if (!img) return;

    let canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (!canvas) return;

    console.log('Rending Canvas...')

    const zone = imageState.zone;

    canvas.width = img.width;
    canvas.height = zone?.H || img.height;

    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (zone)
      ctx.drawImage(img, zone.X, zone.Y, zone.W, zone.H, 0, 0, zone.W, zone.H);
    else
      ctx.drawImage(img, 0, 0);

    if (!zone) return;

    console.log('zone', zone);
    const zoneHighlights = imageState.zoneHighlight;

    if (!zoneHighlights) return;

    console.log('zoneHighlights', zoneHighlights);

    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.rect(
      zoneHighlights.X - zone.X,
      zoneHighlights.Y - zone.Y,
      zoneHighlights.W,
      zoneHighlights.H
    );
    ctx.fillStyle = 'yellow';
    ctx.fill();
  }

  get entryForm(): FormGroup {
    return this.entryFormService.entryFormControls;
  }

  get entryLayout(): RootLayout | undefined {
    return this.entryFormService.entryLayout;
  }

  ngOnDestroy() {
    this.documentActionSubscription.unsubscribe();
  }
  //private testscript = `return function test(obj,obj2) { console.log(obj);obj.foo='xxx';console.log(obj2); }`;

  //private cola = `function puto(){console.log('MMXXX');}`;
  ngOnInit(): void {
    this.documentActionSubscription = this.entryFormService.documentAction$
      .subscribe(data => {
        console.log(data);
        this.userSessionService.setDataentryDocument(undefined);
        this.entryFormService.clearEntryForm();

        if (data === 'save') {
          this.getNextDocument();
        } else if (data === 'interrupt') {
          this.router.navigate(['assigned-jobs'], { relativeTo: this.route });
        }
      });

    //this.entryFormService.pullEntryDocument();


    // this.imageService.requestImage(
    //   `${this.userSessionService.imageServiceAddress}/Images?imagePath=default`
    // ).then((data: any) => {

    //   this.entryFormService.moveToFirstControl();
    //   //this.entryFormService.moveToControlByName('crl_pulseirregularity');
    // });


    // const obj = { foo: 'bar', baz: 42 };
    // const obj2 = { foo: 'bar2', baz: 82 };
    // const newf = new Function(this.testscript);
    // newf()(obj,obj2);
    // console.log(obj);
    const projectName = this.route.snapshot.queryParamMap.get('projectName') || '';
    const layoutName = this.route.snapshot.queryParamMap.get('layoutName') || '';
    const processName = this.route.snapshot.queryParamMap.get('processName') || '';

    const jobParams: JobParams = {
      projectName,
      layoutName,
      processName
    };

    console.log('JobParams: ', jobParams);
    this.userSessionService.setJobParams(jobParams);
    this.userSessionService.setDataentryDocument(undefined);
    this.entryFormService.clearEntryForm();
  }

  ngAfterViewInit(): void {
    // this.entryFormService.setControlFlowByIndex(0);
    this.getNextDocument();
  }

  async getNextDocument(): Promise<void> {

    try {
      const document = await this.requestDocumentFromApi();
      const requestImage = this.requestImageFromApi(document.imagePath);

      this.userSessionService.setDataentryDocument(document);
      const renderForm = this.renderForm();

      const imageBlob = await requestImage;
      await this.imageService.trySetImageFromBlob(imageBlob);

      await renderForm;
      this.entryFormService.moveToFirstControl();
    }
    catch (err) {
      console.log('Redirect');
      this.router.navigate(['assigned-jobs'], { relativeTo: this.route });
    }
  }

  async renderForm(): Promise<void> {
    this.entryFormService.prepareInputJobdata();
    this.entryFormService.loadLayout();
    this.entryFormService.createForm();
  }

  async requestDocumentFromApi(): Promise<DataentryDocument> {
    try {
      return await firstValueFrom(
        this.dataentryApiService.getDocument()
      );
    } catch (err) {
      console.log('error in source. Details: ', err);
      throw err;
    }
  }

  async requestImageFromApi(imagePath: string): Promise<Blob> {
    try {
      return await firstValueFrom(
        this.dataentryApiService.getImage(imagePath)
      );
    } catch (err) {
      console.log('error in source. Details: ', err);
      throw err;
    }
  }

  getControlInfo(controlName: string): ControlInfo {
    return this.entryFormService.entryControls.find(
      (item) => item.name === controlName
    ) as ControlInfo;
  }

  focusControlFlow(event: MouseEvent): void {
    this.entryFormService.focusCurrentControlFlow();
  }

  //@HostListener('document:keydown.f1', ['$event'])
  showMenuModal(menuName: string): void {
    this.menuModalService.open(menuName);
  }

  @HostListener('window:keydown.control.f', ['$event'])
  setFlagCurrentControl(event: KeyboardEvent): void {

    event.preventDefault();
    event.stopImmediatePropagation();

    this.entryFormService.setFlagCurrentControl();
  }

  // @HostListener('window:keydown.control.s', ['$event'])
  // saveJobData(event: KeyboardEvent): void {
  //   this.entryFormService.creteJobdata();

  //   event.preventDefault();
  // }

  @HostListener('window:keydown.control.q', ['$event'])
  zoomIn(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.currentScale - 0.1 < 0.1) return;

    this.currentScale = this.currentScale - 0.1;
    this.canvas.nativeElement.style.transform =
      'scale(' + this.currentScale + ')';
    this.canvas.nativeElement.style.transformOrigin = 'top left';
  }

  @HostListener('window:keydown.control.e', ['$event'])
  zoomOut(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.currentScale + 0.1 > 2) return;

    this.currentScale = this.currentScale + 0.1;
    this.canvas.nativeElement.style.transform =
      'scale(' + this.currentScale + ')';
    this.canvas.nativeElement.style.transformOrigin = 'top left';
  }

  @HostListener('window:keydown.control.arrowright', ['$event'])
  scrollImageRight(event: KeyboardEvent): void {
    this.imageView.nativeElement.scrollLeft += 100;
    //this.imageView.nativeElement.style.transform = 'scale(2,2)';
    event.preventDefault();
  }

  @HostListener('window:keydown.control.arrowleft', ['$event'])
  scrollImageLeft(event: KeyboardEvent): void {
    this.imageView.nativeElement.scrollLeft -= 100;
    event.preventDefault();
  }

  @HostListener('window:keydown.control.arrowup', ['$event'])
  scrollImageUp(event: KeyboardEvent): void {
    this.imageView.nativeElement.scrollTop -= 100;
    event.preventDefault();
  }

  @HostListener('window:keydown.control.arrowdown', ['$event'])
  scrollImageDown(event: KeyboardEvent): void {
    this.imageView.nativeElement.scrollTop += 100;
    event.preventDefault();
  }

  // nextControl(event: any): void {

  //   const controlName = event?.target?.id;

  //   if (!controlName) return;

  //   const index = this.entryControls.indexOf(controlName);
  //   const nextControlName = this.entryControls[index + 1];
  //   console.log(nextControlName);
  //   document.getElementById(nextControlName)?.focus();
  // }

  // previousControl(event: any): void {

  //   const controlName = event?.target?.id;

  //   if (!controlName) return;

  //   const index = this.entryControls.indexOf(controlName);
  //   const previousControlName = this.entryControls[index - 1];
  //   console.log(previousControlName);
  //   document.getElementById(previousControlName)?.focus();

  // }

  // old333nextElement(event: any): void {
  //   console.log(event);

  //   if (event.key == 'Enter') {
  //     const element = event.target;
  //     console.log('cola', element.id);
  //     const mm = this.render.selectRootElement(element);
  //     console.log('achin', mm);
  //     console.log('xx', mm.id);

  //     this.entryForm.get('crl_slip_id')?.enable();

  //     //this.entryForm.IndexOf
  //     document.getElementById('crl_slip_id')?.focus();
  //   }

  // }

  // @HostListener('window:keyup.enter', ['$event'])
  testNextElement(event: any): void {
    let next = event.srcElement.nextElementSibling;

    let beee = this.render.nextSibling(
      event.target.parentElement.parentElement
    );
    beee.children[0].focus();
    console.log('pre1', { beee });
    console.log('pre2', beee.children[0].children[0]);
    console.log(event.target.parentElement.parentElement);

    beee.children[0].children[0].focus();

    // if (next) {
    //   console.log('xsx');
    //   next.focus();
    // } else {
    //   console.log('xx');
    //   event.target.blur();
    // }
  }
}
