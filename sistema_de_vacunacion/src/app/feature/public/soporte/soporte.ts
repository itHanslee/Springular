import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicFooter } from '../components/public-footer/public-footer';
import { PublicHeader } from '../components/public-header/public-header';

type SoporteForm = {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
};

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, PublicHeader, PublicFooter],
  templateUrl: './soporte.html',
  styleUrl: './soporte.css',
})
export class Soporte {
  faqSearch = signal('');
  selectedQuestion = signal<number | null>(null);
  submitted = signal(false);

  form = signal<SoporteForm>({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });

  faqs = [
    {
      question: '¿Cómo puedo descargar mi certificado de vacunación?',
      answer: 'Ingresá a la sección correspondiente y usá el botón de descarga. Verificá que tus datos personales estén actualizados para evitar errores.'
    },
    {
      question: '¿Qué necesito para consultar mis dosis aplicadas?',
      answer: 'Necesitás estar registrado y autenticado. Luego podés revisar tu historial desde la sección "Vacunas aplicadas".'
    },
    {
      question: '¿Puedo actualizar la información de mi centro de vacunación?',
      answer: 'No es posible hacerlo directamente desde el portal público. Completá el formulario para que un asesor gestione la actualización.'
    },
    {
      question: '¿Cómo reporto un error en mi historial de vacunación?',
      answer: 'Usá el formulario de soporte indicando el error y los datos exactos. Nosotros derivaremos tu caso al equipo responsable.'
    },
    {
      question: '¿Dónde encuentro el esquema de vacunación PAI?',
      answer: 'El esquema oficial está disponible en la sección "Esquema" de la plataforma.'
    }
  ];

  filteredFaqs = computed(() => {
    const query = this.faqSearch().trim().toLowerCase();
    if (!query) {
      return this.faqs;
    }

    return this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
    );
  });

  canSubmit = computed(() => {
    const { nombre, correo, asunto, mensaje } = this.form();
    return [nombre, correo, asunto, mensaje].every(value => value.trim().length > 0);
  });

  toggleFaq(index: number): void {
    this.selectedQuestion.update(current => (current === index ? null : index));
  }

  updateField(field: keyof SoporteForm, value: string): void {
    this.form.set({ ...this.form(), [field]: value });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    if (!this.canSubmit()) {
      return;
    }

    // Simulación de envío, en producción se integraría con un servicio.
    this.form.set({ nombre: '', correo: '', asunto: '', mensaje: '' });
  }
}

