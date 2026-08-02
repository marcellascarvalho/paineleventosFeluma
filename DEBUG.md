# Guia de Debug — Eventos Salvos

Se os eventos não aparecem quando você clica em "Eventos salvos", siga estes passos:

## 🔍 Verificação Rápida

1. Abra o painel: https://marcellascarvalho.github.io/paineleventosFeluma/painel-gestao-eventos.html

2. Pressione **F12** (ou Ctrl+Shift+I) para abrir o Console

3. Digite no console:
```javascript
window.debugEventos()
```

4. Você deve ver:
   - `✅ Carregados: 4 evento(s)` 
   - Lista de eventos em JSON
   - HTML formatado dos eventos

## ✅ Se aparecer "Carregados: 4 evento(s)"

Significa que os eventos estão sendo carregados corretamente do `eventos.json`. 

**Próximo passo:** Clique em "Eventos salvos" e verifique se os eventos aparecem.

## ❌ Se aparecer erro ao carregar

### Erro: "404 eventos.json"
- O arquivo `eventos.json` não está em `docs/`
- **Solução:** Verifique em https://raw.githubusercontent.com/marcellascarvalho/paineleventosFeluma/claude/document-pdf-google-drive-eduhtr/docs/eventos.json

### Erro: "CORS / Network error"
- Pode ser bloqueio de rede
- **Solução:** Tente em outro navegador ou abra em incógnito

## 📊 Se os eventos carregam mas não aparecem no modal

1. No console, execute:
```javascript
console.log(document.querySelector('[class*="modal"]'))
```

2. Se retornar `null`, o seletor do modal está incorreto

3. Clique em "Eventos salvos" e no console digite:
```javascript
document.querySelectorAll('*')
  .forEach(el => {
    if (el.textContent.includes('Nenhum evento')) {
      console.log('ENCONTRADO:', el);
    }
  });
```

Isso mostrará o elemento exato onde "Nenhum evento" está.

## 📈 Verificação Completa

No console, copie e execute:

```javascript
async function teste() {
  console.log('=== TESTE DE EVENTOS ===');
  
  // 1. Verifica eventos.json
  console.log('1. Buscando eventos.json...');
  const resp = await fetch('eventos.json');
  const data = await resp.json();
  console.log('Status:', resp.status);
  console.log('Eventos:', data.eventos.length);
  
  // 2. Verifica localStorage
  console.log('2. Verificando localStorage...');
  const stored = localStorage.getItem('paineleventos_eventos');
  console.log('Salvo:', stored ? 'SIM' : 'NÃO');
  
  // 3. Verifica modal
  console.log('3. Procurando modal "Eventos salvos"...');
  const modal = document.querySelector('[class*="modal"]') || 
                document.querySelector('[role="dialog"]');
  console.log('Modal encontrado:', modal ? 'SIM' : 'NÃO');
  
  // 4. Procura por "Nenhum evento"
  console.log('4. Procurando "Nenhum evento"...');
  let found = false;
  document.querySelectorAll('*').forEach(el => {
    if (el.textContent.includes('Nenhum evento')) {
      console.log('Encontrado em:', el.tagName, el.className);
      found = true;
    }
  });
  console.log('Resultado:', found ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
  
  console.log('=== FIM DO TESTE ===');
}

teste();
```

## 📞 Próximos Passos

Se mesmo após o debug os eventos não aparecem:

1. Screenshot do console (F12)
2. Verifique a URL em seu navegador
3. Tente em incógnito/anônimo
4. Verifique em: https://github.com/marcellascarvalho/paineleventosFeluma/blob/claude/document-pdf-google-drive-eduhtr/docs/eventos.json

---

**Arquivos que devem estar em `docs/`:**
- ✅ painel-gestao-eventos.html (501 KB)
- ✅ eventos.json (3.4 KB)
- ✅ integrar-eventos.js (2.1 KB)
- ✅ 3 arquivos PDF de relatórios

**Se algum estiver faltando**, o script não conseguirá carregar os eventos.
