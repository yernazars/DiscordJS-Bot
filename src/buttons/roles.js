const { Translate } = require('../process_tools');

module.exports = async({ inter }) => {
    let message;
    const role = inter.guild.roles.cache.get(inter.customId);
    const hasRole = inter.member.roles.cache.has(role.id);
    if(hasRole){
        await inter.member.roles.remove(role);
        message = await Translate(`Role has been removed`);
        return inter.editReply({ content: message });
    }
    await inter.member.roles.add(role);
    message = await Translate(`Role has been assigned`);
    return inter.editReply({ content: message });
}