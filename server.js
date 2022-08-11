require('dotenv').config();
const app = require('express')();
const http = require('http').Server(app);
const axios = require('axios');
const fs = require('fs');
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});
const port = process.env.PORT || 4299;
let jwt;
let count = 1;

axios
  .post('https://betsapi.sraka.online/auth/local', {
    identifier: process.env.ACCNAME,
    password: process.env.PASSWORD,
  })
  .then((response) => {
    jwt = response.data.jwt;
  })
  .catch((error) => {
    console.log(error.response.data.error);
  });
setInterval(() => {
  if (count === 13) {
    count = 1;
  }
  axios
    .get('https://betsapi.sraka.online/users', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res) => {
      fs.writeFile(__dirname + `/backups/backup${count}.json`, JSON.stringify(res.data, null, 2), function (err) {
        if (err) throw err;
        console.log('saved');
      });
    });

  count++;
}, 1000 * 60 * 60 * 4);

setInterval(() => {
  axios
    .get('https://betsapi.sraka.online/users?punkty_gte=0', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res) => {
      const savedata = {};

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const currentdate =
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        ' ' +
        (hours < 10 ? '0' + hours : hours) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds);

      savedata.data = currentdate;
      for (const user of res.data) {
        savedata[user.username] = user.punkty;
      }
      axios.post(
        'https://betsapi.sraka.online/historiapunktows',
        {
          data: currentdate,
          uzytkownicy: savedata,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
    });
}, 1000 * 60 * 60 * 24);

