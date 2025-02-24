import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})

// Componente Alert
// Exibe em tela quando um hóspede/reserva é cadastrado ou editado
export class AlertComponent {
  @Input() message: string = '';
  @Input() hidden: boolean = false;
}
