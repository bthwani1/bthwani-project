import { Controller, Get, Post, Body, Param, Query, Patch, Delete, HttpStatus } from '@nestjs/common';
import { 
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces
} from '@nestjs/swagger';
import { ArabonService } from './arabon.service';
import CreateArabonDto from './dto/create-arabon.dto';
import UpdateArabonDto from './dto/update-arabon.dto';

@ApiTags('عربون — العروض والحجوزات بعربون')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller('arabon')
export class ArabonController {
  constructor(private readonly service: ArabonService) {}

  @Post()
  @ApiOperation({ 
    summary: 'إنشاء عرض/حجز بعربون',
    description: 'إنشاء سجل جديد لعربون يتضمن المبلغ والجدولة'
  })
  @ApiBody({
    description: 'بيانات العربون',
    schema: {
      type: 'object',
      required: ['ownerId', 'title'],
      properties: {
        ownerId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'عربون لحجز عرض سياحي' },
        description: { type: 'string', example: 'حجز عرض لمدة نهاية الأسبوع' },
        depositAmount: { type: 'number', example: 250.5, description: 'قيمة العربون' },
        scheduleAt: { type: 'string', format: 'date-time', example: '2025-06-01T10:00:00.000Z' },
        metadata: { type: 'object', example: { guests: 2, notes: 'بدون تدخين' } },
        status: { type: 'string', enum: ['draft','pending','confirmed','completed','cancelled'], default: 'draft' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء العربون بنجاح' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات غير صحيحة' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  create(@Body() dto: CreateArabonDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'قائمة العربونات',
    description: 'استرجاع قائمة العربونات مع دعم التنقل بالـ cursor'
  })
  @ApiQuery({ name: 'cursor', required: false, description: 'مؤشر الصفحة التالية', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الاسترجاع بنجاح' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  findAll(@Query('cursor') cursor?: string) {
    return this.service.findAll({ cursor });
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل عربون', description: 'استرجاع عربون بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الاسترجاع بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'غير موجود' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث عربون', description: 'تحديث بيانات العربون' })
  @ApiParam({ name: 'id', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiBody({
    description: 'الحقول الممكن تحديثها',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'عربون محدث' },
        description: { type: 'string', example: 'تفاصيل محدثة' },
        depositAmount: { type: 'number', example: 300 },
        scheduleAt: { type: 'string', format: 'date-time', example: '2025-06-10T12:00:00.000Z' },
        metadata: { type: 'object', example: { guests: 3 } },
        status: { type: 'string', enum: ['draft','pending','confirmed','completed','cancelled'], example: 'confirmed' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم التحديث بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'غير موجود' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات غير صحيحة' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  update(@Param('id') id: string, @Body() dto: UpdateArabonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف عربون', description: 'حذف سجل العربون نهائياً' })
  @ApiParam({ name: 'id', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الحذف بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'غير موجود' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
