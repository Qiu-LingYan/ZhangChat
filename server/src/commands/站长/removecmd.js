import * as UAC from '../utility/UAC/_info';

export function init(core){
  if (typeof core.removedCommands !== 'object'){
    core.removedCommands = []
  }
}

// module main
export async function run(core, server, socket, data) {
  // increase rate limit chance and ignore if not admin
  if (!UAC.isAdmin(socket.level)) {
    server.reply({
      cmd:'warn',
      text:'权限不足，无法操作！'
    },socket)
    return server.police.frisk(socket.address, 20);
  }
  if (typeof data.command !== 'string'){
    return true
  }
  if (core.commands.commands.filter((cmd) => cmd.info.name === data.command).length === 0){
    return server.reply({
      cmd:'warn',
      text:'找不到您要移除的命令！'
    },socket)
  }
  if (data.command == 'addcmd'){
    return server.reply({
      cmd:'warn',
      text:'哥们儿！什么命令都可以移除，唯独addcmd命令不能移除！！！'
    },socket)
  }
  var badCommands = core.commands.commands.filter((cmd) => cmd.info.name === data.command)
  var i = 0
  for (i in badCommands){
    core.removedCommands.push(badCommands[i])
  }
  core.commands.commands = core.commands.commands.filter((cmd) => cmd.info.name !== data.command)
  server.loadHooks()
  // send results to moderators (which the user using this command is higher than)
  server.broadcast({
    cmd: 'info',
    text: `已移除 ${data.command} 命令`,
  }, {});
  return true;
}

export const requiredData = ['command'];
export const info = {
  name: 'removecmd',
  description: '从内存中移除一个命令',
  usage: `
    API: { cmd: 'removecmd', command: '<目标命令的名称>' }
    文本：以聊天形式发送 /removecmd 目标命令的名称`,
  fastcmd:[
    {
      name:'command',
      len:1
    }
  ]
};
