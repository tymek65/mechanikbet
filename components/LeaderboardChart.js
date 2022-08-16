import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { Context } from '../client/AuthContext';
import { useQuery } from 'react-query';
const LeaderboardChart = () => {
  const [users, setUsers] = useState([]);
  const {
    user: { username, jwt },
  } = useContext(Context);

  const colors = ['#FF9CEE', '#B28DFF', '#6EB5FF', '#E7FFAC', '#FFABAB', '#BFFCC6', '#85E3FF', '#AFF8DB', '#F3FFE3', '#ACE7FF', '#D5AAFF', '#C4FAF8', '#AFCBFF', '#FFFFD1', '#FFFFD1'];

  const { isLoading: isChartDataLoading, data: chartData } = useQuery('chartData', async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/historiapunktows?_sort=data:ASC`);
    return data.map((x) => x.uzytkownicy);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?_sort=punkty:DESC&punkty_gte=0`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUsers(data.map((userData, index) => ({ username: userData.username, show: userData.username === username })));
    };
    fetchUsers();
  }, [jwt, username]);

  return (
    <>
      {!isChartDataLoading && (
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

                {users.map((user, index) => {
                  return <Line key={index} strokeWidth={2} type="monotone" dataKey={user.username} stroke={colors[index]} connectNulls hide={!user.show} />;
                })}

                <Legend
                  onClick={(e) => {
                    setUsers((prev) =>
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
                  setUsers((prev) =>
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
                  setUsers((prev) =>
                    prev.map((user) => {
                      if (user.username !== username) {
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

export default LeaderboardChart;
