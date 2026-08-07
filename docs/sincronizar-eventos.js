console.log('🔄 Sistema de sincronização iniciado');

(function() {
  const storageKey = 'paineleventos_eventos';

  // Cria painel de sincronização visual
  function criarPainelSincronizacao() {
    const painel = document.createElement('div');
    painel.id = 'painel-sync';
    painel.innerHTML = `
      <div style="position:fixed; bottom:20px; right:20px; width:320px; background:white; border:2px solid #4caf50; border-radius:8px; padding:15px; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <div style="margin-bottom:12px;">
          <strong style="color:#333; font-size:14px;">💾 Sincronizar Eventos</strong>
          <button onclick="document.getElementById('painel-sync').style.display='none'" style="float:right; background:none; border:none; color:#999; font-size:18px; cursor:pointer;">×</button>
          <div style="clear:both;"></div>
        </div>
        
        <div style="background:#f0f0f0; padding:10px; border-radius:4px; margin-bottom:12px; font-size:13px; color:#666; line-height:1.5;">
          <p style="margin:0 0 10px 0;">📊 Você tem eventos preenchidos que podem ser compartilhados!</p>
          <p style="margin:0;">Clique abaixo para preparar os eventos para GitHub.</p>
        </div>
        
        <button onclick="window.prepararSincronizacao()" style="width:100%; padding:10px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; margin-bottom:8px;">
          📤 Preparar Sincronização
        </button>
        
        <button onclick="window.exportarEventosJSON()" style="width:100%; padding:10px; background:#2196f3; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
          ⬇️ Baixar eventos.json
        </button>
        
        <div style="margin-top:12px; padding-top:12px; border-top:1px solid #ddd; font-size:12px; color:#999;">
          <strong>Como usar:</strong>
          <ol style="margin:8px 0; padding-left:20px;">
            <li>Clique "Preparar Sincronização"</li>
            <li>Acesse GitHub</li>
            <li>Cole no arquivo docs/eventos.json</li>
            <li>Pronto! Todos veem os eventos</li>
          </ol>
        </div>
      </div>
    `;
    return painel;
  }

  // Prepara sincronização
  window.prepararSincronizacao = function() {
    const eventos = localStorage.getItem(storageKey);
    if (!eventos) {
      alert('❌ Nenhum evento no localStorage');
      return;
    }

    const eventosArray = JSON.parse(eventos);
    const dados = {
      eventos: eventosArray,
      configuracoes: {
        versao: '2.0',
        ultimaSincronizacao: new Date().toISOString(),
        armazenamento: 'localStorage + GitHub',
        acessoPublico: true,
        totalEventos: eventosArray.length
      }
    };

    const json = JSON.stringify(dados, null, 2);

    // Copia para clipboard
    navigator.clipboard.writeText(json).then(() => {
      const instrucoes = `✅ JSON Copiado!\n\n${eventosArray.length} evento(s) prontos.\n\nPróximos passos:\n1. Abra: https://github.com/marcellascarvalho/paineleventosFeluma\n2. Clique em 'docs/eventos.json'\n3. Clique no ícone de editar (lápis)\n4. Cole o conteúdo (Ctrl+V)\n5. Scroll down e clique 'Commit changes'\n\n✅ Pronto! Todos verão os eventos no link!`;
      alert(instrucoes);
      console.log('JSON PARA GITHUB:\n', json);
    }).catch(() => {
      alert('JSON exibido no console. Copie manualmente (F12)');
      console.log(json);
    });
  };

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
    a.download = 'eventos.json';
    a.click();
  };

  // Monitora localStorage
  function verificarEventos() {
    const eventos = localStorage.getItem(storageKey);
    if (eventos && !document.getElementById('painel-sync')) {
      const painel = criarPainelSincronizacao();
      document.body.appendChild(painel);
      console.log('✅ Painel de sincronização criado');
    }
  }

  // Verifica ao carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verificarEventos);
  } else {
    verificarEventos();
  }

  // Verifica periodicamente
  setInterval(verificarEventos, 3000);

  // Expõe função de debug
  window.debugSync = function() {
    const eventos = localStorage.getItem(storageKey);
    console.log('Eventos no localStorage:', eventos ? JSON.parse(eventos) : 'Nenhum');
  };
})();
