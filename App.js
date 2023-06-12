import "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';
import App from "./app/index";
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
export default App;
