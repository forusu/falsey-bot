exports.run = async (client, message) => {

    let init = Date.now()
    let msg = await message.channel.send("/");
    await msg.edit("💛 I think that my ping is: " + (Date.now() - init) + "ms")

}

exports.conf = {
    permLevel: "User"
}