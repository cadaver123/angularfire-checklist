import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const checklistsPanelAnimation: AnimationTriggerMetadata = trigger('animation', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),
  transition(':enter', animate(`200ms ease-out`)),
  transition(':leave', animate(`200ms ease-in`))
]);
