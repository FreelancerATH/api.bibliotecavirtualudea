

export class LoginAdminDTO {

  private constructor(
    public readonly correo: string,
    public readonly password: string,

  ) { }


  static createAdmin(object: { [key: string]: any }): [string?, LoginAdminDTO?] {
    const { correo, password } = object;

    if (!correo) return ['missing correo']
    if (!password) return ['missing password']

    return [undefined, new LoginAdminDTO(correo, password)];

  }
}