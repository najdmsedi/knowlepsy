/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification, {Importance} from 'react-native-push-notification';

AppRegistry.registerComponent(appName, () => App);

PushNotification.createChannel(
  {
    channelId: "channel-id",
    channelName: "My channel",
    channelDescription: "A channel to categorise your notifications",
    playSound: true,
    soundName: "default",
    importance: Importance.HIGH, 
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`)
);


PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);  
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },
  
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
  
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
  
    requestPermissions: true,
  });