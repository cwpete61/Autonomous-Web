import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';

export class GenerateEmailsDto {
    industry: string;
    pain_point_signal: string;
    primary_outcome: string;
    secondary_outcome?: string;
    sender_name: string;
    sender_company: string;
    step_count: number; // 3 | 4 | 5
}

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-emails')
    async generateEmails(@Body() dto: GenerateEmailsDto) {
        const { step_count } = dto;

        if (step_count < 3 || step_count > 5) {
            throw new HttpException(
                'step_count must be between 3 and 5',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.aiService.generateEmailSequence(dto);
    }
}
