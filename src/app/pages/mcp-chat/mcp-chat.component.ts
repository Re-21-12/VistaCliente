import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mcp-chat',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mcp-chat.component.html',
  styleUrl: './mcp-chat.component.css',
})
export class McpChatComponent {
  private readonly http = inject(HttpClient);
  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  userInput = '';
  loading = false;

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const question = this.userInput.trim();
    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';
    this.loading = true;

    try {
      const body = {
        jsonrpc: '2.0',
        method: 'mcp.call_tool',
        params: {
          name: 'partidos.resultados',
          arguments: { query: question },
        },
        id: Date.now(),
      };

      const res: any = await this.http
        .post('https://mcp.corazondeseda.lat/rpc', body)
        .toPromise();

      const reply = res?.result || 'Sin respuesta del servidor.';
      this.messages.push({
        sender: 'bot',
        text: JSON.stringify(reply, null, 2),
      });
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
