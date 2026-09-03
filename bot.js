const { Telegraf, Markup, Input } = require('telegraf');

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
});


const BOT_TOKEN_DATA = process.env.BOT_TOKEN;
console.log("BOT_TOKEN:", BOT_TOKEN_DATA);

const bot = new Telegraf(process.env.BOT_TOKEN);

const PDF_PATH = path.join(__dirname, 'habit_tracker.pdf');
const TITLE_IMAGE = path.join(__dirname, 'title_image.jpeg')


if (!fs.existsSync(PDF_PATH) || !fs.existsSync(TITLE_IMAGE)) {

    console.error('проверьте что файлы обложки и документ лежат в папке')

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}


// ===== КОМАНДА /START =====

bot.start(async (ctx) => {
        await ctx.replyWithPhoto(Input.fromLocalFile(TITLE_IMAGE), {
            caption: 'Я помогу тебе формировать полезные привычки и отслеживать свой прогресс.\n\n📕 Я подготовила для тебя PDF-гайд\n\nНажми кнопку ниже, чтобы получить его 👇',
            has_spoiler: false,
            ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            '📥 Скачать PDF',
                            'download_pdf'
                        )
                    ]
            ])
        })
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