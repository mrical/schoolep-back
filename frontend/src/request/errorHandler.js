import { notification } from 'antd';
import history from '@/utils/history';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 10,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });
    if (response.data && response.data.jwtExpired) {
      history.push('/logout');
    }
    return response.data;
  } else if (error.code) {
    let errorText = '';
    switch (error.code) {
      case 'auth/invalid-email':
        errorText = 'Wrong email address, please write it corectly.';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'Wrong email address',
          description: errorText,
        });
        break;
      case 'auth/wrong-password':
        errorText = 'Uppss, wrong passwrod, check if you typed it alright and try it again.';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'Wrong password',
          description: errorText,
        });
        break;
      case 'auth/user-not-found':
        errorText = 'User not found, carefuly chceck your email address.';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'User not found',
          description: errorText,
        });
        break;
      case 'auth/user-not-admin':
        errorText = 'User not Admin, carefuly chceck your email address.';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'User not Admin',
          description: errorText,
        });
        break;
      case 'auth/too-many-requests':
        errorText = 'Too many requests, try it leter';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'Too many requests',
          description: errorText,
        });
        break
      case 'auth/network-request-failed':
        errorText = 'Cannot connect to the server, Check your internet network';
        notification.config({
          duration: 10,
        });
        notification.error({
          message: 'No internet connection',
          description: errorText,
        });
    }
    return {
      success: false,
      result: null,
      message: errorText,
    };
  } else {
    notification.config({
      duration: 5,
    });
    notification.error({
      message: 'No internet connection',
      description: 'Cannot connect to the server, Check your internet network',
    });
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Check your internet network',
    };
  }
};

export default errorHandler;
