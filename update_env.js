const { updateEnv, readEnv } = require('../lib/database');
const EnvVar = require('../lib/mongodbenv');
const { cmd } = require('../command');

cmd({
    pattern: "update",
    alias: ["updateenv"],
    desc: "Check and update environment variables",
    category: "owner",
    filename: __filename,
},
async (robin, mek, m, { from, q, reply, isOwner }) => {
    if (!isOwner) return;

    if (!q) {
        return reply("🙇‍♂️ *Please provide the environment variable and its new value.* \n\nExample: `.update ALIVE_MSG: hello i am Isara Sihilel`");
    }

    // Detect delimiter (colon or comma)
    const delimiterIndex = q.indexOf(':') !== -1 ? q.indexOf(':') : q.indexOf(',');
    if (delimiterIndex === -1) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Extract key and value
    const key = q.substring(0, delimiterIndex).trim().toUpperCase();
    const rawValue = q.substring(delimiterIndex + 1).trim();

    if (!key || !rawValue) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Split words to check if last part is mode
    const parts = rawValue.split(/\s+/);
    let newValue = rawValue;
    let finalMode = "";

    const validModes = ['public', 'private', 'groups', 'inbox'];
    const lastWord = parts[parts.length - 1].toLowerCase();

    if (validModes.includes(lastWord)) {
        finalMode = lastWord;
        newValue = parts.slice(0, -1).join(" ");
    }

    // Key specific validations
    if (key === 'MODE' && !validModes.includes(newValue.toLowerCase())) {
        return reply(`😒 *Invalid mode. Valid modes are: ${validModes.join(', ')}*`);
    }

    if (key === 'ALIVE_IMG' && !newValue.startsWith('https://')) {
        return reply("😓 *Invalid URL format. PLEASE GIVE ME IMAGE URL*");
    }

    if (key === 'AUTO_READ_STATUS' && !['true', 'false'].includes(newValue.toLowerCase())) {
        return reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*");
    }

    try {
        const envVar = await EnvVar.findOne({ key });

        if (!envVar) {
            const allEnvVars = await EnvVar.find({});
            const envList = allEnvVars.map(env => `${env.key}: ${env.value}`).join('\n');
            return reply(`❌ *The environment variable ${key} does not exist.*\n\n*Here are the existing environment variables:*\n\n${envList}`);
        }

        await updateEnv(key, newValue, finalMode);
        reply(`✅ *Environment variable updated.*\n\n🗃️ *${key}* ➠ ${newValue}${finalMode ? `\n*Mode:* ${finalMode}` : ''}`);

    } catch (err) {
        console.error('Error updating environment variable: ' + err.message);
        reply("🙇‍♂️ *Failed to update the environment variable. Please try again.*\n\nError: " + err.message);
    }
});

