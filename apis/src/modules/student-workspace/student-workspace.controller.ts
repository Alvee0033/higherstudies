import {Body,Controller,Delete,Get,Param,ParseUUIDPipe,Patch,Post,Put,Req,UseGuards} from '@nestjs/common';
import {IsObject} from 'class-validator';
import {StudentGuard,type StudentRequest} from '../auth/student.guard.js';
import {StudentWorkspaceService} from './student-workspace.service.js';
class DocumentDto {@IsObject() data!:Record<string,unknown>;}
@Controller('v1/student/workspace') @UseGuards(StudentGuard)
export class StudentWorkspaceController {
 constructor(private readonly workspace:StudentWorkspaceService){}
 @Get('summary') summary(@Req() req:StudentRequest){return this.workspace.summary(req.student.id);}
 @Get('applications/:id') application(@Req() req:StudentRequest,@Param('id',ParseUUIDPipe) id:string){return this.workspace.application(req.student.id,id);}
 @Get('profile') profile(@Req() req:StudentRequest){return this.workspace.document(req.student.id,'profile');}
 @Put('profile') saveProfile(@Req() req:StudentRequest,@Body() body:DocumentDto){return this.workspace.saveDocument(req.student.id,'profile',body.data);}
 @Get('settings') settings(@Req() req:StudentRequest){return this.workspace.document(req.student.id,'settings');}
 @Put('settings') saveSettings(@Req() req:StudentRequest,@Body() body:DocumentDto){return this.workspace.saveDocument(req.student.id,'settings',body.data);}
 @Get('applications') applications(@Req() req:StudentRequest){return this.workspace.applications(req.student.id);}
 @Post('applications') create(@Req() req:StudentRequest,@Body() body:DocumentDto){return this.workspace.saveApplication(req.student.id,body.data);}
 @Patch('applications/:id') update(@Req() req:StudentRequest,@Param('id',ParseUUIDPipe) id:string,@Body() body:DocumentDto){return this.workspace.saveApplication(req.student.id,body.data,id);}
 @Delete('applications/:id') remove(@Req() req:StudentRequest,@Param('id',ParseUUIDPipe) id:string){return this.workspace.removeApplication(req.student.id,id);}
 @Get('saved') saved(@Req() req:StudentRequest){return this.workspace.saved(req.student.id);}
 @Post('saved/:kind/:id') save(@Req() req:StudentRequest,@Param('kind') kind:string,@Param('id',ParseUUIDPipe) id:string){return this.workspace.saveItem(req.student.id,kind,id);}
 @Delete('saved/:kind/:id') unsave(@Req() req:StudentRequest,@Param('kind') kind:string,@Param('id',ParseUUIDPipe) id:string){return this.workspace.saveItem(req.student.id,kind,id,true);}
}
