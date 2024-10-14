const axios = require('axios');
const fs = require('fs');
const isURL = u => /^http(|s):\/\//.test(u);
exports.config = {
  name: 'autodownfb',
  version: '1',
  hasPermssion: 0,
  credits: 'Công Nam',//Lam Lai Down Fb Le Tuan Vy
  description: '',
  usePrefix: false,
  commandCategory: 'Tiện Ích',
  usages: [],
  cooldowns: 3
};
exports.handleEvent = async function(o) {
  try {
    const str = o.event.body;
    const send = msg => o.api.sendMessage(msg, o.event.threadID);
    const head = app => `[  ${app} - DownLoad  ]\n`;
    if (/fb|facebook/.test(str)) {
        const res = (await axios.get(`https://j2download.net/api/facebook/media?url=${str}`)).data;
        let attachment = [];
        if (res.attachments && res.attachments.length > 0) {
          if (res.attachments[0].type === 'Video') {
            for (const vdat of res.attachments) {
              const videoUrl = vdat.url.sd || vdat.url.hd;
              attachment.push(await streamURL(videoUrl, 'mp4'));
            }
          } else if (res.attachments[0].type === 'Photo') {
            for (const attachmentItem of res.attachments) {
                const urlImg = attachmentItem.url;
                attachment.push(await streamURL(urlImg, 'jpg'));
            }
          }
          send({
            body: `${head('FaceBook')}Tiêu Đề: ${res.message || "Không Có Tiêu Đề"}\n`,
            attachment
          });
        }
    }
  } catch (e) {
    console.log('Error', e);
  }
 };
exports.run = () => {};

function streamURL(url, type) {
  return axios.get(url, {
    responseType: 'arraybuffer'
  }).then(res => {
    const path = __dirname + `/cache/${Date.now()}.${type}`;
    fs.writeFileSync(path, res.data);
    setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
    return fs.createReadStream(path);
  });
          }
