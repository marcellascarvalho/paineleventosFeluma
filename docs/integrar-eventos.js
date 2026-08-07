// Script para carregar e exibir eventos salvos no painel
console.log('🚀 integrar-eventos.js carregado');

(function() {
  const eventosStorageKey = 'paineleventos_eventos';
  let tentativas = 0;
  const MAX_TENTATIVAS = 50;

  // Carrega eventos do JSON
  async function carregarEventos() {
    try {
      const resp = await fetch('eventos.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      const eventos = data.eventos || [];
      console.log('✅ Carregados ' + eventos.length + ' evento(s)');
      localStorage.setItem(eventosStorageKey, JSON.stringify(eventos));
      return eventos;
    } catch (error) {
      console.error('❌ Erro ao carregar:', error.message);
      return [];
    }
  }

  // Formata HTML dos eventos
  function formatarEventos(eventos) {
    if (!eventos || eventos.length === 0) {
      return '<p>Nenhum evento encontrado</p>';
    }

    let html = '';
    eventos.forEach(function(evt) {
      const cor = evt.status === 'Concluído' ? '#4caf50' : 
                  evt.status === 'Em Execução' ? '#ff9800' : '#2196f3';
      const data = new Date(evt.data).toLocaleDateString('pt-BR');

      html += '<div style="background:#f0f0f0; border-left:4px solid ' + cor + '; padding:12px; margin:10px 0; border-radius:4px;">';
      html += '<strong style="font-size:14px;">' + evt.nome + '</strong><br>';
      html += '<small style="color:#666;">';
      html += '📋 ' + evt.tipo + '<br>';
      html += '📅 ' + data + '<br>';
      html += '📍 ' + evt.local + '<br>';
      html += '👥 ' + evt.porte + ' pessoas<br>';
      html += '📊 Status: <span style="color:' + cor + '; font-weight:bold;">' + evt.status + '</span>';
      if (evt.relatorio) {
        html += '<br><a href="' + evt.relatorio + '" target="_blank" style="color:#2196f3; text-decoration:none;">📄 Relatório PDF</a>';
      }
      html += '</small></div>';
    });

    return html;
  }

  // Função para substituir o conteúdo
  async function substituirConteudo(eventos) {
    console.log('🔍 Tentativa ' + (tentativas + 1) + ' de encontrar modal...');
    tentativas++;

    if (tentativas > MAX_TENTATIVAS) {
      console.log('⚠️ Max tentativas atingido');
      return false;
    }

    // Procura por divs que contenham "Nenhum evento arquivado"
    const todosElementos = document.querySelectorAll('div, section, article, main');
    for (let i = 0; i < todosElementos.length; i++) {
      const el = todosElementos[i];
      
      // Verifica se contém exatamente o texto "Nenhum evento"
      if (el.textContent.includes('Nenhum evento arquivado ainda')) {
        // Encontrou! Agora substitui este elemento e seus filhos
        console.log('✨ Encontrado elemento com "Nenhum evento"');
        
        // Acha o container pai (provavelmente é o modal)
        let container = el;
        let profundidade = 0;
        
        // Sobe até encontrar um container bom
        while (profundidade < 5 && container.parentElement) {
          if (container.className && container.className.includes('modal')) {
            break;
          }
          // Se encontrar um elemento maior que pareça ser um container
          const rect = container.getBoundingClientRect();
          if (rect.width > 300 && rect.height > 200) {
            break;
          }
          container = container.parentElement;
          profundidade++;
        }

        // Encontra onde exatamente está o texto
        const pais = el.querySelectorAll('p, div, span');
        for (let j = 0; j < pais.length; j++) {
          if (pais[j].textContent.includes('Nenhum evento')) {
            // Substitui só este elemento
            const conteudoFormatado = formatarEventos(eventos);
            pais[j].parentElement.innerHTML = conteudoFormatado;
            console.log('✅ Eventos injetados com sucesso!');
            return true;
          }
        }

        // Se não achou o p, substitui o container inteiro
        const conteudoAtual = container.innerHTML;
        const novoConteudo = conteudoAtual.replace(
          /Nenhum evento arquivado ainda\./g,
          formatarEventos(eventos)
        );
        container.innerHTML = novoConteudo;
        console.log('✅ Modal atualizado!');
        return true;
      }
    }

    return false;
  }

  // Inicializa
  async function inicializar() {
    const eventos = await carregarEventos();
    
    if (eventos.length === 0) {
      console.log('⚠️ Nenhum evento para carregar');
      return;
    }

    console.log('📊 ' + eventos.length + ' evento(s) disponível(is)');

    // Tenta substituir imediatamente
    const sucesso = await substituirConteudo(eventos);

    if (!sucesso) {
      // Se não conseguiu, observa mudanças no DOM
      console.log('👀 Observando DOM para quando modal abrir...');
      
      const observer = new MutationObserver(async function() {
        if (tentativas < MAX_TENTATIVAS) {
          const resultado = await substituirConteudo(eventos);
          if (resultado) {
            observer.disconnect();
            console.log('🎯 Parou de observar (sucesso)');
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false
      });
    }
  }

  // Aguarda DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }

  // Função global para debug
  window.debugEventos = async function() {
    console.log('=== DEBUG ===');
    const eventos = await carregarEventos();
    console.log('Eventos:', eventos);
    console.log('HTML:', formatarEventos(eventos));
    console.log('=== FIM ===');
  };
})();
