import { IsNotEmpty, IsString, Matches } from "class-validator";
import { validateEnv } from "../../../../lib/class-validator/validate-env";

export class JwtConfig {
  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(ms|s|m|h|d)$/)
  JWT_ACCESS_EXP: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_KEY: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(ms|s|m|h|d)$/)
  JWT_REFRESH_EXP: string;
}

export const JWT_CONFIG = validateEnv(JwtConfig);
