import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { EntryFormService } from 'src/app/entry/services/entry-form.service';

@Component({
  selector: 'menu-option-show-values',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './option-showValues.component.html',
  styleUrl: './option-showValues.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionShowValuesComponent {

  entryFormService = inject(EntryFormService);
  inputValues = computed(() => this.entryFormService.currentControlInfo()?.controlInputJobData.Values);
}
