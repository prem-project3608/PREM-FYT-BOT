  const axios = require('axios');
  const fs = require('fs');

  const isURL = u => /^http(|s):\/\//.test(u);

  exports.handleEvent = async function(o) {
      try {
          const str = o.event.body;
          const send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
          const head = app => `==『 AUTODOWN ${app.toUpperCase()} 』==\n────────────────`;
       // const head = app => '';

          if (isURL(str)) {
              if (/fb|facebook/.test(str)) {
                  const json = await infoPostFb(str);
                  const body = `${head('FACEBOOK')}\n- Tiêu Đề: ${json.message}`;
                  const fil = type => json.attachment.filter($=>$.__typename == type);
                  const photo = fil('Photo');
                  const video = fil('Video');

                  const attachment = [];
                  for (const i of photo) {
                      try {
                          const img = i.photo_image || i.image || {};
                          attachment.push(await streamURL(img.uri, 'jpg'));
                      } catch {
                          continue;
                      }
                  }
                  if (attachment.length > 0) {
                      await send({
                          body, attachment
                      });
                  }

                  for (const i of video) {
                      try {
                          send({
                              body, attachment: await streamURL(i.browser_native_hd_url || i.browser_native_sd_url, 'mp4'),
                          });
                      } catch {
                          continue;
                      }
                  }
              } 
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TIKTOK */ 
        
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO YOUTUBE */ 
        
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO IBB */ 
        else if (/ibb\.co/.test(str)) {
           send({body: `${head('IMGBB')}\n`,attachment: await streamURL(str, str.split('.').pop()) })
                }
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO IMGUR */ 
        else if (/imgur\.com/.test(str)) {
                  send({body: `${head('IMGUR')}\n`,
                      attachment: await streamURL(str, str.split('.').pop())
                  })
              } 
        /*AUTODOWN CAPCUT VIIDEO */
        else if (/capcut\.com/.test(str)) {
                  var res = (await axios.get(`https://api-0703.0703-opa.repl.co/capcut?url=${str}`))
  const title = res.data.title;
  const description = res.data.description;
  const usage = res.data.usage;
  const link = res.data.videoUrl;
                    send({body: `${head('CAPCUT')}\n→ Tiêu Đề: ${title}\n→ Description : ${description}\n→ Lượt Xem : ${usage}\n`,attachment: await streamURL(link, 'mp4')})
                  }
        /* TỰ ĐỘNG TẢI ẢNH, VIDEO, AUDIO CỦA FILE CATBOX*/ 
        else if(/catbox\.moe/.test(str)){
        send({body: `${head('FILE-CATBOX')}\n`,attachment: await streamURL(str, str.split('.').pop()) })
    }
        /* TỰ ĐỘNG TẢI ẢNH HOẶC NHẠC SOUNDCLOUD */ 
        
        /* TỰ ĐỘNG TẢI NHẠC ZINGMP3 */ 
        
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO PINTEREST */ 
        else if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
                  const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${str}`);
                  send({
                      body: `${head('PINTEREST')}\n- link: ${res.data.data.image.url}`, attachment: await streamURL(res.data.data.image.url, 'jpg')});
              } 
        /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO INSTAGRAM */ 
       
          }

      } catch(e) {
          console.log('Error', e);
      }
  };
  exports.run = () => {};
  exports.config = {
      name: 'autodownVip',
      version: '1',
      hasPermssion: 0,
      credits: 'Công Nam',
      description: '',
      commandCategory: 'Tiện Ích',
      usages: [],
      cooldowns: 1
  };

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

  function infoPostFb(url) {
      return axios.get(`https://duongkum999.codes/fb/info-post?url=${url}`).then(res => res.data);
            }
  1
