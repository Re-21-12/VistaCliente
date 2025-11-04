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

    // Normalizar secuencias literales "\\n" a saltos reales y quitar espacios finales
    let t = text.replace(/\\n/g, '\n');
    t = t.replace(/\s+$/, '');

    // Escapar HTML para evitar XSS
    const escDiv = document.createElement('div');
    escDiv.appendChild(document.createTextNode(t));
    let escaped = escDiv.innerHTML;

    // Extraer bloques de código (```code```) y sustituir por tokens temporales
    const preBlocks: string[] = [];
    escaped = escaped.replace(/```([\s\S]*?)```/g, (_m, code) => {
      const token = `__PREBLOCK_${preBlocks.length}__`;
      // code ya está escapado; lo colocamos dentro de <pre><code>
      preBlocks.push(`<pre class="code-block"><code>${code}</code></pre>`);
      return token;
    });

    // Inline code `code`
    escaped = escaped.replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>',
    );

    // Links: [text](https://...)
    escaped = escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );

    // Bold **text** then italic *text*
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // List handling: líneas que comienzan con - o * -> <ul><li>..</li></ul>
    const lines = escaped.split('\n');
    const out: string[] = [];
    let inUl = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/^\s*[-*]\s+(.*)$/);
      if (m) {
        if (!inUl) {
          out.push('<ul>');
          inUl = true;
        }
        out.push(`<li>${m[1]}</li>`);
      } else {
        if (inUl) {
          out.push('</ul>');
          inUl = false;
        }
        // preservar líneas vacías (se convertirán a <br> más adelante)
        out.push(line);
      }
    }
    if (inUl) out.push('</ul>');

    // Reconstruir y convertir saltos a <br>, teniendo en cuenta que ya hay HTML de listas
    let processed = out.join('\n');

    // Restaurar bloques de código reemplazando los tokens por el HTML correspondiente
    preBlocks.forEach((html, idx) => {
      const token = `__PREBLOCK_${idx}__`;
      processed = processed.replace(token, html);
    });

    // Finalmente convertir saltos de línea no dentro de etiquetas block a <br>
    // Simplificación: reemplazamos todos los \n por <br>, los bloques <pre> contienen sus propios saltos y no se ven afectados
    processed = processed.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(processed);
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
