# Como criar o APK usando Expo (EAS Build)

Este método permite gerar o APK usando os servidores da nuvem do Expo, **sem precisar instalar o Android Studio**.

## Passo 1: Hospedar seu Site (FEITO ✅)
Você já informou que o site está no GitHub Pages:
`https://danieldss030225.github.io/auxiliarPvd/`

Eu já configurei o App para abrir esse link automaticamente.

## Passo 2: Criar o APK na Nuvem
Agora basta gerar o arquivo .apk:

1. Abra o terminal na pasta `mobile/mobile-expo`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Instale a ferramenta CLI do EAS (Expo Application Services):
   ```bash
   npm install -g eas-cli
   ```
4. Faça login no Expo (crie conta em expo.dev se não tiver):
   ```bash
   npx eas login
   ```
5. Configure o projeto:
   ```bash
   npx eas build:configure
   ```
6. Gere o APK (para Android):
   ```bash
   npx eas build -p android --profile preview
   ```
   
O Expo vai processar tudo na nuvem e te devolver um link para baixar o `.apk` pronto! 🚀
