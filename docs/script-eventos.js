class EventosManager {
  constructor() {
    this.storageKey = 'paineleventos_eventos';
    this.eventosFile = 'eventos.json';
    this.eventos = [];
    this.inicializar();
  }

  async inicializar() {
    const eventosSalvos = localStorage.getItem(this.storageKey);
    if (eventosSalvos) {
      this.eventos = JSON.parse(eventosSalvos);
    } else {
      await this.carregarDoJSON();
    }
  }

  async carregarDoJSON() {
    try {
      const response = await fetch(this.eventosFile);
      const data = await response.json();
      this.eventos = data.eventos || [];
      this.salvarNoLocalStorage();
    } catch (error) {
      this.eventos = [];
    }
  }

  salvarNoLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.eventos));
  }

  adicionarEvento(evento) {
    const novoEvento = {
      id: Date.now(),
      ...evento,
      dataCriacao: new Date().toISOString(),
      dataInscricao: new Date().toISOString()
    };
    this.eventos.push(novoEvento);
    this.salvarNoLocalStorage();
    return novoEvento;
  }

  obterTodos() {
    return this.eventos;
  }

  obterEstatisticas() {
    return {
      total: this.eventos.length,
      porteTotal: this.eventos.reduce((sum, e) => sum + (e.porte || 0), 0)
    };
  }

  exportarJSON() {
    const data = { eventos: this.eventos, ultimaAtualizacao: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }
}

const eventosManager = new EventosManager();
