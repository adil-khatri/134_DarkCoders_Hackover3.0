/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {SyncLoader} from 'react-spinners';
import './users.scss';
import {css} from '@emotion/react';

const ShowUsersList = (props) => {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  // var count=0;
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  let sessionData = {
    username: props.username,
    wallet: props.wallet,
  };
  function post_count(username1, count) {
    // posts.filter(username => username.includes(username1))
    posts.map((username) => {
      if (username.username === username1) {
        count = count + 1;
      }
    });
    return count;
  }
  const [posts, setPosts] = useState([]);
  const getUsersData = async () => {
    await axios
      .get('https://jinx-social.herokuapp.com/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPosts = async () => {
    await axios.get('https://jinx-social.herokuapp.com/').then((res) => {
      setLoading(false);
      setPosts(res.data.doc);
      console.log(posts);
    });
  };

  useEffect(() => {
    document.title = 'Users';
    getUsersData();
    getPosts();
  }, []);

  return (
    <>
      <section className="users">
        {loading === true ? (
          <>
            {' '}
            <div className="spinner">
              <center>
                <br />
                <SyncLoader
                  color="#ffffff"
                  loading={loading}
                  css={override}
                  size={50}
                />
                <br />
                <h2>Loading Users Data Please be patient......</h2>
              </center>
            </div>
          </>
        ) : (
          <>
            <ul>
              {users.map((user) => (
                <>
                  {user.username === sessionData.username ? (
                    <></>
                  ) : (
                    <>
                      <li key={user._id}>
                        <div className="user">
                          <div
                            className="user-profile"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}>
                            {user.profile_url === null ? (
                              <>
                                <img
                                  alt={user.username}
                                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  alt={user.username}
                                  src={user.profile_url}
                                />
                              </>
                            )}
                          </div>
                          <div className="user-info">
                            <span>{user.username}</span>
                            <span>{user.wallet}</span>
                            <div className="counts">
                              <span>
                                {post_count(user.username, 0)}
                                <br />
                                Posts + NFTs
                              </span>
                              <span>
                                {user.followers.length}
                                <br />
                                Followers
                              </span>
                            </div>
                            <center>
                              <a href={`/${user.wallet}`}>
                                <button>View Profile</button>
                              </a>
                            </center>
                          </div>
                        </div>
                      </li>
                    </>
                  )}
                </>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
};

export default ShowUsersList;
