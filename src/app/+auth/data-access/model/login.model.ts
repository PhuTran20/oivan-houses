export namespace LoginModel {
  export type Request = {
    type: 'auth';
    attributes: LoginRequestAttributes;
  };

  export type Response = {
    type: 'auth';
    attributes: {
      token: string;
    };
  };

  export type LoginRequestAttributes = {
    username: string;
    password: string;
  };
}