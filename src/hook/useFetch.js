import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFromLocalStorage } from "../helpers/helperFunctions";
import { authAction } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../store/uiStore";

function useFetch() {
  // states and reducer
  const [status, setStatus] = useState({ isLoading: false, isError: false });
  const [sendData, setSendData] = useState({
    url: "",
    fetchObj: "",
    timeOut: 0,
  });
  const [response, setResponse] = useState();

  // react-router
  const navigate = useNavigate();

  // redux
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();

  // function starts
  const fetchReq = async function (url, fetchObj) {
    try {
      const request = await fetch(
        `http://tubemastercrm.com/crm/api/${url}`,
        fetchObj
      );
      const response = await request.json();
      return { status: request.status, data: response, isError: !request.ok };
    } catch (e) {
      return { status: -1, isNetwork: true, data: {}, isError: true };
    }
  };
  const doLogin = async function () {
    const localData = getFromLocalStorage("loginInfo", true);
    if (authData.logInOperation === 0 || authData.logInOperation === 1) {
      // mean already refresh token thing started or token refreshed
      return;
    }
    dispatch(
      authAction.setAuthStatus({
        ...authData,
        logInOperation: 0,
      })
    );

    const response = await fetchReq("token/refresh/", {
      headers: {
        // "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        refresh: localData.refreshToken,
      }),
    });
    if (response.status === 200) {
      const localObj = {
        ...localData,
        accessToken: response.data.access,
        timeOfLogin: Date.now(),
      };
      dispatch(
        authAction.setAuthStatus({
          userName: localData.userName,
          loggedIn: true,
          accessToken: localData.accessToken,
          refreshToken: localData.refreshToken,
          userId: localData.userId,
          user_type: localData.user_type,
          timeOfLogin: localData.timeOfLogin,
          logInOperation: 1,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const ajaxRequest = async function (timeOut, url, fetchObj) {
    try {
      console.log("will start request");
      const id = setTimeout(() => {
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: "",
            msg: `Taking Longer Then Expected...`,
          })
        );
      }, sendData.timeOut);
      const response = await fetchReq(sendData.url, sendData.fetchObj);
      clearTimeout(id);
      const data = await response.json();
      if (data.status === 401) {
        // authorize usr again
        doLogin();
        return;
      }
      return {
        status: response.status,
        isError: !response.ok,
        isNetwork: false,
        data,
      };
    } catch (e) {
      return {
        status: null,
        isError: true,
        isNetwork: true,
        data: null,
        error: e,
      };
    }
  };

  useEffect(() => {});
}

export default useFetch;
