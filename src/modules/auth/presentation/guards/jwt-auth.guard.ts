import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { fromAsyncThrowable } from "neverthrow";
import { JWT_CONFIG } from "../../infrastructure/jwt/jwt.config";
import { Request } from "express";
import { JwtPayload } from "../../domain/jwt-payload";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { jwt: JwtPayload }>();

    const authorizationHeader = request.headers?.authorization;

    if (!authorizationHeader) {
      return false;
    }

    const parts = authorizationHeader.split(" ");
    if (parts[0] !== "Bearer" || !parts[1]) {
      return false;
    }

    const verifyResult = await fromAsyncThrowable(async () =>
      this.jwtService.verifyAsync(parts[1], {
        secret: JWT_CONFIG.JWT_ACCESS_KEY,
        algorithms: ["HS256"],
      }),
    )();
    if (verifyResult.isErr()) {
      return false;
    }

    request.jwt = verifyResult.value;

    return true;
  }
}
