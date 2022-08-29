import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
import { useNotificationDispatch } from '@tensoremr/notification';

const DEBOUNCE_SAVE_DELAY_MS = 1000;

interface AutosaveProps {
  isLoading?: boolean;
  data: any;
  onSave: (data: any) => void;
}

export const Autosave = ({ data, isLoading, onSave }: AutosaveProps) => {
  const notifDispatch = useNotificationDispatch();

  // This is the side effect we want to run on users' changes.
  // In this example, we persist the changes in the localStorage.
  const saveExperimentData = useCallback((newData) => {
    if (!_.isEqual(data, newData) && !_.isEmpty(newData)) {
      onSave(newData);
    }
  }, []);

  const debouncedSave = useCallback(
    _.debounce((newData: any) => {
      saveExperimentData(newData);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
  );

  // The magic useEffect hook. This runs only when `experimentData.name` changes.
  // We could add more properties, should we want to listen for their changes.
  useEffect(() => {
    if (data) {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  useEffect(() => {
    if (isLoading !== undefined) {
      if (isLoading === true) {
        notifDispatch({
          type: 'showSavingNotification',
        });
      } else {
        notifDispatch({
          type: 'showSavedNotification',
        });
      }
    }
  }, [isLoading, notifDispatch]);

  // Do not display anything on the screen.
  return null;
};