io.on('connection', (socket) => {
  socket.on('payment', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3);
    axios
      .get(`https://betsapi.sraka.online/payments?paymentid=${arg1}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        if (response.data.length <= 0) {
          let punkty = 0;
          axios
            .post(
              'https://betsapi.sraka.online/payments',
              {
                paymentid: arg1,
              },
              {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
            )
            .catch((error) => {
              console.log(error.response.data.error);
            });
          axios
            .get(`https://betsapi.sraka.online/users/${arg3}`, {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then((response) => {
              console.log(response.data.balance);
              punkty = response.data.punkty;
            })
            .then(() => {
              if (punkty < 500) {
                axios
                  .put(
                    `https://betsapi.sraka.online/users/${arg3}`,
                    {
                      punkty: punkty + arg2 < 500 ? punkty + arg2 : 500,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${jwt}`,
                      },
                    }
                  )
                  .catch((error) => {
                    console.log(error.response.data.error);
                  });
              }
            })
            .catch((error) => {
              console.log(error.response.data.error);
            });
        }
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  });
  socket.on('bet', (data) => {
    if (data.opcja && data.zaklad && data.wartosc && data.id && data.opcja1 && data.opcja2 && data.opcja) {
      if (data.wartosc < 0) {
        io.to(socket.id).emit('notenoughpoints', null);
        return;
      }
      axios
        .get(`https://betsapi.sraka.online/zakladies/${data.zaklad}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response1) => {
          if (response1.data.betactive === true) {
            let punkty = 0;
            axios
              .get(`https://betsapi.sraka.online/users/${data.id}`, {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
              .then((response) => {
                if (response.status === 200) {
                  punkty = response.data.punkty - data.wartosc;

                  if (punkty >= 0) {
                    const betdata = {
                      opcja: data.opcja,
                      zaklady: data.zaklad,
                      wartosc: data.wartosc,
                      user: data.id,
                      kurs: data.opcja == 1 ? data.opcja1 : data.opcja2,
                      stanprzedzakladem: response.data.punkty,
                    };
                    console.log(betdata);
                    axios
                      .post('https://betsapi.sraka.online/kuponies', betdata, {
                        headers: {
                          Authorization: `Bearer ${jwt}`,
                        },
                      })
                      .then((response) => {
                        if (response.status === 200) {
                          io.emit('betplaceed', data.zaklad);
                          io.to(socket.id).emit('betsuccessful', null);
                          axios
                            .put(
                              `https://betsapi.sraka.online/users/${data.id}`,
                              {
                                punkty: punkty,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            )
                            .then((response) => {
                              io.to(socket.id).emit('points', punkty);
                            });
                        }
                      })
                      .catch((error) => {
                        console.log(error.response.data.error);
                      });
                  } else {
                    io.to(socket.id).emit('notenoughpoints', null);
                  }
                }
              })
              .catch((error) => {
                console.log(error.response.data.error);
              });
          } else {
            io.to(socket.id).emit('betnotactive', null);
          }
        });
    }
  });
  socket.on('betclose', (arg1, arg2) => {
    axios
      .get(`https://betsapi.sraka.online/zakladies/${arg1}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.active === false) {
            io.to(socket.id).emit('betnotactive', null);
            return;
          } else if (response.data.active === true) {
            let gracze = [];
            axios
              .get(`https://betsapi.sraka.online/kuponies?zaklady.id=${arg1}&active=true`, {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
              .then((response) => {
                if (response.status === 200) {
                  let punkty = {};
                  for (let i = 0; i < response.data.length; i++) {
                    gracze[i] = {
                      kupon: response.data[i].id,
                      gracz: response.data[i].user.id,
                      opcja: response.data[i].opcja,
                      wartosc: response.data[i].wartosc,
                      kurs: response.data[i].kurs,
                    };
                    punkty[response.data[i].user.id] = { ilosc: 0 };
                  }
                  for (const gracz of gracze) {
                    // console.log(gracz.gracz);
                    axios
                      .get(`https://betsapi.sraka.online/users/${gracz.gracz}`, {
                        headers: {
                          Authorization: `Bearer ${jwt}`,
                        },
                      })
                      .then((response) => {
                        if (response.status === 200) {
                          console.log(response.data.punkty);
                          if (arg2 === 'cancel') {
                            if (punkty[gracz.gracz].ilosc > 0) {
                              punkty[gracz.gracz].ilosc = punkty[gracz.gracz].ilosc + gracz.wartosc;
                            } else {
                              punkty[gracz.gracz].ilosc = response.data.punkty + gracz.wartosc;
                            }
                          } else {
                            if (punkty[gracz.gracz].ilosc <= 0) {
                              punkty[gracz.gracz].ilosc = gracz.opcja === arg2 ? response.data.punkty + gracz.wartosc * gracz.kurs : response.data.punkty;
                            } else {
                              punkty[gracz.gracz].ilosc = gracz.opcja === arg2 ? punkty[gracz.gracz].ilosc + gracz.wartosc * gracz.kurs : punkty[gracz.gracz].ilosc;
                            }
                          }
                          punkty[gracz.gracz].ilosc = Math.round(punkty[gracz.gracz].ilosc * 100) / 100;

                          if (arg2 === 'cancel') {
                            axios.put(
                              `${url}/users/${gracz.gracz}`,
                              {
                                punkty: punkty[gracz.gracz].ilosc,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            );
                          }
                          if (gracz.opcja === arg2) {
                            axios.put(
                              `https://betsapi.sraka.online/users/${gracz.gracz}`,
                              {
                                punkty: punkty[gracz.gracz].ilosc,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            );
                          }

                          const date = new Date();
                          const dateISO = date.toISOString();

                          axios.put(
                            `https://betsapi.sraka.online/kuponies/${gracz.kupon}`,
                            {
                              active: false,
                              wygrany: arg2 === gracz.opcja ? true : false,
                              datarozdania: dateISO,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${jwt}`,
                              },
                            }
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error.response.data.error);
                      });
                  }
                }
              })
              .then(() => {
                io.to(socket.id).emit('betresolved', arg1);
                axios.put(
                  `https://betsapi.sraka.online/zakladies/${arg1}`,
                  {
                    active: false,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${jwt}`,
                    },
                  }
                );
              })
              .catch((error) => {
                console.log(error.response.data.error);
              });
          }
        }
      });
  });
  console.log('a user connected');
  io.to(socket.id).emit('connected', socket.id);
  socket.on('closebet', (id) => {
    axios
      .put(
        `https://betsapi.sraka.online/zakladies/${id}`,
        {
          betactive: false,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          io.to(socket.id).emit('closegit', null);
        }
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  });
  socket.on('request rate', (id) => {
    axios
      .get(`https://betsapi.sraka.online/kuponies?_where[0][zaklady]=${id}&_where[1][opcja]=2&_where[3][user.username_ne]=jakub-tymowski&_where[4][user.username_ne]=adrian-hassa`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        axios
          .get(`https://betsapi.sraka.online/kuponies?_where[0][zaklady]=${id}&_where[1][opcja]=1&_where[3][user.username_ne]=jakub-tymowski&_where[4][user.username_ne]=adrian-hassa`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((res1) => {
            io.to(socket.id).emit('rate', {
              bet: id,
              rate1: res1.data.length,
              rate2: res.data.length,
            });
          });
      });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
