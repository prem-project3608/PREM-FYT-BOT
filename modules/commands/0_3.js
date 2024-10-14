module.exports.config = {
  name: 'art',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'Dũngkon',
  description: 'Đổi ảnh thường qua ảnh anime',
  commandCategory: 'Tiện ích',
  usages: 'reply',
  cooldowns: 5,
}
var _0xf23c = [
  'run',
  'exports',
  'fs-extra',
  'nodemodule',
  'axios',
  'url',
  'attachments',
  'messageReply',
  ' ',
  'join',
  'Vui lòng reply hoặc nhập link 1 hình ảnh!!!',
  'threadID',
  'messageID',
  'sendMessage',
  'https://apidungkonuser.dungkonuwu.repl.co/imgur?link=',
  '',
  'get',
  'image',
  'uploaded',

  'data',
  'https://thieutrungkien.dev/draw?url=',
  'arraybuffer',
  'Đang Vẽ....!',
  '/cache/veanime.png',
  'utf-8',
  'from',
  'writeFileSync',
  'Ảnh vẽ anime',
  'createReadStream',
  'unlinkSync',
]
module[_0xf23c[1]][_0xf23c[0]] = async function ({
  _0x1673x1,
  _0x1673x2,
  _0x1673x3,
}) {
  const _0x1673x4 = global[_0xf23c[3]][_0xf23c[2]]
  const _0x1673x5 = require(_0xf23c[4])
  var _0x1673x6 =
    _0x1673x2[_0xf23c[7]][_0xf23c[6]][0][_0xf23c[5]] ||
    _0x1673x3[_0xf23c[9]](_0xf23c[8])
  if (!_0x1673x6) {
    return _0x1673x1[_0xf23c[13]](
      _0xf23c[10],
      _0x1673x2[_0xf23c[11]],
      _0x1673x2[_0xf23c[12]]
    )
  }
  try {
    const _0x1673x7 = await _0x1673x5[_0xf23c[16]](
      `${_0xf23c[14]}${encodeURIComponent(_0x1673x6)}${_0xf23c[15]}`
    )
    const _0x1673x8 = _0x1673x7[_0xf23c[19]][_0xf23c[18]][_0xf23c[17]]
    var _0x1673x9 = (
      await _0x1673x5[_0xf23c[16]](`${_0xf23c[20]}${_0x1673x8}${_0xf23c[15]}`, {
        responseType: _0xf23c[21],
      })
    )[_0xf23c[19]]
    _0x1673x1[_0xf23c[13]](_0xf23c[22], _0x1673x2[_0xf23c[11]])
    _0x1673x4[_0xf23c[26]](
      __dirname + `${_0xf23c[23]}`,
      Buffer[_0xf23c[25]](_0x1673x9, _0xf23c[24])
    )
    return _0x1673x1[_0xf23c[13]](
      {
        body: `${_0xf23c[27]}`,
        attachment: _0x1673x4[_0xf23c[28]](__dirname + `${_0xf23c[23]}`),
      },
      _0x1673x2[_0xf23c[11]],
      () => {
        return _0x1673x4[_0xf23c[29]](__dirname + `${_0xf23c[23]}`)
      },
      _0x1673x2[_0xf23c[12]]
    )
  } catch (e) {
    return _0x1673x1[_0xf23c[13]](
      e,
      _0x1673x2[_0xf23c[11]],
      _0x1673x2[_0xf23c[12]]
    )
  }
}
