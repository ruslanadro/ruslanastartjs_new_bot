const TelegramBot = require('node-telegram-bot-api');
const instaloader = require('instaloader');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = 'YOUR_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Create an instance of Instaloader class
const L = new instaloader.Instaloader();

// Random responses for the bot
const randomResponses = [
    "Hello!",
    "Hi there!",
    "How can I assist you?",
    "Greetings!",
    "Hey, what's up?"
];

// Function to select a random response
function getRandomResponse() {
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    return randomResponses[randomIndex];
}

// Listen for any kind of message
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Check if the message is a command
    if (text.startsWith('/start')) {
        bot.sendMessage(chatId, 'Welcome! You can use commands like /profile, /posts, /unfollow');
    } else if (text.startsWith('/profile')) {
        // Extract username from the command
        const username = text.split(' ')[1];
        if (!username) {
            bot.sendMessage(chatId, 'Please provide a username.');
            return;
        }

        try {
            // Obtain profile metadata
            const profile = await instaloader.Profile.from_username(L.context, username);
            // Send basic profile information to the chat
            bot.sendMessage(chatId, `Username: ${profile.username}\nFull Name: ${profile.full_name}\nBio: ${profile.biography}\nFollowers: ${profile.followers}\nFollowing: ${profile.followees}\nPosts: ${profile.mediacount}`);
        } catch (error) {
            bot.sendMessage(chatId, 'Error fetching profile information.');
        }
    } else if (text.startsWith('/posts')) {
        // Extract username from the command
        const username = text.split(' ')[1];
        if (!username) {
            bot.sendMessage(chatId, 'Please provide a username.');
            return;
        }

        try {
            // Obtain profile metadata
            const profile = await instaloader.Profile.from_username(L.context, username);
            // Send recent posts to the chat
            const posts = await profile.get_posts();
            posts.forEach((post, index) => {
                bot.sendMessage(chatId, `Post ${index + 1}: ${post.url}`);
            });
        } catch (error) {
            bot.sendMessage(chatId, 'Error fetching posts.');
        }
    } else if (text.startsWith('/unfollow')) {
        // Implement unfollow functionality here
        bot.sendMessage(chatId, 'Unfollow functionality is not implemented yet.');
    } else {
        // Send a random response
        bot.sendMessage(chatId, getRandomResponse());
    }
});
