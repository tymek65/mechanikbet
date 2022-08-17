import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import socket from '../client/Socket';
import LoadingView from '../components/LoadingView';
import { Context } from '../client/AuthContext';

const Result = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const {
    user: { id },
  } = useContext(Context);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.session_id) {
        axios
          .get(router.query.session_id ? `/api/checkout_sessions/${router.query.session_id}` : null)
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.log();
            setError(err.response.data.message);
          });
      }
    }
  }, [router.isReady, router.query.session_id]);
  useEffect(() => {
    if (data?.payment_intent.status === 'succeeded') {
      socket.emit('payment', data.id, data.payment_intent.amount, id);
    }
  }, [data, id]);
  if (!data & !error) {
    return <LoadingView />;
  }
  return (
    <>
      <Head>
        <title>Płatność | mechanikBET</title>
      </Head>
      {error ? <h3>Nie mogliśmy przyjąć płatności</h3> : <div>{data.payment_intent.status === 'succeeded' ? <h3>Dziękujemy za wsparcie :)</h3> : <h3>Nie mogliśmy przyjąć płatności</h3>}</div>}
    </>
  );
};

export default Result;
