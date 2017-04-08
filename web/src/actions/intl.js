/* eslint-disable import/prefer-default-export */

import {
  SET_LOCALE_START,
  SET_LOCALE_SUCCESS,
  SET_LOCALE_ERROR,
} from '../constants';

import queryIntl from './intl.graphql';

export function setLocale({ locale }) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: SET_LOCALE_START,
      payload: {
        locale,
      },
    });

    try {
      // WARNING !!
      // do not use client.networkInterface except you want skip Apollo store
      // use client.query if you want benefit from Apollo caching mechanisms
      const { data } = await client.networkInterface.query({
        query: queryIntl,
        variables: { locale },
      });
      const messages = data.intl.reduce((msgs, msg) => {
        msgs[msg.id] = msg.message; // eslint-disable-line no-param-reassign
        return msgs;
      }, {});
      dispatch({
        type: SET_LOCALE_SUCCESS,
        payload: {
          locale,
          messages,
        },
      });

      // remember locale for every new request
      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
      }
    } catch (error) {
      dispatch({
        type: SET_LOCALE_ERROR,
        payload: {
          locale,
          error,
        },
      });
      return false;
    }

    return true;
  };
}
