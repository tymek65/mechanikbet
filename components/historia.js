import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
const Historia = () => {
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const cookies = new Cookies();
  const colors = ['FF9CEE', 'B28DFF', '6EB5FF', 'E7FFAC', 'FFABAB', 'BFFCC6', '85E3FF', 'AFF8DB', 'F3FFE3', 'ACE7FF', 'D5AAFF', 'C4FAF8', 'AFCBFF', 'FFFFD1'];
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/historiapunktows?_sort=data:ASC`, {
        headers: {
          Authorization: `Bearer ${cookies.get('token')}`,
        },
      })
      .then((response1) => {
        axios
          .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?_sort=punkty:DESC&punkty_gte=0`, {
            headers: {
              Authorization: `Bearer ${cookies.get('token')}`,
            },
          })
          .then((response2) => {
            setLoading(false);
            for (const data of response1.data) {
              setChartData((prev) => [...prev, data.uzytkownicy]);
            }
            for (const [i, user] of response2.data.entries()) {
              let x = 0;
              setUsernames((prev) => [
                ...prev,
                {
                  username: user.username,
                  show: user.username === cookies.get('username') ? true : false,
                  color: '#' + colors[i],
                },
              ]);
            }
          });
      });
  }, []);

  if (loading === null) {
    return <div>Loading</div>;
  }

  return (
    <>
      {chartData.length > 0 && (
        <>
          <Flex display={['none', 'none', 'flex']} flex="1 0 auto" alignItems="center" justifyContent="center" flexDirection="column">
            <ResponsiveContainer width="90%" height="80%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D3748',
                    border: '1px solid #4A5568',
                    borderRadius: '5px',
                  }}
                />

                {usernames.map((user, index) => {
                  return <Line key={index} strokeWidth={2} type="monotone" dataKey={user.username} stroke={user.color} connectNulls hide={user.show ? false : true} />;
                })}

                <Legend
                  onClick={(e) => {
                    setUsernames((prev) =>
                      prev.map((user) => {
                        if (user.username === e.dataKey) {
                          user.show = !user.show;
                        }
                        return user;
                      })
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>

            <Flex>
              <Button
                mx="1"
                onClick={() => {
                  setUsernames((prev) =>
                    prev.map((user) => {
                      user.show = true;
                      return user;
                    })
                  );
                }}
              >
                Pokaż wszystkich
              </Button>
              <Button
                mx="1"
                onClick={() => {
                  setUsernames((prev) =>
                    prev.map((user) => {
                      if (user.username !== cookies.get('username')) {
                        user.show = false;
                      }
                      return user;
                    })
                  );
                }}
              >
                Ukryj wszystkich
              </Button>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

export default Historia;
