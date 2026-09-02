const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

const PDF_PATH = path.join(__dirname, 'habit_tracker.pdf');


// ===== КОМАНДА /START =====

bot.start(async (ctx) => {
    await ctx.reply(
        `🌿 Добро пожаловать в Habit Tracker!

Я помогу тебе формировать полезные привычки и отслеживать свой прогресс.

📕 Я подготовила для тебя PDF-гайд.

Нажми кнопку ниже, чтобы получить его 👇`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    '📥 Скачать PDF',
                    'download_pdf'
                )
            ]
        ])
    );
});


// ===== КНОПКА «СКАЧАТЬ PDF» =====

bot.action('download_pdf', async (ctx) => {
    await ctx.answerCbQuery();

    if (!fs.existsSync(PDF_PATH)) {
        await ctx.reply(
            '❌ PDF пока не найден. Мы ещё не добавили файл в бота.'
        );
        return;
    }

    await ctx.replyWithDocument(
        { source: PDF_PATH },
        {
            caption: '📕 Твой PDF-гайд готов!'
        }
    );
});


// ===== ЗАПУСК БОТА =====

bot.launch();

console.log('🤖 Habit Tracker Bot запущен!');


// ===== ОСТАНОВКА БОТА =====

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));