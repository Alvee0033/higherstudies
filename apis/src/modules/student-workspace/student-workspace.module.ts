import {Module} from '@nestjs/common';import {AuthModule} from '../auth/auth.module.js';import {StudentWorkspaceController} from './student-workspace.controller.js';import {StudentWorkspaceService} from './student-workspace.service.js';
@Module({imports:[AuthModule],controllers:[StudentWorkspaceController],providers:[StudentWorkspaceService]})export class StudentWorkspaceModule{}
