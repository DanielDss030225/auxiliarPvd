# Como Instalar o APK do AutoForm RpPM

## 📱 Instalação no Android

### Passo 1: Baixar o APK
Após o build do Expo ser concluído, você receberá um link para download do APK.

### Passo 2: Transferir para o Celular
Você pode:
- **Enviar por WhatsApp/Telegram** para si mesmo
- **Baixar diretamente** no celular usando o link
- **Transferir via USB** do computador para o celular

### Passo 3: Habilitar Fontes Desconhecidas
1. Vá em **Configurações** → **Segurança**
2. Ative **Permitir instalação de aplicativos de fontes desconhecidas**
3. Ou, ao tentar instalar, você pode permitir apenas para o aplicativo de gerenciamento de arquivos

### Passo 4: Instalar o APK
1. Abra o arquivo APK no seu celular
2. Toque em **Instalar**
3. Aguarde a instalação
4. Toque em **Abrir** ou procure pelo ícone do app na tela inicial

## 🎨 Verificar o Ícone
O aplicativo deve aparecer com o ícone `icon.png` que você configurou.

## 🔄 Atualizações Futuras
Para gerar uma nova versão do APK:
1. Abra o terminal no diretório `mobile-expo`
2. Execute: `npx eas build -p android --profile preview`
3. Aguarde o build concluir (~20 minutos na fila gratuita)
4. Baixe o novo APK e reinstale no celular

## ⚠️ Solução de Problemas

### "Aplicativo não instalado"
- Desinstale a versão anterior primeiro
- Certifique-se de que tem espaço livre no dispositivo

### "Instalação bloqueada"
- Verifique se habilitou fontes desconhecidas
- Em alguns celulares, é preciso permitir em **Configurações** → **Apps** → **Acesso especial** → **Instalar apps desconhecidos**

### App não abre ou trava
- Limpe o cache do app em Configurações
- Desinstale e reinstale
- Verifique se tem conexão com a internet (o app usa WebView para carregar o site)
