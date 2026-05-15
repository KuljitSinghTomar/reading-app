import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type ActivityStackParamList = {
  Home: undefined;
  PhonicsLab: undefined;
  SwipeReader: undefined;
  WordBlender: undefined;
  VoiceReadAlong: undefined;
};

export type RootTabParamList = {
  Learning: undefined;
  Progress: undefined;
  Parent: undefined;
};

export type ActivityStackScreenProps<T extends keyof ActivityStackParamList> =
  NativeStackScreenProps<ActivityStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, T>,
  NativeStackScreenProps<ActivityStackParamList>
>;
