import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Link from 'next/link';
import Head from 'next/head';
import socket from '../client/Socket';

const Result = () => {
  const cookies = new Cookies();
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      if (router.query.session_id) {
        axios.get(router.query.session_id ? `/api/checkout_sessions/${router.query.session_id}` : null).then((res) => {
          setData(res.data);
        });
      }
    }
  }, [router.isReady]);
  useEffect(() => {
    if (data?.payment_intent.status === 'succeeded') {
      socket.emit('payment', data.id, data.payment_intent.amount, cookies.get('id'));
    }
  }, [data]);
  if (data === null) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>Płatność | mechanikBET</title>
      </Head>
      <div className="page-container">
        {data.payment_intent.status === 'succeeded' ? (
          <div>
            <h3>Dziękujemy za wsparcie :)</h3>
            <Link href="/">
              <button>Strona główna</button>
            </Link>
          </div>
        ) : (
          <div>
            <h3>Nie mogliśmy przyjąć płatności</h3>
            <Link href="/">
              <button>Strona główna</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
