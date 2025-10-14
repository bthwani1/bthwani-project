import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './services/cart.service';
import { SheinCartService } from './services/shein-cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  AddNoteDto,
  AddDeliveryAddressDto,
} from './dto/add-to-cart.dto';
import {
  AddToSheinCartDto,
  UpdateSheinCartItemDto,
  UpdateSheinShippingDto,
} from './dto/shein-cart.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly sheinCartService: SheinCartService,
  ) {}

  // ==================== Regular Cart (DeliveryCart) ====================

  @Get()
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على سلتي' })
  async getMyCart(@CurrentUser('id') userId: string) {
    return this.cartService.getOrCreateCart(userId);
  }

  @Post('items')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إضافة منتج للسلة' })
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:productId')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تحديث كمية منتج' })
  async updateCartItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(userId, productId, dto);
  }

  @Delete('items/:productId')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'حذف منتج من السلة' })
  async removeFromCart(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تفريغ السلة' })
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Patch('note')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إضافة ملاحظة' })
  async addNote(@CurrentUser('id') userId: string, @Body() dto: AddNoteDto) {
    return this.cartService.addNote(userId, dto.note);
  }

  @Patch('delivery-address')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إضافة عنوان التوصيل' })
  async addDeliveryAddress(
    @CurrentUser('id') userId: string,
    @Body() dto: AddDeliveryAddressDto,
  ) {
    return this.cartService.addDeliveryAddress(userId, dto);
  }

  @Get('count')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'عدد العناصر في السلة' })
  async getCartCount(@CurrentUser('id') userId: string) {
    const count = await this.cartService.getItemsCount(userId);
    return { count };
  }

  // ==================== Shein Cart ====================

  @Get('shein')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على سلة Shein' })
  async getMySheinCart(@CurrentUser('id') userId: string) {
    return this.sheinCartService.getOrCreateCart(userId);
  }

  @Post('shein/items')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إضافة منتج Shein للسلة' })
  async addToSheinCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToSheinCartDto,
  ) {
    return this.sheinCartService.addItem(userId, dto);
  }

  @Patch('shein/items/:sheinProductId')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تحديث كمية منتج Shein' })
  async updateSheinCartItem(
    @CurrentUser('id') userId: string,
    @Param('sheinProductId') sheinProductId: string,
    @Body() dto: UpdateSheinCartItemDto,
  ) {
    return this.sheinCartService.updateItemQuantity(
      userId,
      sheinProductId,
      dto,
    );
  }

  @Delete('shein/items/:sheinProductId')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'حذف منتج Shein من السلة' })
  async removeFromSheinCart(
    @CurrentUser('id') userId: string,
    @Param('sheinProductId') sheinProductId: string,
  ) {
    return this.sheinCartService.removeItem(userId, sheinProductId);
  }

  @Delete('shein')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تفريغ سلة Shein' })
  async clearSheinCart(@CurrentUser('id') userId: string) {
    return this.sheinCartService.clearCart(userId);
  }

  @Patch('shein/shipping')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تحديث تكاليف الشحن' })
  async updateSheinShipping(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateSheinShippingDto,
  ) {
    return this.sheinCartService.updateShipping(userId, dto);
  }

  @Patch('shein/note')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إضافة ملاحظة لسلة Shein' })
  async addSheinNote(
    @CurrentUser('id') userId: string,
    @Body() dto: AddNoteDto,
  ) {
    return this.sheinCartService.addNote(userId, dto.note);
  }

  // ==================== Combined Cart (دمج السلات) ====================

  @Get('combined')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على السلة الموحدة' })
  async getCombinedCart(@CurrentUser('id') userId: string) {
    const [regularCart, sheinCart] = await Promise.all([
      this.cartService.getOrCreateCart(userId),
      this.sheinCartService.getOrCreateCart(userId),
    ]);

    return {
      regularCart: {
        items: regularCart.items,
        total: regularCart.total,
        itemsCount: regularCart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      },
      sheinCart: {
        items: sheinCart.items,
        subtotal: sheinCart.subtotal,
        shipping: sheinCart.internationalShipping + sheinCart.localShipping,
        serviceFee: sheinCart.serviceFee,
        total: sheinCart.total,
        itemsCount: sheinCart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      },
      grandTotal: regularCart.total + sheinCart.total,
    };
  }

  @Delete('combined/clear-all')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تفريغ كل السلات' })
  async clearAllCarts(@CurrentUser('id') userId: string) {
    await Promise.all([
      this.cartService.clearCart(userId),
      this.sheinCartService.clearCart(userId),
    ]);
    return { message: 'تم تفريغ كل السلات بنجاح' };
  }
}
