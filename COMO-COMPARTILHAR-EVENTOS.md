# Como Compartilhar Eventos com Qualquer Pessoa

## O Problema
Os eventos que você preenche no painel ficam salvos **no seu computador** (localStorage). 
Quando outra pessoa abre o link, não vê os eventos.

## A Solução
Sincronizar seus eventos com GitHub para que **apareçam para qualquer pessoa** que abra o link.

---

## ⚡ Modo Rápido (5 minutos)

### Passo 1: No seu computador (empresa)
1. Abra: https://marcellascarvalho.github.io/paineleventosFeluma/painel-gestao-eventos.html
2. Preencha os eventos no painel normalmente
3. **Um painel verde aparecerá** no canto inferior direito com "💾 Sincronizar Eventos"

### Passo 2: Sincronizar
1. Clique em **"📤 Preparar Sincronização"**
2. Um texto de instrução aparecerá (pode copiar de lá)
3. O JSON é **copiado automaticamente**

### Passo 3: GitHub
1. Abra: https://github.com/marcellascarvalho/paineleventosFeluma
2. Clique em **`docs/eventos.json`** 
3. Clique no ícone de **lápis** (edit)
4. **Apague tudo** e **cole** o JSON que você copiou (Ctrl+V)
5. Scroll para baixo e clique **"Commit changes"**

### Passo 4: Pronto! ✅
Agora **qualquer pessoa** que abra o link vê todos os seus eventos:
```
https://marcellascarvalho.github.io/paineleventosFeluma/painel-gestao-eventos.html
```

Quando clicarem em **"Eventos salvos"**, verão todos os eventos que você sincronizou.

---

## 🎯 Fluxo Visual

```
Seu Computador (empresa)
    ↓ (preenche eventos)
    ↓ (clica Sincronizar)
GitHub eventos.json
    ↓ (GitHub Pages publica)
Link Público
    ↓
Qualquer Pessoa Vê Os Eventos ✅
```

---

## 📋 Alternativas

### Se o painel não aparecer:
1. Pressione **F12** (Console)
2. Execute:
```javascript
window.prepararSincronizacao()
```

### Se quiser baixar arquivo:
1. Clique em **"⬇️ Baixar eventos.json"** no painel
2. Vai baixar um arquivo `eventos.json`
3. Vá para GitHub, edite e cole o conteúdo

---

## ❓ Perguntas Frequentes

**P: Quando sincronizo, meus eventos aparecem para todo mundo?**
A: Sim! Imediatamente após fazer commit no GitHub.

**P: Posso sincronizar múltiplas vezes?**
A: Sim! Toda vez que adiciona eventos novos, sincroniza de novo.

**P: Se deletar um evento, preciso sincronizar?**
A: Sim, sincronize novamente para atualizar o GitHub.

**P: Outros podem editar os eventos?**
A: Não. Eles só veem (leitura). Apenas você edita e sincroniza.

---

## 🔧 Troubleshooting

### Painel não aparece
- Verifique se tem eventos no localStorage: `window.debugSync()`
- Se tiver, recarregue a página (F5)

### JSON não copia
- Clique em "⬇️ Baixar eventos.json"
- Copie manualmente do arquivo

### Eventos não aparecem após sincronizar
- Aguarde 1-2 minutos (GitHub Pages atualiza)
- Recarregue a página (Ctrl+Shift+R)

---

## 📞 Resumo

| Ação | Como Fazer |
|------|-----------|
| Preencher eventos | Use o painel normalmente |
| Sincronizar | Clique "📤 Preparar Sincronização" |
| Compartilhar | Envie o link para qualquer pessoa |
| Atualizar | Sincronize novamente quando adicionar eventos |

**Pronto! Seus eventos estão acessíveis para qualquer pessoa com o link!** 🎉
