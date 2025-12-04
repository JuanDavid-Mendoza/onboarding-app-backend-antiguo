import { Response } from 'express';

export class ResponseMessage {
  static ok(res: Response, message: string = 'Operación exitosa'): Response {
    return res.status(200).json({
      success: true,
      message
    });
  }

  static success(res: Response, data: any, message: string = 'Operación exitosa'): Response {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static unauthorized(res: Response, message: string = 'Acceso no autorizado'): Response {
    return res.status(401).json({
      success: false,
      message
    });
  }

  static created(res: Response, data?: any, message: string = 'Registro creado exitosamente'): Response {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  static updated(res: Response, data?: any, message: string = 'Registro actualizado exitosamente'): Response {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static deleted(res: Response, data?: any, message: string = 'Registro eliminado exitosamente'): Response {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static serverError(res: Response, message: string = 'Ocurrió un error inesperado'): Response {
    return res.status(500).json({
      success: false,
      message
    });
  }
}
