// Script para integrar eventos salvos ao modal do painel
// Carrega eventos do eventos.json e mostra no modal "Eventos salvos"

(function() {
  const eventosStorageKey = 'paineleventos_eventos';
  
  // Função para carregar eventos do JSON
  async function carregarEventos() {
    try {
      // Tenta carregar do localStorage primeiro
      const eventosSalvos = localStorage.getItem(eventosStorageKey);
      if (eventosSalvos) {
        return JSON.parse(eventosSalvos);
      }
      
      // Se não houver, carrega do arquivo JSON
      const response = await fetch('eventos.json');
      const data = await response.json();
      const eventos = data.eventos || [];
      
      // Salva no localStorage para próximas vezes
      localStorage.setItem(eventosStorageKey, JSON.stringify(eventos));
      return eventos;
    } catch (error) {
      console.log('Erro ao carregar eventos:', error);
      return [];
    }
  }
  
  // Função para formatar data
  function formatarData(dataStr) {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  }
  
  // Função para gerar HTML dos eventos
  function gerarHTMLEventos(eventos) {
    if (!eventos || eventos.length === 0) {
      return '<p style="color: #999; text-align: center; padding: 20px;">Nenhum evento arquivado ainda.</p>';
    }
    
    let html = '<div style="max-height: 600px; overflow-y: auto;">';
    
    eventos.forEach((evento, index) => {
      const statusColor = evento.status === 'Concluído' ? '#4caf50' : 
                         evento.status === 'Em Execução' ? '#ff9800' : '#2196f3';
      
      html += `
        <div style="
          background: #f5f5f5;
          border-left: 4px solid ${statusColor};
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        ">
          <h4 style="margin: 0 0 10px 0; color: #333;">${evento.nome}</h4>
          <div style="font-size: 0.9em; color: #666;">
            <div><strong>Tipo:</strong> ${evento.tipo}</div>
            <div><strong>Data:</strong> ${formatarData(evento.data)}</div>
            <div><strong>Local:</strong> ${evento.local}</div>
            <div><strong>Porte:</strong> ${evento.porte} pessoas</div>
            <div><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${evento.status}</span></div>
            ${evento.relatorio ? `<div><strong>Relatório:</strong> <a href="${evento.relatorio}" target="_blank" style="color: #2196f3;">📄 Baixar PDF</a></div>` : ''}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }
  
  // Espera o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
  
  async function inicializar() {
    // Procura pelo botão "Eventos salvos"
    const botaoEventosSalvos = Array.from(document.querySelectorAll('button, a, [role="button"]'))
      .find(el => el.textContent.includes('Eventos salvos') || el.textContent.includes('eventos'));
    
    if (botaoEventosSalvos) {
      // Carrega eventos
      const eventos = await carregarEventos();
      
      if (eventos.length > 0) {
        // Cria um observador para o modal
        const observer = new MutationObserver(async (mutations) => {
          // Procura pelo conteúdo do modal que diz "Nenhum evento"
          const textoNenhum = Array.from(document.querySelectorAll('*'))
            .find(el => el.textContent.includes('Nenhum evento arquivado'));
          
          if (textoNenhum) {
            const containerModal = textoNenhum.closest('div');
            if (containerModal && containerModal.querySelector('p')) {
              // Substitui o conteúdo
              containerModal.innerHTML = gerarHTMLEventos(eventos);
            }
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
          characterDataOldValue: true
        });
      }
    }
  }
})();
