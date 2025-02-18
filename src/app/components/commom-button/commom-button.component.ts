import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commom-button',
  imports: [CommonModule],
  templateUrl: './commom-button.component.html',
  styleUrl: './commom-button.component.scss',
})
export class CommomButtonComponent {
  @Input() isDisable: boolean = false;
  @Input() type: string = '';
  @Input() label!: string;
  @Input() icon: string = '';
  @Input() colorText: string = '';
  @Input() colorBg: string = '';
  // @Input() action!: () => void;
}
