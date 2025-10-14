import { IsOptional, IsString, IsDateString } from 'class-validator';

export class DashboardStatsDto {
  users: {
    total: number;
    active: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  drivers: {
    total: number;
    available: number;
  };
  vendors: {
    total: number;
  };
  stores: {
    active: number;
  };
}

export class TodayStatsDto {
  newUsers: number;
  newOrders: number;
  deliveredOrders: number;
}

export class OrdersByStatusQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class OrdersByStatusDto {
  _id: string;
  count: number;
}

export class RevenueAnalyticsQueryDto {
  @IsString()
  period: 'daily' | 'weekly' | 'monthly';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class RevenueAnalyticsDto {
  _id: string;
  revenue: number;
  deliveryFees: number;
  platformShare: number;
  orderCount: number;
}

export class LiveMetricsDto {
  activeOrders: number;
  activeDrivers: number;
  recentOrders: number;
}
