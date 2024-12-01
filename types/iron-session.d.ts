import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      // 필요한 다른 사용자 정보들
    };
  }
}