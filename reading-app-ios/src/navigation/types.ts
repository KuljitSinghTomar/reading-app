import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MapExplorer: undefined;
  ActivityIntro: { lessonIndex: number };
  HearSay: { lessonIndex: number };
  TraceCanvas: { lessonIndex: number };
  BlenderBridge: { lessonIndex: number };
  Celebration: { lessonIndex: number };
  StoryLibrary: undefined;
  StoryReader: { bookIndex: number };
  StickerBook: undefined;
  ParentDashboard: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
