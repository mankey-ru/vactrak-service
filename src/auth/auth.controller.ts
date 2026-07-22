import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramLoginDto } from './dto/telegram-login.dto';
import { CreateApiTokenDto } from './dto/create-api-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './auth.types';

@Controller('/api/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Exchange Telegram Login Widget payload for a JWT.
	 * Future Nuxt `/login` posts the widget callback fields here.
	 */
	@Post('telegram')
	@HttpCode(200)
	async loginTelegram(@Body() body: TelegramLoginDto) {
		return this.authService.loginWithTelegram(body);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async me(@CurrentUser() user: AuthUser) {
		return this.authService.getMe(user.id);
	}

	/** Create a long-lived API token (e.g. for userscript). Raw token returned once. */
	@Post('tokens')
	@UseGuards(JwtAuthGuard)
	async createToken(@CurrentUser() user: AuthUser, @Body() body: CreateApiTokenDto) {
		return this.authService.createApiToken(user.id, body.label);
	}

	@Get('tokens')
	@UseGuards(JwtAuthGuard)
	async listTokens(@CurrentUser() user: AuthUser) {
		return this.authService.listApiTokens(user.id);
	}

	@Delete('tokens/:tokenId')
	@UseGuards(JwtAuthGuard)
	async revokeToken(
		@CurrentUser() user: AuthUser,
		@Param('tokenId', ParseIntPipe) tokenId: number,
	) {
		return this.authService.revokeApiToken(user.id, String(tokenId));
	}
}
