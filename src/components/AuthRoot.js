import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticateUser,
  getFromLocalStorage,
  setToLocalStorage,
} from "../helpers/helperFunctions";
import { authAction } from "../store/authStore";
import LoadingData from "./UI/LoadingData";
export default function AuthRoot(props) {
  const dispath = useDispatch();
  const authData = useSelector((state) => state.authStore);
  // console.log("auth data is", authData);
  // console.log("i am running login route");
  const location = useLocation();
  useEffect(() => {
    // console.log("i am running protecteed route useeffect");
    if (!authData.loggedIn) {
      const checkAuth = async () => {
        const localData = getFromLocalStorage("loginInfo", true);
        if (localData == -1) {
          // console.log("logged out now");
          dispath(
            authAction.setAuthStatus({
              userName: "",
              loggedIn: false,
              accessToken: null,
              refreshToken: null,
              userId: null,
              user_type: null,
              timeOfLogin: null,
              logInOperation: 0,
            })
          );
          return;
        }
        const response = await authenticateUser(
          localData.timeOfLogin,
          localData.refreshToken
        );
        // console.log("here response is", response);
        if (response === -1) {
          dispath(
            authAction.setAuthStatus({
              userName: "",
              loggedIn: false,
              accessToken: null,
              refreshToken: null,
              userId: null,
              user_type: null,
              timeOfLogin: null,
              logInOperation: 0,
            })
          );
          // console.log("i am returning");
          return;
        }
        if (response === true) {
          // console.log("dispatching it");
          dispath(
            authAction.setAuthStatus({
              userName: localData.userName,
              loggedIn: localData.loggedIn,
              accessToken: localData.accessToken,
              refreshToken: localData.refreshToken,
              userId: localData.userId,
              user_type: localData.user_type,
              timeOfLogin: localData.timeOfLogin,
              logInOperation: 1,
            })
          );
          const timeDiff = Date.now() - localData.timeOfLogin;
          setTimeout(() => {
            // console.log("time difference in ms is", timeDiff);
            dispath(
              authAction.setAuthStatus({
                userName: "",
                loggedIn: false,
                accessToken: null,
                refreshToken: null,
                userId: null,
                user_type: null,
                timeOfLogin: null,
                logInOperation: -1,
              })
            );
          }, timeDiff);
          return;
        }
        // console.log("response is ", response?.access.length);
        if (!response?.access.length) {
          dispath(
            authAction.setAuthStatus({
              userName: "",
              loggedIn: false,
              accessToken: null,
              refreshToken: null,
              userId: null,
              user_type: null,
              timeOfLogin: null,
              logInOperation: 0,
            })
          );
        }
        const localObj = {
          accessToken: response.access,
          refreshToken: localData.refreshToken,
          user_type: localData.user_type,
          userId: localData.userId,
          timeOfLogin: localData.timeOfLogin,
          userName: localData.userName,
        };
        // console.log("localobj is", localObj);
        setToLocalStorage("loginInfo", localObj, true);
        dispath(
          authAction.setAuthStatus({
            userName: localData.userName,
            loggedIn: true,
            accessToken: response.access,
            refreshToken: localData.refreshToken,
            user_type: localData.user_type,
            userId: localData.userId,
            timeOfLogin: localData.timeOfLogin,
            logInOperation: 1,
          })
        );
        setTimeout(
          () =>
            dispath(
              authAction.setAuthStatus({
                userName: "",
                loggedIn: false,
                accessToken: null,
                refreshToken: null,
                userId: null,
                user_type: null,
                timeOfLogin: null,
                logInOperation: -1,
              })
            ),
          1000 * 60 * 30
        );
      };
      checkAuth();
    }
  }, [authData.loggedIn]);

  if (authData.logInOperation === -1) {
    return <LoadingData className="loading-spinner" />;
  } else if (authData.logInOperation === 0) {
    return props.children;
  } else if (authData.logInOperation) {
    return <Navigate to="/" />;
  }
}
