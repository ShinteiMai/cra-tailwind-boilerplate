import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { SliceTypes } from "./types";

type StatusHandler = {
  initialize: ActionCreatorWithPayload<any, string>;
  success: ActionCreatorWithPayload<any, string>;
  error: ActionCreatorWithPayload<any, string>;
};

export const wrapReduxAsyncHandler = (
  statusHandler: StatusHandler,
  reducerType: SliceTypes,
  callback: (dispatch: Dispatch<any>, args: any) => Promise<void>
) => (args: any) => async (dispatch: Dispatch<any>) => {
  dispatch(statusHandler.initialize({ reducerType }));

  callback(dispatch, args)
    .then(() => {
      dispatch(statusHandler.success({ reducerType }));
    })
    .catch((err) => {
      if (err.message) {
        const error = JSON.parse(err.message);
        error.messages.forEach((object: any) => {
          dispatch(statusHandler.error({ ...object, reducerType }));
          console.error(
            `Request failed with status code of ${error.statusCode} - ${object.message}`
          );
        });
      } else {
        console.error(err);
      }
    });
};
