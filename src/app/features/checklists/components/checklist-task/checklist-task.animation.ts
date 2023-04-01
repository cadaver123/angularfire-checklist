import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const checklistTaskAnimation: AnimationTriggerMetadata = trigger('animationChecked', [
  state('void', style({ transform: 'scale(0)' })),
  state('*', style({ transform: 'scale(1)' })),
  transition(
    ':enter',
    animate(`300ms cubic-bezier(0.17, 0.50, 0.94, 0.55)`)
  ),
  transition(
    ':leave',
    animate(`300ms cubic-bezier(0.17, 0.50, 0.94, 0.55)`)
  )
]);
