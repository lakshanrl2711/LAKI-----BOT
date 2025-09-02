const { cmd } = require("../command");
const { Sticker } = require("wa-sticker-formatter"); // make sure to install this or your Sticker library
const { downloadMediaMessage } = require("../lib/msg.js"); // Adjust the path as needed
const fs = require("fs");

cmd(
  {
    pattern: "toimg",
    alias: ["img", "photo"],
    desc: "Convert a sticker to an image",
    category: "utility",
    filename: __filename,
  },
  async (
    lakshan,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      // Ensure the message contains a sticker to convert
      if (!quoted || !quoted.stickerMessage) {
        return reply("🙇‍♂️ Please reply to a sticker to convert it to an image.");
      }

      // Download the sticker from the quoted message
      const stickerBuffer = await downloadMediaMessage(quoted, "stickerInput");
      if (!stickerBuffer)
        return reply("😓 Failed to download the sticker. Try again!");

      // Convert the sticker buffer to an image using Sticker class
      const sticker = new Sticker(stickerBuffer, {
        pack: "🄻🄰🄺🅂🄷🄰🄽",
        author: "🄻🄰🄺🅂🄷🄰🄽",
        type: "FULL", // Full sticker format
        quality: 100, // Output quality
      });

      // Get the image buffer
      const imageBuffer = await sticker.toBuffer({ format: "image/jpeg" });

      // Send the image as a response
      await lakshan.sendMessage(
        from,
        {
          image: imageBuffer,
          caption: "Here is your converted image!\n\n🄻🄰🄺🅂🄷🄰🄽",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);

