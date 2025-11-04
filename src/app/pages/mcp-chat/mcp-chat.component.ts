import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mcp-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mcp-chat.component.html',
  styleUrls: ['./mcp-chat.component.css'],
})
export class McpChatComponent {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  userInput = '';
  loading = false;
  useFetch = false; // nuevo: poner true para usar fetch hacia /llm/chat

  formatMessage(text: string): SafeHtml {
    if (!text) return '';

    // Si el backend devuelve secuencias literales "\n" convertirlas a saltos reales
    let t = text.replace(/\\n/g, '\n');
    // Quitar espacios/saltos finales
    t = t.replace(/\s+$/, '');

    // Escapar HTML para evitar XSS, luego convertir saltos a <br>
    const escDiv = document.createElement('div');
    escDiv.appendChild(document.createTextNode(t));
    let escaped = escDiv.innerHTML;
    escaped = escaped.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(escaped);
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const question = this.userInput.trim();
    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';
    this.loading = true;

    try {
      if (this.useFetch) {
        // Petición directa al endpoint /llm/chat del MCP (no JSON-RPC /rpc)
        const body = { prompt: question };

        const resp = await fetch('https://mcp.corazondeseda.lat/llm/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const res = await resp.json();

        // Manejar varias formas de respuesta que pueda devolver el servidor
        const reply =
          res?.reply ||
          res?.result?.reply ||
          res?.choices?.[0]?.message?.content ||
          res?.message ||
          JSON.stringify(res, null, 2) ||
          'Sin respuesta del servidor.';
        this.messages.push({
          sender: 'bot',
          text:
            typeof reply === 'string' ? reply : JSON.stringify(reply, null, 2),
        });
      } else {
        // Lógica existente con HttpClient (JSON-RPC hacia /rpc usando method 'mcp.chat')
        const body = {
          jsonrpc: '2.0',
          // Pide al MCP que haga una consulta de chat al LLM.
          method: 'mcp.chat',
          params: {
            messages: [
              {
                role: 'system',
                content:
                  'Eres un asistente. Si necesitas datos de partidos, usa las herramientas del MCP.',
              },
              { role: 'user', content: question },
            ],
          },
          id: Date.now(),
        };

        const res: any = await this.http
          .post('https://mcp.corazondeseda.lat/rpc', body)
          .toPromise();

        const reply =
          res?.result?.reply ||
          res?.result?.choices?.[0]?.message?.content ||
          JSON.stringify(res?.result, null, 2) ||
          'Sin respuesta del servidor.';
        this.messages.push({
          sender: 'bot',
          text:
            typeof reply === 'string' ? reply : JSON.stringify(reply, null, 2),
        });
      }
    } catch (err) {
      this.messages.push({
        sender: 'bot',
        text: '❌ Error al contactar el servidor MCP.',
      });
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
