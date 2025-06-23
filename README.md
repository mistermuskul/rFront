# Resume Frontend (Quasar)

Frontend приложение для резюме, построенное на Quasar Framework.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Разработка
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

## 🔗 Настройка API

### Для локальной разработки:
Создайте файл `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

### Для продакшена (GitHub Pages + Railway):
В настройках GitHub репозитория добавьте секрет:
- **Name**: `VITE_API_URL`
- **Value**: `https://your-app-name.railway.app`

## 🌐 Деплой на GitHub Pages

1. **Создайте репозиторий** на GitHub
2. **Запушите код** в репозиторий
3. **Настройте GitHub Pages**:
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
4. **Добавьте секрет** `VITE_API_URL` с URL вашего Railway приложения
5. **При каждом пуше в main** будет автоматический деплой

## 🔧 Настройка Railway Backend

Убедитесь, что в Railway настроены переменные окружения:
```
APP_KEY=base64:ваш_ключ
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=ваш_хост_бд
DB_DATABASE=ваша_бд
DB_USERNAME=пользователь
DB_PASSWORD=пароль
```

## 📱 Доступ к приложению

После деплоя приложение будет доступно по адресу:
`https://ваш-username.github.io/ваш-репозиторий`
