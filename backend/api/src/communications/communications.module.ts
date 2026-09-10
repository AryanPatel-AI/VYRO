import { Module } from '@nestjs/common';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { AiModule } from '../ai/ai.module';

@Module({ imports: [AiModule], controllers: [CommunicationsController], providers: [CommunicationsService] })
export class CommunicationsModule {}
