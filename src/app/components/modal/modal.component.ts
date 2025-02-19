import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() idModal: string = '';
  @Input() message: string = '';
  @Input() toggleModalFn!: (modalId: string, isOpen: boolean) => void;

  closeModal(): void {
    this.toggleModalFn(this.idModal, false);
  }
}
