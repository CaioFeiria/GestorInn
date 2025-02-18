import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() withButton: boolean = true;
  @Input() toggleModalFn!: (isOpen: boolean) => void;

  closeModal(): void {
    this.toggleModalFn(false);
  }
}
