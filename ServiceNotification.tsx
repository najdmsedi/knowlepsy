// // import PushNotification from 'react-native-push-notification';

// // const createNotificationChannel = () => {
// //   PushNotification.createChannel(
// //     {
// //       channelId: "default-channel-id", // (required)
// //       channelName: "Default Channel", // (required)
// //       channelDescription: "A default channel", // (optional) default: undefined.
// //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
// //       importance: 4, // (optional) default: 4. Int value of the Android notification importance
// //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
// //     },
// //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
// //   );
// // };

// // export default createNotificationChannel;
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';

// // async function requestUserPermission() {
// //     const authStatus = await messaging().requestPermission();
// //     const enabled =
// //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// //     if (enabled) {
// //         console.log('Authorization status:', authStatus);
// //         GetFCMToke();
// //     }
// // }

// // async function GetFCMToke() {
// //     let fcmtoken = await AsyncStorage.getItem("fcmtoken");
// //     console.log(fcmtoken, "old token");
// //     if (!fcmtoken) {
// //         try {
// //             const fcmtoken = await messaging().getToken();
// //             if (fcmtoken) {
// //                 console.log(fcmtoken, "new token");
// //                 await AsyncStorage.setItem("fcmtoken", fcmtoken);
// //             } else {

// //             }
// //         } catch (error) {
// //             console.log(error, "error in fcmtoken");
// //         }
// //     }
// // }

// class PushNotificationConfig {
//     static configure() {
//         PushNotification.configure({
//             onRegister: function (token) {
//                 console.log("TOKEN:", token);
//             },

//             onNotification: function (notification) {
//                 console.log("NOTIFICATION:", notification);
//                 notification.finish(PushNotificationIOS.FetchResult.NoData);
//             },

//             onAction: function (notification) {
//                 console.log("ACTION:", notification.action);
//                 console.log("NOTIFICATION:", notification);
//             },

//             onRegistrationError: function (err) {
//                 console.error(err.message, err);
//             },

//             permissions: {
//                 alert: true,
//                 badge: true,
//                 sound: true,
//             },

//             popInitialNotification: true,

//             requestPermissions: true,
//         });
//     }
// }
// // Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
// });

// export default PushNotificationConfig;




// async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//         GetFCMToke();
//     }
// }

// async function GetFCMToke() {
//     let fcmtoken = await AsyncStorage.getItem("fcmtoken");
//     console.log(fcmtoken, "old token");
//     if (!fcmtoken) {
//         try {
//             const fcmtoken = await messaging().getToken();
//             if (fcmtoken) {
//                 console.log(fcmtoken, "new token");
//                 await AsyncStorage.setItem("fcmtoken", fcmtoken);
//             } else {

//             }
//         } catch (error) {
//             console.log(error, "error in fcmtoken");
//         }
//     }
// }