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
  Login: { prefilledEmail?: string } | undefined;
  ForgotPassword: undefined;
  Register: undefined;
  Terms: undefined;
  DeviceSync: undefined;
  CheckupOcr: undefined;
  CheckupResult: {
    data?: any; // To pass OCR results
  };
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Details: {
    itemId: number;
    otherParam?: string;
  };
  HealthReport: {
    recordId?: number;
    date?: string;
    bloodSugar?: number;
    bloodPressure?: string;
    cholesterol?: number;
    bmi?: number;
  } | undefined;
  EditResults: undefined;
  EditRecord: {
    recordId: number;
  };
  MetricDetail: {
    recordId: number;
    metricCode: string;
    metricName: string;
    value: string;
    unit: string | null;
  };
  SearchBrowse: undefined;
  ChangePassword: undefined;
  EditProfile: {
    nickname: string;
    email: string;
  };
  ConnectedApps: undefined;
  Notifications: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
