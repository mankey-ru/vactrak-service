import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Strict JWT-only guard (browser session). */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
