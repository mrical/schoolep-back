import { API_BASE_URL } from '@/config/serverApiConfig';

import axios from 'axios';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';
import { getIdToken, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, rdb } from '@/firebase';
import { get, ref, update } from 'firebase/database';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const login = async ({ loginData }) => {
  try {
    const { email, password } = loginData;

    const user = await signInWithEmailAndPassword(auth, email, password).then(async (user) => {
      const userRef = doc(db, 'users/' + user.user.uid);
      await updateDoc(userRef, {
        lastLogin: new Date().valueOf(),
        verify: user.user.emailVerified,
      });
      const userSnapshot = await getDoc(userRef);
      return { ...user, ...userSnapshot.data() };
    });
    if (!user.admin) {
      throw Error('auth/user-not-admin');
    }

    const userIdToken = await getIdToken(auth.currentUser);
    const response = await fetch(API_BASE_URL + `login?timestamp=${new Date().getTime()}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cache
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userIdToken,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

    const { status } = response;
    const res = await response.json();
    const data = {
      success: res.success,
      message: res.message,
      result: {
        // token,
        admin: {
          id: user.id,
          name: user.name,
          role: user.admin ? 'admin' : 'user',
          email: user.email,
          photo: user.profilePic,
          isLoggedIn: true,
        },
      },
    };
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    if (error.message === 'auth/user-not-admin') {
      error.code = 'auth/user-not-admin';
    }
    if (error.code) {
      error.response = null;
    }
    return errorHandler(error);
  }
};
export const logout = async () => {
  // axios.defaults.withCredentials = true;
  try {
    window.localStorage.clear();
    auth.signOut();
    await axios.post(API_BASE_URL + `logout?timestamp=${new Date().getTime()}`);
  } catch (error) {
    return errorHandler(error);
  }
};
