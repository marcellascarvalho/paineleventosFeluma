// Script de sincronização de eventos entre localStorage e GitHub
console.log('🔄 sincronizar-eventos.js carregado');

(function() {
  const storageKey = 'paineleventos_eventos';

  // Função para monitorar mudanças no localStorage
  window.addEventListener('storage', function(e) {
    if (e.key === storageKey) {
      console.log('📊 Mudança detectada no localStorage');
      console.log('✅ Novos eventos devem ser sincronizados com GitHub');
      mostrarBotaoSincronizar();
    }
  });

  // Cria um botão flutuante para sincronização
  function criarBotaoSincronizar() {
    const botao = document.createElement('button');
    botao.id = 'btn-sincronizar';
    botao.innerHTML = '💾 Sincronizar com GitHub';
    botao.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      padding: 12px 16px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      z-index: 9999;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s;
    `;

    botao.onmouseover = function() {
      this.style.background = '#45a049';
      this.style.transform = 'scale(1.05)';
    };

    botao.onmouseout = function() {
      this.style.background = '#4caf50';
      this.style.transform = 'scale(1)';
    };

    botao.onclick = function() {
      sincronizar();
    };

    return botao;
  }

  function mostrarBotaoSincronizar() {
    let botao = document.getElementById('btn-sincronizar');
    if (!botao) {
      botao = criarBotaoSincronizar();
      document.body.appendChild(botao);
      console.log('✅ Botão de sincronização criado');
    }
  }

  // Função principal de sincronização
  function sincronizar() {
    const eventos = localStorage.getItem(storageKey);
    
    if (!eventos) {
      alert('❌ Nenhum evento no localStorage para sincronizar');
      return;
    }

    const eventosArray = JSON.parse(eventos);
    
    // Cria o formato do eventos.json
    const dadosSincronizacao = {
      eventos: eventosArray,
      configuracoes: {
        versao: '2.0',
        ultimaSincronizacao: new Date().toISOString(),
        armazenamento: 'localStorage + GitHub',
        acessoPublico: true,
        totalEventos: eventosArray.length
      }
    };

    // Gera o JSON formatado
    const jsonFormatado = JSON.stringify(dadosSincronizacao, null, 2);

    console.log('📋 JSON para sincronização:');
    console.log(jsonFormatado);

    // Copia para clipboard
    navigator.clipboard.writeText(jsonFormatado).then(() => {
      alert(`✅ JSON de sincronização copiado!\n\n${eventosArray.length} evento(s) prontos para sincronizar.\n\nPróximos passos:\n1. Abra o arquivo eventos.json no GitHub\n2. Cole o conteúdo acima\n3. Commit e Push\n\nOU execute:\nwindow.exportarEventosJSON()`);
    }).catch(err => {
      console.error('❌ Erro ao copiar:', err);
      alert('JSON exibido no console (F12)');
    });
  }

  // Exportar como arquivo
  window.exportarEventosJSON = function() {
    const eventos = localStorage.getItem(storageKey);
    if (!eventos) {
      alert('Nenhum evento para exportar');
      return;
    }

    const eventosArray = JSON.parse(eventos);
    const dados = {
      eventos: eventosArray,
      configuracoes: {
        versao: '2.0',
        ultimaSincronizacao: new Date().toISOString(),
        armazenamento: 'localStorage + GitHub',
        acessoPublico: true
      }
    };

    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eventos-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);

    alert('✅ Arquivo eventos.json baixado!\n\nPróximos passos:\n1. Vá para GitHub.com\n2. Edite docs/eventos.json\n3. Cole o conteúdo do arquivo baixado\n4. Commit & Push');
  };

  // Monitorar periodicamente
  setInterval(function() {
    const eventos = localStorage.getItem(storageKey);
    if (eventos) {
      mostrarBotaoSincronizar();
    }
  }, 5000);

  // Verificar ao carregar
  const eventos = localStorage.getItem(storageKey);
  if (eventos) {
    console.log('📊 Eventos encontrados no localStorage');
    mostrarBotaoSincronizar();
  }

  console.log('✅ Sistema de sincronização pronto');
  console.log('Comandos:');
  console.log('- window.exportarEventosJSON() - Baixar arquivo JSON');
  console.log('- Botão "Sincronizar com GitHub" aparecerá automaticamente');
})();
