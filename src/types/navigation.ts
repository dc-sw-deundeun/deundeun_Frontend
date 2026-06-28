import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  History: undefined;
  Growth: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Terms: undefined;
  DeviceSync: undefined;
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Details: {
    itemId: number;
    otherParam?: string;
  };
  HealthReport: {
    date: string;
    bloodSugar?: number;
    bloodPressure?: string;
    cholesterol?: number;
    bmi?: number;
  } | undefined;
  EditResults: undefined;
  SearchBrowse: undefined;
  ChangePassword: undefined;
  ConnectedApps: undefined;
  Notifications: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

