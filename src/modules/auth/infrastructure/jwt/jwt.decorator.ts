import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../../domain/jwt-payload";

export const Jwt = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx
    .switchToHttp()
    .getRequest<Request & { jwt: JwtPayload }>();

  return request.jwt;
});
