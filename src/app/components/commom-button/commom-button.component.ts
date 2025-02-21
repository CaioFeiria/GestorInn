import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() iconLeft: boolean = false;
  @Input() iconRight: boolean = false;
  @Input() styleBtn: string = '';
  @Input() action!: () => void;
  @Output() actionClick = new EventEmitter<void>();

  actionClickFn(): void {
    this.actionClick.emit();
  }
}
