import { Component, Input } from '@angular/core';

import { Position } from '../../core/models/position';

@Component({
  selector: 'jpr-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {
  @Input() position: Position;
}
