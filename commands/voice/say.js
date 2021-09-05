const { getAudioUrl } = require('google-tts-api')

module.exports = {
    name: 'say',
    aliases: ['s', 'talk', 'tts', 'speak'],
    description: 'Make bot talks in VC',
    usage: '<message>',
    cooldown: 10,
    execute(msg, args, client) {
        if(msg.member.voice.channelId == null) return msg.reply('You are not connected to a voice channel.')
        if(!args[0]) return msg.reply('Message needed for the bot to talk!')
        if(args.join(' ').length > 200) return msg.reply('It seems like that your message has went over the 200 character limit. Try with a shorter one.')


        //var audioURL = `http://translate.google.com/translate_tts?tl=${settings.lang}&q=${encodeURIComponent(msg.author.username + ' nói ' + args.join(' '))}&client=t`

        const audioURL = getAudioUrl(msg.author.username + ' nói ' + args.join(' '), {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000
        })
        
        try {
            msg.member.voice.join().then(connection => {
                const dispatcher = connection.play(audioURL);
                dispatcher.on('finish', () => {
                    console.log('Talked! ' + args.join(' '))
                })
            })
        } catch(err) {console.log(err); msg.reply('Voice action caught an exception. Please try again!')}
    }
}