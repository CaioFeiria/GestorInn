import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})

// Componente Modal
// Modal utilizado na aplicação para cadastro de hóspede e reservas e edição/exclusão
// Recebe por @Input seu título, seu id, a menssagem se ouver e a função de abrir e fechar
export class ModalComponent {
  @Input() title: string = '';
  @Input() idModal: string = '';
  @Input() message: string = '';
  @Input() toggleModalFn!: (modalId: string, isOpen: boolean) => void;

  // Método closeModal
  // Fecha o modal quando é chamada
  closeModal(): void {
    this.toggleModalFn(this.idModal, false);
  }
}
