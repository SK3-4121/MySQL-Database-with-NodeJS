const Discord = require("discord.js")
const mysql = require("mysql2")

const Prefix = "/"
const Token = "Token"
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

const connection = mysql.createConnection({
  host: "192.168.1.65",
  user: "database",
  password: "Maximus22!!",
  database: "maindb"
});

function isCommand(command, message) {
  var command = command.toLowerCase()
  var content = message.content.toLowerCase()
  return content.startsWith(Prefix + command)
}

function emebed(header, desc) {
  const emebed_message = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(header)
    .setDescription(desc)
    .setTimestamp()
    .setFooter('Made by <@781337038040727583>', 'https://cdn.discordapp.com/avatars/781337038040727583/83f0611edff70eabe94ae0a2cf8d6ecf.webp?size=32');
  return emebed_message
}

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`)
  bot.user.setActivity(' your every move', {type: 'WATCHING'})
});

bot.on("message", (message) => {
  if (message.author.bot) return;
    let args = message.content.split(/[ ]+/);

    if (isCommand("Search", message)) {
      if (args[1]) {
        try {
          connection.query(`SELECT * FROM pet WHERE owner = "${args[1]}"`, function(err, rows) {
            try {
              message.reply({embeds: [ emebed("Success!", `Found the persons pets name ${rows[0].name}`)]})
            } catch(er) {
              message.reply("Failed: That table was not found.")
            }
          });
        } catch(err) {
          message.reply("Error table not found")
        }
      } else {
        message.reply("You didn't passthough a name argument.")
    }
  }

  if (isCommand("List", message)) {
    if (args[1]) {
        connection.query(`select * from ${args[1]}`, function(err, rows) {
          try {
            let new_String = ""
            for (i = 0; i < rows.length; i++) {
              new_String += `Name: ${rows[i].name}\nOwner: ${rows[i].owner}\nspecies: ${rows[i].species}\nGender(0=Male,1=Female): ${rows[i].sex}\n\n\n`
            }
            message.reply({embeds: [ emebed("Success!", new_String) ]})
            new_String = ""
          } catch {
            message.reply({embeds: [ emebed("Failed", `There are not colonms found under ${args[1]}.`)]})
          }
        }
      );
    } else {
      message.reply("You didn't passthough a name argument.")
    }
  }

  let Create_Command = `INSERT INTO pet (name, owner, species, sex, birth, death)`
  if (isCommand("Create", message)) {
    connection.query(`SELECT * FROM pet WHERE owner = "${message.author.id}"`, function(err, rows) {
      var pass = false

      try {
        if (message.author.id != rows[0].owner) {
          pass = true
        } else {
          console.log("yes something did something")
        }
      } catch(err) {
        pass = true
      }

      if (pass == true) {
        if (args[1] && args[2] && args[3]) {
          const Name = args[1]
          const Species = args[2]
          const conv_gender = args[3]
    
          connection.connect(function(err) {
            const sql = `${Create_Command} values("${Name}", "${message.author.id}", "${Species}", ${conv_gender}, NOW(), NOW());`
            console.log(sql)
            connection.query(sql, function (err, result) {
              message.reply({embeds: [ emebed("Success!", `Added user ${Name} Owner ${message.author} Gender(0=Male,1=Female) ${conv_gender}`)]})
            });
          });
        } else {
          message.reply("Failed: Invalid Arguments.")
        }
      } else {
        message.reply("Failed: No you already have a pet.")
      }
    });
  }
});

bot.login(Token)
