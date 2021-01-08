const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const prefix = require('./config.json').prefix;
const token = require('./config.json').token;
const ffmpeg = require("ffmpeg-static");



const client = new Discord.Client();

var stateofmusic;

setInterval(() => {
    if(queue.nowplayng[0] == undefined) {
        stateofmusic = 'no esta sonando nada...';
    } else {
        stateofmusic = queue.nowplayng[0]
    }
    client.user.setActivity(` !play, sonando: ${stateofmusic}`);
}, 5000)

client.on("ready", () => {
   console.log(`


   <---------------------------------------->

   Bot iniciado con el nombre ${client.user.username}

   <---------------------------------------->
   
   `);
   client.user.setStatus('Online') // ► op!help en DIRECTO
   //client.user.setActivity(` !play, sonando: ${stateofmusic}`);
   //client.user.setActivity(` COMO CREAUR TU BOT DE MUSICA`, { url: 'https://www.twitch.tv/adriabama06/', type: 'STREAMING' });
});

var queue = {
    nowplayng: [],
    list: []
};
var disp;

client.on("message", async (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

  if(message.content.startsWith(prefix)) {

    if(command == 'play' || command == 'p') {
        if (message.member.voice.channel) {
            async function play() {
                const connection = await message.member.voice.channel.join();
                const dispatcher = connection.play(await ytdl(queue.list[0], { filter: 'audio' }));
                disp = dispatcher;
        
                dispatcher.on('start', async () => {
                    queue.nowplayng[0] = queue.list[0];
                    await queue.list.shift();
                });

                dispatcher.on('finish', async () => {
                    if(!queue.nowplayng[0]) {
                        var m = await message.channel.send('No queda ninguna cancion...');
                        queue.list = [];
                        queue.nowplayng = [];
                        dispatcher.destroy();
                        connection.disconnect();
                        message.member.voice.channel.leave();
                        await m.delete({ timeout: 5000 })
                        return
                    } else {
                        play();
                    }
                });
            }


            if(args[0]) {
                if(!queue.nowplayng[0]) {
                    queue.list.push(`${args.slice(0).join(' ')}`);
                    play();
                } else {
                    queue.list.push(`${args.slice(0).join(' ')}`);
                    var m = await message.channel.send(`Se añadio a la cola ${args.slice(0).join(' ')}`)
                    await m.delete({ timeout: 5000 });
                    return
                }
            } else {
                var m = await message.channel.send('Debes de poner un **Link de YouTube**')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'volume' || command == 'v') {
        if (message.member.voice.channel) {
            if(!args[[0]]) {
                if(!queue.nowplayng[0]) {
                    var m = await message.channel.send('No hay ninguna cancion')
                    await m.delete({ timeout: 5000 });
                    return
                } else {
                    let nowvolume = disp.volume;
                    var m = await message.channel.send(`Volumen acutal es: ${nowvolume * 100}`)
                    await m.delete({ timeout: 5000 });
                    return
                }
            } else {
                if(!queue.nowplayng[0]) {
                    var m = await message.channel.send('No hay ninguna cancion')
                    await m.delete({ timeout: 5000 });
                    return
                } else {
                    const uservolume = Number.parseInt(args[0]);
                    disp.setVolume(uservolume / 100);
                    var m = await message.channel.send(`El volumen se seteo a: ${uservolume}`)
                    await m.delete({ timeout: 5000 });
                    return
                }
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'pause' || command == 'pa') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                disp.pause(true);
                var m = await message.channel.send('Se pauso la musica')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'resume' || command == 'r') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                disp.resume();
                var m = await message.channel.send('Se resumio la musica')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'now' || command == 'song') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                var m = await message.channel.send(`Ahora esta sonando: ${queue.nowplayng[0]}`)
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'skip' || command == 's') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                disp.emit('finish');
                var m = await message.channel.send('Se salto de cancion')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'clear-queue' || command == 'cq') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                queue.list = [];
                var m = await message.channel.send('Se elimino la queue')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'stop' || command == 'end') {
        if (message.member.voice.channel) {
            if(!queue.nowplayng[0]) {
                var m = await message.channel.send('No hay ninguna cancion')
                await m.delete({ timeout: 5000 });
                return
            } else {
                queue.list = [];
                queue.nowplayng = [];
                disp.emit('finish');
                var m = await message.channel.send('Se paro la musica y se elimino la queue')
                await m.delete({ timeout: 5000 });
                return
            }
        } else {
            var m = await message.channel.send('Debes de estar en un canal de voz')
            await m.delete({ timeout: 5000 });
            return
        }
    }

    if(command == 'queue' || command == 'q') {
        if(!args[0]) {
            function mapas(contenido) {
                let q = contenido.map((song, i) => {
                return `${i === 0 ? '1' : `${i+1}`} -> ${song}`
            }).join('\n\n');       
                return `${q}`
            }

            if(!queue.list[0]) {
                var m = await message.channel.send('No hay ninguna queue usa !now o !song para ver cual esta sonando ahora')
                await m.delete({ timeout: 5000 });
                return
            } else {

                var playngnow;

                if(queue.nowplayng[0] == undefined) {
                    playngnow = 'No hay ninguna cancion sonando...';
                } else {
                    playngnow = `${queue.nowplayng[0]}`;
                }


            const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle('Queue')
            .setTimestamp()
            .setDescription(`\nAhora -> ${playngnow}
            
            ${mapas(queue.list)}`);
            
            var m = await message.channel.send(embed)
            await m.delete({ timeout: 30000 });
            return
            }
        } else {
            queue.list.push(`${args.slice(0).join(' ')}`);
            var m = await message.channel.send('Se añadio **`' + args.slice(0).join(' ') + '`** a la lista de la queue')
            await m.delete({ timeout: 5000 });
            return
        }
       }
  }
});


client.login(token);
