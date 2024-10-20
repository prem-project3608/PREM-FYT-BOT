module.exports.config = {
    name: "uidall",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT WAS MADE BYR PREM BABU",
    commandCategory: "ALL UID",
    cooldowns: 2,
};
module.exports.run = async function ({ api, event, args, Users }) {
  
  function reply(d) {
    api.sendMessage(d, event.threadID, event.messageID)
  }
  var ep = event.participantIDs;
  msg = ""
  msgs = ""
  m = 0;
  for (let i of ep) {
    m += 1;
    const name = await Users.getNameUser(i);
    msg += m+". "+name+"\nUID: "+i+"\n\n";
  }
  msgs += "List of all UID's in this group.\n\n"+msg;
  reply(msgs)
}
