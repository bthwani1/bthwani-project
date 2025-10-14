import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,

} from '@mui/material';
import {
  Search as SearchIcon,
  AccountBalance as SettlementIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {
  getSettlements,
  getSettlementById,
  generateSettlement,
  markSettlementAsPaid,
  exportSettlementToCSV,
  type Settlement,
  type SettlementLine
} from '../../api/finance';

const SettlementDetailsDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  onMarkAsPaid: (id: string) => void;
  loading: boolean;
}> = ({ open, onClose, settlement, onMarkAsPaid, loading }) => {
  const [lines, setLines] = useState<SettlementLine[]>([]);

  React.useEffect(() => {
    if (settlement) {
      // Fetch settlement lines
      getSettlementById(settlement.id).then(result => {
        setLines(result.lines || []);
      });
    }
  }, [settlement]);

  if (!settlement) return null;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'ready': return 'info';
      case 'draft': return 'default';
      case 'canceled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckIcon />;
      case 'ready': return <CheckIcon />;
      case 'draft': return <PendingIcon />;
      case 'canceled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'ready': return 'جاهزة';
      case 'draft': return 'مسودة';
      case 'canceled': return 'ملغية';
      default: return status;
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportSettlementToCSV(settlement.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settlement-${settlement.id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        تفاصيل التسوية
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Settlement Summary */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid  size={{xs: 12, md: 6}}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    معلومات التسوية
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">رقم التسوية:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {settlement.id}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">النوع:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {settlement.type === 'driver' ? <PersonIcon /> : <BusinessIcon />}
                        <Typography variant="body2">
                          {settlement.type === 'driver' ? 'سائقين' : 'تجار'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">الحالة:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(settlement.status)}
                        <Chip
                          label={getStatusText(settlement.status)}
                          color={getStatusColor(settlement.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">العملة:</Typography>
                      <Typography variant="body2">{settlement.currency}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid  size={{xs: 12, md: 6}}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    الفترة والمبالغ
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">من تاريخ:</Typography>
                      <Typography variant="body2">{formatDate(settlement.period_start)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">إلى تاريخ:</Typography>
                      <Typography variant="body2">{formatDate(settlement.period_end)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">المبلغ الإجمالي:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatCurrency(settlement.gross_amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">الرسوم:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatCurrency(settlement.fees)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">التعديلات:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatCurrency(settlement.adjustments)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">صافي المبلغ:</Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontFamily: 'monospace' }}>
                        {formatCurrency(settlement.net_amount)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Settlement Lines */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                بنود التسوية ({lines.length})
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>الوصف</TableCell>
                      <TableCell>نوع المرجع</TableCell>
                      <TableCell>رقم المرجع</TableCell>
                      <TableCell align="right">المبلغ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line._id} hover>
                        <TableCell>{line.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={line.ref_type === 'order' ? 'طلب' : 'تعديل يدوي'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          {line.ref_id}
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(line.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Actions */}
          {settlement.status === 'ready' && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                إجراءات
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => onMarkAsPaid(settlement.id)}
                  disabled={loading}
                >
                  تعليم كمدفوعة
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportCSV}
                >
                  تصدير CSV
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
};

const GenerateSettlementDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onGenerate: (data: {
    type: 'driver' | 'vendor';
    period_start: string;
    period_end: string;
  }) => void;
  loading: boolean;
}> = ({ open, onClose, onGenerate, loading }) => {
  const [type, setType] = useState<'driver' | 'vendor'>('driver');
  const [periodStart, setPeriodStart] = useState(dayjs().startOf('month'));
  const [periodEnd, setPeriodEnd] = useState(dayjs().endOf('month'));

  const handleGenerate = () => {
    onGenerate({
      type,
      period_start: periodStart.format('YYYY-MM-DD'),
      period_end: periodEnd.format('YYYY-MM-DD'),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        إنشاء تسوية جديدة
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>نوع التسوية</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as 'driver' | 'vendor')}
              label="نوع التسوية"
            >
              <MenuItem value="driver">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  سائقين
                </Box>
              </MenuItem>
              <MenuItem value="vendor">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  تجار
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="تاريخ البداية"
              value={periodStart}
              onChange={(newValue) => newValue && setPeriodStart(newValue)}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="تاريخ النهاية"
              value={periodEnd}
              onChange={(newValue) => newValue && setPeriodEnd(newValue)}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <ScheduleIcon />}
        >
          إنشاء التسوية
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function FinanceSettlementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState<dayjs.Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<dayjs.Dayjs | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch settlements
  const { data: settlementsData, isLoading, error } = useQuery({
    queryKey: ['finance-settlements', currentPage, pageSize, statusFilter, typeFilter, dateFrom, dateTo],
    queryFn: () => getSettlements({
      page: currentPage,
      perPage: pageSize,
      filters: {
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        period_start: dateFrom?.format('YYYY-MM-DD'),
        period_end: dateTo?.format('YYYY-MM-DD'),
      },
    }),
  });

  // Mutations
  const generateSettlementMutation = useMutation({
    mutationFn: generateSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-settlements'] });
      setGenerateDialogOpen(false);
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: markSettlementAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-settlements'] });
      setDetailsDialogOpen(false);
      setSelectedSettlement(null);
    },
  });

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setDetailsDialogOpen(true);
  };

  const handleMarkAsPaid = (settlementId: string) => {
    markAsPaidMutation.mutate(settlementId);
  };

  const handleGenerateSettlement = (data: {
    type: 'driver' | 'vendor';
    period_start: string;
    period_end: string;
  }) => {
    generateSettlementMutation.mutate(data);
  };

  const settlements = settlementsData?.settlements || [];
  const pagination = settlementsData?.pagination;

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch =
      settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (settlement.notes && settlement.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'ready': return 'info';
      case 'draft': return 'default';
      case 'canceled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckIcon />;
      case 'ready': return <CheckIcon />;
      case 'draft': return <PendingIcon />;
      case 'canceled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'ready': return 'جاهزة';
      case 'draft': return 'مسودة';
      case 'canceled': return 'ملغية';
      default: return status;
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          خطأ في تحميل التسويات: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إدارة التسويات المالية
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={() => setGenerateDialogOpen(true)}
          >
            إنشاء تسوية جديدة
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['finance-settlements'] })}
          >
            تحديث
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="البحث في التسويات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="الحالة"
              >
                <MenuItem value="">الكل</MenuItem>
                <MenuItem value="draft">مسودة</MenuItem>
                <MenuItem value="ready">جاهزة</MenuItem>
                <MenuItem value="paid">مدفوعة</MenuItem>
                <MenuItem value="canceled">ملغية</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>النوع</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="النوع"
              >
                <MenuItem value="">الكل</MenuItem>
                <MenuItem value="driver">سائقين</MenuItem>
                <MenuItem value="vendor">تجار</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="من تاريخ"
                value={dateFrom}
                onChange={setDateFrom}
                slotProps={{
                  textField: {
                    sx: { minWidth: 150 },
                  },
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="إلى تاريخ"
                value={dateTo}
                onChange={setDateTo}
                slotProps={{
                  textField: {
                    sx: { minWidth: 150 },
                  },
                }}
              />
            </LocalizationProvider>

            <Chip
              label={`${filteredSettlements.length} تسوية`}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>رقم التسوية</TableCell>
                  <TableCell>النوع</TableCell>
                  <TableCell>الفترة</TableCell>
                  <TableCell>المبلغ الإجمالي</TableCell>
                  <TableCell>صافي المبلغ</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>تاريخ الإنشاء</TableCell>
                  <TableCell>تاريخ الدفع</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSettlements.map((settlement) => (
                  <TableRow key={settlement._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>
                        {settlement.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {settlement.type === 'driver' ? <PersonIcon /> : <BusinessIcon />}
                        <Typography variant="body2">
                          {settlement.type === 'driver' ? 'سائقين' : 'تجار'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs(settlement.period_start).format('DD/MM')} - {dayjs(settlement.period_end).format('DD/MM/YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatCurrency(settlement.gross_amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {formatCurrency(settlement.net_amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(settlement.status)}
                        <Chip
                          label={getStatusText(settlement.status)}
                          color={getStatusColor(settlement.status)}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(settlement.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {settlement.paid_at ? formatDate(settlement.paid_at) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="عرض التفاصيل">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(settlement)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            السابق
          </Button>

          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            صفحة {pagination.page} من {pagination.pages}
          </Typography>

          <Button
            variant="outlined"
            disabled={currentPage === pagination.pages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            التالي
          </Button>
        </Box>
      )}

      {filteredSettlements.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <SettlementIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">لا توجد تسويات</Typography>
          <Typography variant="body2">
            {searchTerm || statusFilter || typeFilter || dateFrom || dateTo
              ? 'جرب مصطلح بحث مختلف أو تغيير الفلاتر'
              : 'لا توجد تسويات لعرضها'
            }
          </Typography>
        </Box>
      )}

      {/* Settlement Details Dialog */}
      <SettlementDetailsDialog
        open={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedSettlement(null);
        }}
        settlement={selectedSettlement}
        onMarkAsPaid={handleMarkAsPaid}
        loading={markAsPaidMutation.isPending}
      />

      {/* Generate Settlement Dialog */}
      <GenerateSettlementDialog
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        onGenerate={handleGenerateSettlement}
        loading={generateSettlementMutation.isPending}
      />
    </Box>
  );
}
