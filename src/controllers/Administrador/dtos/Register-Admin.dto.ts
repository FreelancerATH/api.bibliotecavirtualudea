

export class RegisterAdminDTO {

  private constructor(
    public readonly nombre: string,
    public readonly correo: string,
    public readonly password: string,
    public readonly telefono: string,
    public readonly area: string,
  ) { }


  static createAdmin(object: { [key: string]: any }): [string?, RegisterAdminDTO?] {
    const { nombre, correo, password, telefono, area } = object;

    if (!nombre) return ['missing name']
    if (!correo) return ['missing correo']
    if (!telefono) return ['missing telefono']
    if (!password) return ['missing password']
    if (!area) return ['missing area']

    return [undefined, new RegisterAdminDTO(nombre, correo, password, telefono, area)];

  }

}