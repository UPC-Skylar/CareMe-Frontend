// src/app/support/services/support.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Support } from '../../shared/model/support.entity';

export interface CreateSupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportTicket extends Support {
  ticketNumber?: string;
  response?: string;
  responseDate?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  createSupportTicket(request: CreateSupportRequest): Observable<Support> {
    const userId = '1'; // Mock user ID

    const supportTicket: Omit<Support, 'id'> = {
      userId,
      name: request.name,
      email: request.email,
      subject: request.subject,
      message: request.message,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    return this.post<Support>('/support', supportTicket);
  }

  getUserSupportTickets(): Observable<SupportTicket[]> {
    const userId = '1'; // Mock user ID

    return this.get<Support[]>(`/support?userId=${userId}&_sort=date&_order=desc`)
      .pipe(
        map((tickets: Support[]) => tickets.map(ticket => ({
          ...ticket,
          ticketNumber: `TK-${ticket.id}`,
          response: this.getMockResponse(ticket.status),
          responseDate: ticket.status === 'resolved' ? this.getMockResponseDate() : undefined
        })))
      );
  }

  getSupportTicketById(id: string): Observable<SupportTicket> {
    return this.get<Support>(`/support/${id}`)
      .pipe(
        map((ticket: Support) => ({
          ...ticket,
          ticketNumber: `TK-${ticket.id}`,
          response: this.getMockResponse(ticket.status),
          responseDate: ticket.status === 'resolved' ? this.getMockResponseDate() : undefined
        }))
      );
  }

  updateTicketStatus(id: string, status: 'pending' | 'resolved' | 'in-progress'): Observable<Support> {
    return this.put<Support>(`/support/${id}`, { status });
  }

  getFAQItems(): Observable<FAQItem[]> {
    // Mock FAQ data - in a real app, this would come from an API
    const faqItems: FAQItem[] = [
      {
        id: '1',
        question: '¿Cómo puedo contratar un cuidador?',
        answer: 'Puedes contratar un cuidador navegando a la sección "Cuidadores", seleccionando el perfil que más te convenga y haciendo clic en "Contactar". Nuestro equipo se pondrá en contacto contigo para coordinar los detalles.',
        category: 'general'
      },
      {
        id: '2',
        question: '¿Todos los cuidadores están verificados?',
        answer: 'Sí, todos nuestros cuidadores pasan por un riguroso proceso de verificación que incluye revisión de antecedentes, validación de credenciales profesionales y entrevistas personales.',
        category: 'seguridad'
      },
      {
        id: '3',
        question: '¿Qué incluye el plan Premium?',
        answer: 'El plan Premium incluye acceso a cuidadores verificados, soporte básico, seguimiento de ubicación y botón de emergencia básico por S/ 20 al mes.',
        category: 'suscripcion'
      },
      {
        id: '4',
        question: '¿Puedo cancelar mi suscripción?',
        answer: 'Sí, puedes cancelar tu suscripción en cualquier momento desde la sección "Suscripción" en tu panel de control. La cancelación será efectiva al final del período de facturación actual.',
        category: 'suscripcion'
      },
      {
        id: '5',
        question: '¿Cómo funciona el botón de emergencia?',
        answer: 'El botón de emergencia conecta inmediatamente con servicios de emergencia y notifica a tus contactos de confianza, compartiendo la ubicación en tiempo real del cuidador y la persona bajo cuidado.',
        category: 'seguridad'
      },
      {
        id: '6',
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Aceptamos pagos con tarjetas de crédito, débito, transferencias bancarias, Yape y Plin. Todos los pagos son procesados de forma segura.',
        category: 'pagos'
      }
    ];

    return new Observable(observer => {
      observer.next(faqItems);
      observer.complete();
    });
  }

  searchFAQ(query: string): Observable<FAQItem[]> {
    return this.getFAQItems().pipe(
      map((items: FAQItem[]) => items.filter(item =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  private getMockResponse(status: string): string | undefined {
    if (status === 'resolved') {
      return 'Gracias por contactarnos. Hemos revisado tu consulta y el problema ha sido resuelto. Si tienes alguna pregunta adicional, no dudes en contactarnos nuevamente.';
    }
    if (status === 'in-progress') {
      return 'Hemos recibido tu consulta y nuestro equipo está trabajando en una respuesta. Te contactaremos pronto con más información.';
    }
    return undefined;
  }

  private getMockResponseDate(): string {
    const today = new Date();
    today.setDate(today.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
    return today.toISOString().split('T')[0];
  }
}
